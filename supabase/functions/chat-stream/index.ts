import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
  projectId?: string
  conversationId?: string
  systemPrompt?: string
  model?: string
  maxTokens?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const body: RequestBody = await req.json()
    const {
      messages,
      projectId,
      conversationId,
      systemPrompt = 'Você é um assistente especializado em desenvolvimento de software.',
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
    } = body

    if (!messages || messages.length === 0) {
      throw new Error('Messages are required')
    }

    // Fetch Claude API key from Supabase secrets
    const { data: secret, error: secretError } = await supabaseClient
      .from('user_settings')
      .select('anthropic_api_key')
      .eq('user_id', user.id)
      .single()

    let claudeApiKey = secret?.anthropic_api_key

    // Fallback to global API key if user doesn't have one
    if (!claudeApiKey) {
      // Get from Supabase vault/secrets (stored as 'api_key_claude')
      claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    }

    if (!claudeApiKey) {
      throw new Error('Claude API key not configured')
    }

    // Make request to Claude API with streaming
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages,
        system: systemPrompt,
        stream: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Claude API error: ${response.status} - ${errorText}`)
    }

    // Create a transform stream to handle the streaming response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Process the streaming response
    ;(async () => {
      try {
        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        let buffer = ''
        let inputTokens = 0
        let outputTokens = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = new TextDecoder().decode(value)
          buffer += chunk

          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)

              if (data === '[DONE]') {
                continue
              }

              try {
                const parsed = JSON.parse(data)

                // Handle different event types
                if (parsed.type === 'content_block_delta') {
                  if (parsed.delta?.type === 'text_delta') {
                    // Send text chunks to client
                    await writer.write(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: 'token', content: parsed.delta.text })}\n\n`,
                      ),
                    )
                  }
                } else if (parsed.type === 'message_start') {
                  inputTokens = parsed.message?.usage?.input_tokens || 0
                } else if (parsed.type === 'message_delta') {
                  outputTokens = parsed.usage?.output_tokens || 0
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e)
              }
            }
          }
        }

        // Send usage information at the end
        const totalTokens = inputTokens + outputTokens
        const costUsd =
          (inputTokens / 1_000_000) * 3.0 + (outputTokens / 1_000_000) * 15.0

        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'usage',
              usage: {
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                total_tokens: totalTokens,
                cost_usd: costUsd,
              },
            })}\n\n`,
          ),
        )

        // Save to database if conversationId and projectId are provided
        if (conversationId && projectId) {
          // This would be handled by the client after receiving the complete message
          // Or we could save it here, but it's better to let the client handle it
        }

        await writer.write(encoder.encode('data: [DONE]\n\n'))
        await writer.close()
      } catch (error) {
        console.error('Streaming error:', error)
        await writer.abort(error)
      }
    })()

    return new Response(stream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
