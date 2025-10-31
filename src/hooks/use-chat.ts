import { useState, useCallback, useRef } from 'react'
import { sendChatMessage } from '@/lib/anthropic/chat'
import type { ChatMessage, TokenUsage } from '@/lib/anthropic/types'
import { useToast } from './use-toast'

export interface UseChatOptions {
  projectId?: string
  conversationId?: string
  systemPrompt?: string
  onMessageSaved?: (message: ChatMessage) => void
}

export interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  streamingContent: string
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  resetError: () => void
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { projectId, conversationId, systemPrompt, onMessageSaved } = options
  const { toast } = useToast()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      setError(null)
      setIsLoading(true)
      setStreamingContent('')

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        created_at: new Date().toISOString(),
      }

      // Add user message to state
      setMessages((prev) => [...prev, userMessage])

      // Save user message to database (optional callback)
      onMessageSaved?.(userMessage)

      // Prepare messages for API
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      try {
        // Create abort controller for this request
        abortControllerRef.current = new AbortController()

        // Send message with streaming
        const { text, usage } = await sendChatMessage(
          {
            messages: apiMessages,
            system: systemPrompt,
          },
          {
            onStart: () => {
              setStreamingContent('')
            },
            onToken: (token) => {
              setStreamingContent((prev) => prev + token)
            },
            onComplete: (fullText, tokenUsage) => {
              // Create assistant message
              const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: fullText,
                created_at: new Date().toISOString(),
                tokens_used: tokenUsage.total_tokens,
                model_used: 'claude-3-5-sonnet-20241022',
                metadata: {
                  usage: tokenUsage,
                  projectId,
                  conversationId,
                },
              }

              // Add assistant message to state
              setMessages((prev) => [...prev, assistantMessage])

              // Save assistant message to database (optional callback)
              onMessageSaved?.(assistantMessage)

              // Clear streaming content
              setStreamingContent('')
              setIsLoading(false)
            },
            onError: (err) => {
              const errorMessage = err.message || 'Failed to send message'
              setError(errorMessage)
              setIsLoading(false)
              setStreamingContent('')

              toast({
                title: 'Erro ao enviar mensagem',
                description: errorMessage,
                variant: 'destructive',
              })
            },
          },
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send message'
        setError(errorMessage)
        setIsLoading(false)
        setStreamingContent('')

        toast({
          title: 'Erro ao enviar mensagem',
          description: errorMessage,
          variant: 'destructive',
        })
      }
    },
    [messages, projectId, conversationId, systemPrompt, onMessageSaved, toast],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingContent('')
    setError(null)
  }, [])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    streamingContent,
    error,
    sendMessage,
    clearMessages,
    resetError,
  }
}
