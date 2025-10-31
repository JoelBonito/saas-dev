import { Textarea } from '@/components/ui/textarea'
import { useThemeDetector } from '@/hooks/use-theme-detector'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  language?: string
  onChange?: (value: string | undefined) => void
  readOnly?: boolean
  height?: string
  className?: string
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = '100%',
  className,
}: CodeEditorProps) {
  const theme = useThemeDetector()

  return (
    <div
      className={cn('h-full w-full font-mono text-sm', className)}
      style={{ height }}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        className={cn(
          'h-full w-full resize-none rounded-none border-0 bg-transparent p-4 leading-relaxed focus-visible:ring-0',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-800',
        )}
        style={{
          backgroundColor: theme === 'dark' ? 'hsl(240 10% 3.9%)' : '#ffffff',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        placeholder={
          readOnly ? 'Nenhum conteúdo para exibir' : 'Digite seu código aqui...'
        }
      />
    </div>
  )
}
