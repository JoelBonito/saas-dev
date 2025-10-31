import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Lightbulb, X } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { analyzeTask } from '@/lib/anthropic/chat'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface TaskRecommendation {
  task_type: string
  optimal_tool: 'claude-code' | 'cursor' | 'claude-chat'
  recommendation: string
  reasoning: string
  estimated_tokens: number
}

interface TaskRecommendationBannerProps {
  projectId: string
  prompt?: string
  onDismiss?: () => void
  className?: string
}

export function TaskRecommendationBanner({
  projectId,
  prompt,
  onDismiss,
  className,
}: TaskRecommendationBannerProps) {
  const [recommendation, setRecommendation] =
    useState<TaskRecommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (prompt && prompt.length > 20) {
      analyzeUserPrompt(prompt)
    }
  }, [prompt])

  const analyzeUserPrompt = async (userPrompt: string) => {
    setIsLoading(true)
    try {
      const analysis = await analyzeTask(userPrompt, projectId)
      setRecommendation(analysis)
      setIsVisible(true)
    } catch (error) {
      console.error('Error analyzing task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const handleUserChoice = async (choice: string) => {
    if (!recommendation) return

    // Save user's choice to database
    try {
      const { error } = await supabase
        .from('task_recommendations')
        .update({ user_choice: choice })
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) console.error('Error saving user choice:', error)
    } catch (error) {
      console.error('Error saving user choice:', error)
    }

    handleDismiss()
  }

  if (!isVisible || !recommendation) {
    return null
  }

  const isOptimal = recommendation.optimal_tool === 'claude-chat'

  return (
    <GlassCard
      className={cn(
        'relative p-4',
        isOptimal
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-blue-500/50 bg-blue-500/10',
        className,
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-full p-1 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        {isOptimal ? (
          <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400" />
        ) : (
          <Lightbulb className="h-6 w-6 flex-shrink-0 text-blue-400" />
        )}

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'font-bold',
                isOptimal ? 'text-green-100' : 'text-blue-100',
              )}
            >
              {isOptimal ? '✓ Tarefa Otimizada' : '💡 Recomendação'}
            </h3>
            <Badge variant="outline" className="text-xs">
              {recommendation.task_type}
            </Badge>
            {recommendation.estimated_tokens > 0 && (
              <Badge variant="outline" className="text-xs">
                ~{(recommendation.estimated_tokens / 1000).toFixed(1)}k tokens
              </Badge>
            )}
          </div>

          <p
            className={cn(
              'text-sm',
              isOptimal ? 'text-green-200/90' : 'text-blue-200/90',
            )}
          >
            {recommendation.recommendation}
          </p>

          {!isOptimal && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer font-medium hover:text-foreground">
                Ver raciocínio
              </summary>
              <p className="mt-2 text-xs">{recommendation.reasoning}</p>
            </details>
          )}

          <div className="flex gap-2">
            {isOptimal ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleUserChoice('accepted')}
                className="bg-green-500/20 hover:bg-green-500/30"
              >
                Continuar com Claude
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUserChoice('accepted')}
                  className="bg-blue-500/20 hover:bg-blue-500/30"
                >
                  Seguir Recomendação
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUserChoice('rejected')}
                >
                  Usar Claude Mesmo Assim
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

// Static version for demo purposes
export function TaskRecommendationBannerStatic() {
  return (
    <GlassCard className="border-green-500/50 bg-green-500/10 p-4">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-6 w-6 text-green-400" />
        <div>
          <h3 className="font-bold text-green-100">
            ✓ Sistema de Recomendações Ativo
          </h3>
          <p className="text-sm text-green-200/80">
            O assistente analisará suas tarefas e sugerirá a melhor ferramenta
            para cada caso.
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
