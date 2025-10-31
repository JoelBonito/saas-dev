import { supabase } from '@/lib/supabase/client'
import type {
  ChatCompletionRequest,
  StreamingOptions,
  TokenUsage,
} from './types'

/**
 * Calculate the estimated cost based on token usage
 * Pricing for Claude 3.5 Sonnet (as of 2024):
 * Input: $3 per million tokens
 * Output: $15 per million tokens
 */
export function calculateCost(usage: TokenUsage): number {
  const inputCost = (usage.input_tokens / 1_000_000) * 3.0
  const outputCost = (usage.output_tokens / 1_000_000) * 15.0
  return inputCost + outputCost
}

/**
 * Get the Supabase Functions URL
 */
function getFunctionsUrl(): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
  return `${supabaseUrl}/functions/v1`
}

/**
 * Send a chat completion request with streaming support via Supabase Edge Function
 */
export async function sendChatMessage(
  request: ChatCompletionRequest,
  options?: StreamingOptions,
): Promise<{ text: string; usage: TokenUsage }> {
  const { messages, system, projectId, conversationId } = request

  try {
    options?.onStart?.()

    // Get the current session for auth
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('No active session. Please log in.')
    }

    // Call the Edge Function with streaming
    const response = await fetch(`${getFunctionsUrl()}/chat-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        messages,
        systemPrompt: system,
        projectId,
        conversationId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      )
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''
    let usage: TokenUsage = {
      input_tokens: 0,
      output_tokens: 0,
      total_tokens: 0,
      cost_usd: 0,
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            if (data === '[DONE]') {
              continue
            }

            try {
              const parsed = JSON.parse(data)

              if (parsed.type === 'token') {
                const token = parsed.content
                fullText += token
                options?.onToken?.(token)
              } else if (parsed.type === 'usage') {
                usage = parsed.usage
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    options?.onComplete?.(fullText, usage)

    return { text: fullText, usage }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error : new Error('Unknown error occurred')
    options?.onError?.(errorMessage)
    throw errorMessage
  }
}

/**
 * Analyze a task and get recommendations
 */
export async function analyzeTask(
  prompt: string,
  projectId: string,
): Promise<{
  task_type: string
  optimal_tool: string
  recommendation: string
  reasoning: string
  estimated_tokens: number
}> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('No active session. Please log in.')
  }

  const response = await fetch(`${getFunctionsUrl()}/analyze-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      prompt,
      projectId,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
