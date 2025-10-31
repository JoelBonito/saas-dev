import { Editor, OnMount } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { Loader2 } from 'lucide-react'

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
  const { theme } = useTheme()

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: 'on',
      rulers: [80, 120],
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      readOnly,
    })

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save file action - can be customized
      console.log('Save triggered')
    })
  }

  return (
    <div className={className}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onMount={handleEditorMount}
        loading={
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
        options={{
          readOnly,
          scrollBeyondLastLine: false,
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
        }}
      />
    </div>
  )
}
