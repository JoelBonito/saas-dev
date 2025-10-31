import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, User } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/lib/anthropic/types'

interface ChatMessageProps {
  message: ChatMessageType
  isStreaming?: boolean
}

export function ChatMessage({
  message,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'group flex gap-3 px-4 py-6 transition-colors hover:bg-accent/5',
        isUser ? 'bg-transparent' : 'bg-accent/10',
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
              : 'bg-gradient-to-br from-green-500 to-emerald-600',
          )}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isUser ? 'Você' : 'Claude'}
          </span>
          {message.tokens_used && (
            <span className="text-xs text-muted-foreground">
              {message.tokens_used.toLocaleString()} tokens
            </span>
          )}
        </div>

        <div
          className={cn(
            'prose prose-sm dark:prose-invert max-w-none',
            'prose-p:leading-relaxed prose-pre:bg-accent/50',
            isStreaming && 'animate-pulse',
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {message.created_at && (
          <span className="text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}
