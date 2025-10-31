import { useEffect, useRef } from 'react'
import { usePersistedChat } from '@/hooks/use-persisted-chat'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatContainerProps {
  projectId: string
  systemPrompt?: string
  className?: string
}

export function ChatContainer({
  projectId,
  systemPrompt = 'Você é um assistente especializado em desenvolvimento de software. Ajude o usuário a criar e modificar código, sempre explicando suas decisões de forma clara e concisa.',
  className,
}: ChatContainerProps) {
  const {
    messages,
    isLoading,
    streamingContent,
    error,
    sendMessage,
    resetError,
  } = usePersistedChat({
    projectId,
    systemPrompt,
    autoLoad: true,
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={resetError}
              className="text-xs underline underline-offset-2"
            >
              Fechar
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        {messages.length === 0 && !isLoading && (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                Bem-vindo ao INOVE.AI Dev
              </h3>
              <p className="text-sm text-muted-foreground">
                Comece uma conversa para gerar código, fazer perguntas ou
                receber ajuda com seu projeto.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Streaming Message */}
        {isLoading && streamingContent && (
          <ChatMessage
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingContent,
              created_at: new Date().toISOString(),
            }}
            isStreaming
          />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder={
          isLoading
            ? 'Aguarde a resposta...'
            : 'Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)'
        }
      />
    </div>
  )
}
