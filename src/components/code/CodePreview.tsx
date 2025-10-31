import { useState, useMemo } from 'react'
import { FileTree, FileNode } from './FileTree'
import { CodeEditor } from './CodeEditor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Download, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface CodePreviewProps {
  files: FileNode[]
  className?: string
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    md: 'markdown',
    py: 'python',
    go: 'go',
    rs: 'rust',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    sh: 'shell',
    yaml: 'yaml',
    yml: 'yaml',
    sql: 'sql',
  }

  return languageMap[ext || ''] || 'plaintext'
}

export function CodePreview({ files, className }: CodePreviewProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Flatten files to get all file nodes (not folders)
  const flatFiles = useMemo(() => {
    const result: FileNode[] = []

    function traverse(nodes: FileNode[]) {
      for (const node of nodes) {
        if (node.type === 'file') {
          result.push(node)
        }
        if (node.children) {
          traverse(node.children)
        }
      }
    }

    traverse(files)
    return result
  }, [files])

  // Auto-select first file if none selected
  useMemo(() => {
    if (!selectedFile && flatFiles.length > 0) {
      setSelectedFile(flatFiles[0])
    }
  }, [flatFiles, selectedFile])

  const handleCopyCode = async () => {
    if (!selectedFile?.content) return

    try {
      await navigator.clipboard.writeText(selectedFile.content)
      setCopied(true)
      toast({
        title: 'Código copiado!',
        description: 'O código foi copiado para a área de transferência.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o código.',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadFile = () => {
    if (!selectedFile?.content) return

    const blob = new Blob([selectedFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Download iniciado',
      description: `Baixando ${selectedFile.name}`,
    })
  }

  if (files.length === 0) {
    return (
      <div
        className={cn(
          'flex h-full flex-col items-center justify-center p-8 text-center',
          className,
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileTree className="h-8 w-8 text-muted-foreground" files={[]} />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Nenhum código gerado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Os arquivos de código aparecerão aqui quando forem gerados pelo chat.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header with file tabs and actions */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <Tabs
          value={selectedFile?.path || ''}
          onValueChange={(path) => {
            const file = flatFiles.find((f) => f.path === path)
            if (file) setSelectedFile(file)
          }}
          className="flex-1"
        >
          <TabsList className="h-9">
            {flatFiles.slice(0, 5).map((file) => (
              <TabsTrigger
                key={file.path}
                value={file.path}
                className="text-xs"
              >
                {file.name}
              </TabsTrigger>
            ))}
            {flatFiles.length > 5 && (
              <TabsTrigger value="_more" disabled className="text-xs">
                +{flatFiles.length - 5}
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            disabled={!selectedFile}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadFile}
            disabled={!selectedFile}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content with file tree and editor */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
          <FileTree
            files={files}
            selectedFile={selectedFile?.path}
            onFileSelect={setSelectedFile}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          {selectedFile ? (
            <CodeEditor
              value={selectedFile.content || ''}
              language={getLanguageFromFilename(selectedFile.name)}
              readOnly
              height="100%"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Selecione um arquivo para visualizar
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
