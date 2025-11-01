import type { FileNode } from '@/components/code/FileTree'

export interface ParsedCodeBlock {
  language: string
  code: string
  fileName?: string
  filePath?: string
  startLine: number
  endLine: number
}

export interface GeneratedFileInfo {
  fileName: string
  filePath: string
  language: string
  content: string
}

/**
 * Extract code blocks from markdown-style content
 * Supports formats like:
 * ```typescript
 * // code here
 * ```
 *
 * ```typescript:path/to/file.ts
 * // code here
 * ```
 */
export function extractCodeBlocks(content: string): ParsedCodeBlock[] {
  const codeBlockRegex = /```(\w+)(?::([^\n]+))?\n([\s\S]*?)```/g
  const blocks: ParsedCodeBlock[] = []
  let match

  const lines = content.split('\n')
  let currentLine = 0

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [fullMatch, language, filePath, code] = match

    // Find the line number where this block starts
    const beforeBlock = content.substring(0, match.index)
    const startLine = beforeBlock.split('\n').length

    // Extract file name from path if provided
    let fileName: string | undefined
    let cleanFilePath: string | undefined

    if (filePath) {
      cleanFilePath = filePath.trim()
      fileName = cleanFilePath.split('/').pop()
    }

    blocks.push({
      language: language.toLowerCase(),
      code: code.trim(),
      fileName,
      filePath: cleanFilePath,
      startLine,
      endLine: startLine + code.split('\n').length,
    })
  }

  return blocks
}

/**
 * Convert parsed code blocks to GeneratedFileInfo
 */
export function codeBlocksToFiles(blocks: ParsedCodeBlock[]): GeneratedFileInfo[] {
  const files: GeneratedFileInfo[] = []
  const fileCounter = new Map<string, number>()

  for (const block of blocks) {
    let fileName = block.fileName
    let filePath = block.filePath

    // If no file path is provided, generate one based on language
    if (!fileName || !filePath) {
      const ext = getExtensionForLanguage(block.language)
      const baseName = `generated-${block.language}`

      // Count how many files we've generated for this language
      const count = fileCounter.get(baseName) || 0
      fileCounter.set(baseName, count + 1)

      fileName = count > 0 ? `${baseName}-${count}.${ext}` : `${baseName}.${ext}`
      filePath = fileName
    }

    files.push({
      fileName,
      filePath,
      language: block.language,
      content: block.code,
    })
  }

  return files
}

/**
 * Get file extension based on language
 */
export function getExtensionForLanguage(language: string): string {
  const extensionMap: Record<string, string> = {
    typescript: 'ts',
    tsx: 'tsx',
    javascript: 'js',
    jsx: 'jsx',
    python: 'py',
    java: 'java',
    go: 'go',
    rust: 'rs',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    ruby: 'rb',
    php: 'php',
    swift: 'swift',
    kotlin: 'kt',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    yaml: 'yaml',
    yml: 'yml',
    xml: 'xml',
    markdown: 'md',
    sql: 'sql',
    bash: 'sh',
    shell: 'sh',
    powershell: 'ps1',
    dockerfile: 'Dockerfile',
    docker: 'Dockerfile',
  }

  return extensionMap[language.toLowerCase()] || 'txt'
}

/**
 * Get Monaco language identifier from file extension
 */
export function getLanguageFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase()

  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    java: 'java',
    go: 'go',
    rs: 'rust',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    rb: 'ruby',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    html: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    less: 'less',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    md: 'markdown',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
    ps1: 'powershell',
  }

  return languageMap[ext || ''] || 'plaintext'
}

/**
 * Build a file tree structure from flat file list
 */
export function buildFileTree(files: GeneratedFileInfo[]): FileNode[] {
  const root: FileNode[] = []
  const folderMap = new Map<string, FileNode>()

  for (const file of files) {
    const parts = file.filePath.split('/')
    let currentLevel = root

    // Build folder structure
    for (let i = 0; i < parts.length - 1; i++) {
      const folderPath = parts.slice(0, i + 1).join('/')
      const folderName = parts[i]

      let folder = folderMap.get(folderPath)

      if (!folder) {
        folder = {
          name: folderName,
          path: folderPath,
          type: 'folder',
          children: [],
        }
        folderMap.set(folderPath, folder)
        currentLevel.push(folder)
      }

      currentLevel = folder.children!
    }

    // Add file
    const fileNode: FileNode = {
      name: file.fileName,
      path: file.filePath,
      type: 'file',
      content: file.content,
    }

    currentLevel.push(fileNode)
  }

  // Sort folders first, then files
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'file') return -1
      if (a.type === 'file' && b.type === 'folder') return 1
      return a.name.localeCompare(b.name)
    })
  }

  // Recursively sort all levels
  const sortTree = (nodes: FileNode[]): void => {
    sortNodes(nodes)
    nodes.forEach((node) => {
      if (node.children) {
        sortTree(node.children)
      }
    })
  }

  sortTree(root)
  return root
}

/**
 * Extract and parse code from AI response
 */
export function parseAIResponse(content: string): {
  codeBlocks: ParsedCodeBlock[]
  files: GeneratedFileInfo[]
  fileTree: FileNode[]
} {
  const codeBlocks = extractCodeBlocks(content)
  const files = codeBlocksToFiles(codeBlocks)
  const fileTree = buildFileTree(files)

  return {
    codeBlocks,
    files,
    fileTree,
  }
}
