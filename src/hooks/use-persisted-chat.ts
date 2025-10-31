import { useState, useCallback, useEffect } from 'react'
import { sendChatMessage } from '@/lib/anthropic/chat'
import type { ChatMessage, TokenUsage } from '@/lib/anthropic/types'
import {
  createMessage,
  getMessagesByConversation,
  getOrCreateConversation,
} from '@/lib/database'
import { trackApiUsage } from '@/lib/database/api-usage'
import { supabase } from '@/lib/supabase/client'
import { useToast } from './use-toast'

export interface UsePersistedChatOptions {
  projectId: string
  systemPrompt?: string
  autoLoad?: boolean
}

export interface UsePersistedChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  streamingContent: string
  error: string | null
  conversationId: string | null
  sendMessage: (content: string) => Promise<void>
  loadMessages: () => Promise<void>
  clearMessages: () => void
  resetError: () => void
}

export function usePersistedChat(
  options: UsePersistedChatOptions,
): UsePersistedChatReturn {
  const { projectId, systemPrompt, autoLoad = true } = options
  const { toast } = useToast()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Load existing messages on mount
  useEffect(() => {
    if (autoLoad && projectId) {
      loadMessages()
    }
  }, [projectId, autoLoad])

  const loadMessages = useCallback(async () => {
    try {
      // Get or create conversation
      const conversation = await getOrCreateConversation(projectId)
      setConversationId(conversation.id)

      // Load messages
      const dbMessages = await getMessagesByConversation(conversation.id)

      // Convert database messages to ChatMessage format
      const chatMessages: ChatMessage[] = dbMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        created_at: msg.created_at,
        tokens_used: msg.tokens_used || undefined,
        model_used: msg.model_used || undefined,
        metadata: msg.metadata as Record<string, unknown> | undefined,
      }))

      setMessages(chatMessages)
    } catch (err) {
      console.error('Error loading messages:', err)
      toast({
        title: 'Erro ao carregar mensagens',
        description:
          err instanceof Error ? err.message : 'Erro desconhecido',
        variant: 'destructive',
      })
    }
  }, [projectId, toast])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      setError(null)
      setIsLoading(true)
      setStreamingContent('')

      try {
        // Ensure we have a conversation
        let currentConversationId = conversationId
        if (!currentConversationId) {
          const conversation = await getOrCreateConversation(projectId)
          currentConversationId = conversation.id
          setConversationId(currentConversationId)
        }

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        // Create user message
        const userMessageId = crypto.randomUUID()
        const userMessage: ChatMessage = {
          id: userMessageId,
          role: 'user',
          content: content.trim(),
          created_at: new Date().toISOString(),
        }

        // Add user message to state
        setMessages((prev) => [...prev, userMessage])

        // Save user message to database
        await createMessage({
          id: userMessageId,
          conversation_id: currentConversationId,
          role: 'user',
          content: content.trim(),
        })

        // Prepare messages for API
        const apiMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

        // Send message with streaming
        const { text, usage } = await sendChatMessage(
          {
            messages: apiMessages,
            system: systemPrompt,
            projectId,
            conversationId: currentConversationId,
          },
          {
            onStart: () => {
              setStreamingContent('')
            },
            onToken: (token) => {
              setStreamingContent((prev) => prev + token)
            },
            onComplete: async (fullText, tokenUsage) => {
              try {
                // Create assistant message
                const assistantMessageId = crypto.randomUUID()
                const assistantMessage: ChatMessage = {
                  id: assistantMessageId,
                  role: 'assistant',
                  content: fullText,
                  created_at: new Date().toISOString(),
                  tokens_used: tokenUsage.total_tokens,
                  model_used: 'claude-3-5-sonnet-20241022',
                  metadata: {
                    usage: tokenUsage,
                  },
                }

                // Add assistant message to state
                setMessages((prev) => [...prev, assistantMessage])

                // Save assistant message to database
                await createMessage({
                  id: assistantMessageId,
                  conversation_id: currentConversationId!,
                  role: 'assistant',
                  content: fullText,
                  tokens_used: tokenUsage.total_tokens,
                  model_used: 'claude-3-5-sonnet-20241022',
                  metadata: tokenUsage,
                })

                // Track API usage
                await trackApiUsage({
                  user_id: user.id,
                  project_id: projectId,
                  message_id: assistantMessageId,
                  model_used: 'claude-3-5-sonnet-20241022',
                  tokens_input: tokenUsage.input_tokens,
                  tokens_output: tokenUsage.output_tokens,
                  tokens_total: tokenUsage.total_tokens,
                  cost_usd: tokenUsage.cost_usd || 0,
                })

                // Clear streaming content
                setStreamingContent('')
                setIsLoading(false)
              } catch (saveError) {
                console.error('Error saving message:', saveError)
                // Don't throw - message was sent successfully, just not saved
                setIsLoading(false)
              }
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
    [messages, projectId, conversationId, systemPrompt, toast],
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
    loadMessages,
    clearMessages,
    resetError,
  }
}
