import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Bot, User, Copy, Check } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/lib/anthropic/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import 'highlight.js/styles/github-dark.css'

interface ChatMessageProps {
  message: ChatMessageType
  isStreaming?: boolean
}

export function ChatMessage({
  message,
  isStreaming = false,
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  const { toast } = useToast()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast({
        title: 'Código copiado!',
        description: 'O código foi copiado para a área de transferência.',
      })
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o código.',
        variant: 'destructive',
      })
    }
  }

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
            'prose-p:leading-relaxed',
            'prose-pre:relative prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10',
            'prose-code:text-blue-400 prose-code:before:content-none prose-code:after:content-none',
            isStreaming && 'animate-pulse',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom code block renderer with copy button
                pre: ({ node, children, ...props }) => (
                  <div className="relative group/code">
                    <pre {...props}>{children}</pre>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover/code:opacity-100 transition-opacity"
                      onClick={() => {
                        const code = node?.children[0] as any
                        const text = code?.children[0]?.value || ''
                        handleCopyCode(text)
                      }}
                    >
                      {copiedCode === (node?.children[0] as any)?.children[0]?.value ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
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
