import Editor from '@monaco-editor/react'
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
  language = 'typescript',
  onChange,
  readOnly = false,
  height = '100%',
  className,
}: CodeEditorProps) {
  const theme = useThemeDetector()

  return (
    <div
      className={cn('h-full w-full', className)}
      style={{ height }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          fontLigatures: true,
          renderWhitespace: 'selection',
          bracketPairColorization: {
            enabled: true,
          },
        }}
      />
    </div>
  )
}
