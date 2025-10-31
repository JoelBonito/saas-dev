import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  ChevronDown,
  File,
  FileCode,
  FileJson,
  Folder,
  FolderOpen,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
  content?: string
}

interface FileTreeProps {
  files: FileNode[]
  selectedFile?: string
  onFileSelect?: (file: FileNode) => void
  className?: string
}

interface FileTreeNodeProps {
  node: FileNode
  level: number
  selectedFile?: string
  onFileSelect?: (file: FileNode) => void
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className="h-4 w-4 text-blue-500" />
    case 'json':
      return <FileJson className="h-4 w-4 text-yellow-500" />
    default:
      return <File className="h-4 w-4 text-muted-foreground" />
  }
}

function FileTreeNode({
  node,
  level,
  selectedFile,
  onFileSelect,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const isSelected = selectedFile === node.path
  const hasChildren = node.type === 'folder' && node.children && node.children.length > 0

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsExpanded(!isExpanded)
    } else {
      onFileSelect?.(node)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent',
          isSelected && 'bg-accent',
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-400" />
            ) : (
              <Folder className="h-4 w-4 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="flex-1 truncate text-left">{node.name}</span>
      </button>

      {node.type === 'folder' && isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({
  files,
  selectedFile,
  onFileSelect,
  className,
}: FileTreeProps) {
  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="p-2">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Folder className="mb-2 h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum arquivo gerado ainda
            </p>
          </div>
        ) : (
          files.map((node) => (
            <FileTreeNode
              key={node.path}
              node={node}
              level={0}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))
        )}
      </div>
    </ScrollArea>
  )
}
