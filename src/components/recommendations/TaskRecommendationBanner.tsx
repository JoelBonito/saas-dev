import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { GlassCard } from '@/components/common/GlassCard'
import { GlassButton } from '@/components/common/GlassButton'

export const TaskRecommendationBanner = () => {
  const recommendationType = 'external' // 'optimal' or 'external'

  if (recommendationType === 'optimal') {
    return (
      <GlassCard className="border-green-500/50 bg-green-500/10 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-400" />
          <div>
            <h3 className="font-bold text-green-100">
              ✓ Tarefa otimizada para Claude
            </h3>
            <p className="text-sm text-green-200/80">
              Esta tarefa é ideal para o Claude. Tokens estimados: ~1.2k
            </p>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="border-blue-500/50 bg-blue-500/10 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <AlertCircle className="h-8 w-8 flex-shrink-0 text-blue-400" />
        <div className="flex-1">
          <h3 className="font-bold text-white">
            🔷 Recomendação: Use Gemini 1.5 Pro
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            Para analisar este repositório grande, o Gemini 1.5 Pro com seu
            contexto de 1M de tokens é a melhor opção.
          </p>
          <GlassCard className="mt-3 bg-white/5 p-3">
            <ol className="list-inside list-decimal space-y-1 text-sm text-gray-300">
              <li>Clique em 'Copiar Contexto' abaixo.</li>
              <li>
                Abra o Gemini{' '}
                <a
                  href="#"
                  className="inline-flex items-center text-blue-400 underline"
                >
                  aqui <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>Cole o contexto e execute a tarefa.</li>
              <li>Cole o resultado de volta aqui.</li>
            </ol>
          </GlassCard>
        </div>
        <div className="flex flex-shrink-0 flex-col gap-2 md:items-end">
          <GlassButton>Copiar Contexto</GlassButton>
          <GlassButton variant="secondary">Abrir Gemini</GlassButton>
          <GlassButton variant="ghost" size="sm" className="text-xs">
            Usar Claude mesmo assim
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  )
}
