export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  tokens_used?: number
  model_used?: string
  metadata?: Record<string, unknown>
}

export interface StreamingOptions {
  onStart?: () => void
  onToken?: (token: string) => void
  onComplete?: (fullText: string, usage: TokenUsage) => void
  onError?: (error: Error) => void
}

export interface TokenUsage {
  input_tokens: number
  output_tokens: number
  total_tokens: number
  cost_usd?: number
}

export interface ChatCompletionRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  model?: string
  max_tokens?: number
  temperature?: number
  system?: string
  projectId?: string
  conversationId?: string
}

export interface GeneratedFile {
  file_name: string
  file_path: string
  file_type: string
  content: string
}

export interface CodeGenerationResult {
  success: boolean
  files: GeneratedFile[]
  error_message?: string
  generation_time_ms: number
  tokens_consumed: number
}
