import { useState, useCallback, useRef, useEffect } from 'react'
import { sendChatMessage } from '@/lib/anthropic/chat'
import type { ChatMessage, TokenUsage } from '@/lib/anthropic/types'
import { getMessages } from '@/lib/supabase/database'
import { useToast } from './use-toast'

export interface UseChatOptions {
  projectId?: string
  conversationId?: string
  systemPrompt?: string
  onMessageSaved?: (message: ChatMessage) => void
  loadFromDatabase?: boolean
}

export interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  streamingContent: string
  error: string | null
  conversationId: string | undefined
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  resetError: () => void
  setConversationId: (id: string | undefined) => void
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { projectId, systemPrompt, onMessageSaved, loadFromDatabase = true } = options
  const { toast } = useToast()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | undefined>(options.conversationId)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Load messages from database when conversationId changes
  useEffect(() => {
    if (conversationId && loadFromDatabase) {
      const loadMessages = async () => {
        try {
          setIsLoading(true)
          const dbMessages = await getMessages(conversationId)
          setMessages(dbMessages as ChatMessage[])
        } catch (err) {
          console.error('Error loading messages:', err)
          toast({
            title: 'Erro ao carregar mensagens',
            description: 'Não foi possível carregar as mensagens anteriores.',
            variant: 'destructive',
          })
        } finally {
          setIsLoading(false)
        }
      }
      loadMessages()
    }
  }, [conversationId, loadFromDatabase, toast])

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
            projectId,
            conversationId,
          },
          {
            onStart: () => {
              setStreamingContent('')
            },
            onToken: (token) => {
              setStreamingContent((prev) => prev + token)
            },
            onComplete: (fullText, tokenUsage, newConversationId) => {
              // Update conversationId if returned from backend
              if (newConversationId && !conversationId) {
                setConversationId(newConversationId)
              }

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
                  conversationId: newConversationId || conversationId,
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
    conversationId,
    sendMessage,
    clearMessages,
    resetError,
    setConversationId,
  }
}
