import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string

if (!ANTHROPIC_API_KEY) {
  throw new Error(
    'VITE_ANTHROPIC_API_KEY is not set. Please add it to your .env.local file.',
  )
}

// Create a singleton instance of the Anthropic client
export const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
})

// Default model configuration
export const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022'
export const MAX_TOKENS = 4096
