import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  prompt: string
  projectId: string
}

interface TaskAnalysis {
  task_type: string
  optimal_tool: 'claude-code' | 'cursor' | 'claude-chat'
  recommendation: string
  reasoning: string
  estimated_tokens: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      },
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const body: RequestBody = await req.json()
    const { prompt, projectId } = body

    if (!prompt || !projectId) {
      throw new Error('Prompt and projectId are required')
    }

    // Fetch Claude API key
    const { data: secret } = await supabaseClient
      .from('user_settings')
      .select('anthropic_api_key')
      .eq('user_id', user.id)
      .single()

    const claudeApiKey =
      secret?.anthropic_api_key || Deno.env.get('api_key_claude') || Deno.env.get('CLAUDE_API_KEY')

    if (!claudeApiKey) {
      throw new Error('Claude API key not configured')
    }

    // Analyze the task using Claude
    const analysisPrompt = `Analise a seguinte tarefa de desenvolvimento e determine:
1. O tipo de tarefa (ex: "refatoração", "nova feature", "bug fix", "documentação", etc)
2. A ferramenta mais adequada para realizar a tarefa
3. Uma recomendação clara de como proceder
4. O raciocínio por trás da recomendação
5. Estimativa de tokens que serão consumidos

Tarefa do usuário: "${prompt}"

Responda APENAS com um JSON válido no seguinte formato:
{
  "task_type": "tipo da tarefa",
  "optimal_tool": "claude-code" | "cursor" | "claude-chat",
  "recommendation": "recomendação clara e objetiva",
  "reasoning": "raciocínio detalhado",
  "estimated_tokens": número estimado
}

Critérios para escolha da ferramenta:
- "claude-code": Para tarefas complexas que envolvem múltiplos arquivos, refatorações grandes, ou precisam de contexto do projeto inteiro
- "cursor": Para edições rápidas, autocomplete, ou mudanças pontuais em poucos arquivos
- "claude-chat": Para perguntas, planejamento, discussão de arquitetura, ou quando o usuário só precisa de orientação`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Claude API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.content[0].text

    // Parse the JSON response from Claude
    let analysis: TaskAnalysis
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      analysis = JSON.parse(jsonMatch[0])
    } catch (e) {
      // Fallback if Claude doesn't return valid JSON
      analysis = {
        task_type: 'general',
        optimal_tool: 'claude-chat',
        recommendation:
          'Recomendo começar com uma conversa no chat para entender melhor os requisitos.',
        reasoning: content,
        estimated_tokens: 2000,
      }
    }

    // Save to database
    const { data: savedRecommendation, error: saveError } = await supabaseClient
      .from('task_recommendations')
      .insert({
        project_id: projectId,
        prompt,
        task_type: analysis.task_type,
        optimal_tool: analysis.optimal_tool,
        recommendation: analysis.recommendation,
        reasoning: analysis.reasoning,
        estimated_tokens: analysis.estimated_tokens,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving recommendation:', saveError)
      // Don't throw, just log - we still want to return the analysis
    }

    return new Response(JSON.stringify(analysis), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
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
