import { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus, MessageSquare, Trash2 } from 'lucide-react'
import { getConversations, deleteConversation, type Conversation } from '@/lib/supabase/database'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConversationListProps {
  projectId: string
  selectedConversationId?: string
  onSelectConversation: (conversationId: string | undefined) => void
  className?: string
}

export function ConversationList({
  projectId,
  selectedConversationId,
  onSelectConversation,
  className,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [projectId])

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const data = await getConversations(projectId)
      setConversations(data)
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast({
        title: 'Erro ao carregar conversas',
        description: 'Nao foi possivel carregar as conversas.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConversation = () => {
    onSelectConversation(undefined)
  }

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId)

      // Remove from local state
      setConversations((prev) => prev.filter((c) => c.id !== conversationId))

      // If deleted conversation was selected, clear selection
      if (selectedConversationId === conversationId) {
        onSelectConversation(undefined)
      }

      toast({
        title: 'Conversa excluida',
        description: 'A conversa foi excluida com sucesso.',
      })
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast({
        title: 'Erro ao excluir',
        description: 'Nao foi possivel excluir a conversa.',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
      setConversationToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Ontem'
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <>
      <div className={cn('flex flex-col h-full', className)}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <Button
            onClick={handleNewConversation}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Nova Conversa
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-white/50">
                <MessageSquare className="w-12 h-12 mb-2" />
                <p className="text-sm">Nenhuma conversa ainda</p>
                <p className="text-xs mt-1">Inicie uma nova conversa acima</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    'group relative flex items-center gap-2 p-3 rounded-lg transition-all cursor-pointer hover:bg-white/5',
                    selectedConversationId === conversation.id && 'bg-white/10'
                  )}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 text-white/70" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {formatDate(conversation.updated_at)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      setConversationToDelete(conversation.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acao nao pode ser desfeita. Todas as mensagens desta conversa serao
              permanentemente excluidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => conversationToDelete && handleDeleteConversation(conversationToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
