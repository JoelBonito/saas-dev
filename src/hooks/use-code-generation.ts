import { useState, useCallback } from 'react'
import { parseAIResponse } from '@/lib/utils/code-parser'
import { saveFile, saveCodeGeneration } from '@/lib/supabase/database'
import type { FileNode } from '@/components/code/FileTree'
import { useToast } from './use-toast'

interface UseCodeGenerationOptions {
  projectId: string
  autoSave?: boolean
}

export interface CodeGenerationState {
  fileTree: FileNode[]
  isProcessing: boolean
  error: string | null
}

export function useCodeGeneration({
  projectId,
  autoSave = true,
}: UseCodeGenerationOptions) {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  /**
   * Process AI response and extract code
   */
  const processResponse = useCallback(
    async (content: string, messageId?: string) => {
      setIsProcessing(true)
      setError(null)

      try {
        const startTime = Date.now()

        // Parse the response
        const { codeBlocks, files, fileTree: parsedTree } = parseAIResponse(content)

        // Update file tree state
        setFileTree(parsedTree)

        // If auto-save is enabled and we have files, save them
        if (autoSave && files.length > 0 && messageId) {
          const savePromises = files.map((file) =>
            saveFile(
              projectId,
              file.filePath,
              file.fileName,
              file.language,
              file.content,
              messageId
            )
          )

          await Promise.all(savePromises)

          // Save code generation record
          const generationTimeMs = Date.now() - startTime
          await saveCodeGeneration(
            projectId,
            messageId,
            content.substring(0, 500), // Save first 500 chars as prompt
            { files: files.map((f) => ({ name: f.fileName, path: f.filePath })) },
            true,
            0, // tokens will be tracked separately
            undefined,
            generationTimeMs
          )

          toast({
            title: 'Código gerado!',
            description: `${files.length} arquivo(s) foram gerados com sucesso.`,
          })
        }

        return {
          codeBlocks,
          files,
          fileTree: parsedTree,
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao processar código'
        setError(errorMessage)

        toast({
          title: 'Erro ao processar código',
          description: errorMessage,
          variant: 'destructive',
        })

        throw err
      } finally {
        setIsProcessing(false)
      }
    },
    [projectId, autoSave, toast]
  )

  /**
   * Clear all generated files
   */
  const clearFiles = useCallback(() => {
    setFileTree([])
    setError(null)
  }, [])

  /**
   * Add files to the tree manually
   */
  const addFiles = useCallback((files: FileNode[]) => {
    setFileTree((prev) => [...prev, ...files])
  }, [])

  return {
    fileTree,
    isProcessing,
    error,
    processResponse,
    clearFiles,
    addFiles,
  }
}
