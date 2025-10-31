import { anthropic, DEFAULT_MODEL, MAX_TOKENS } from './client'
import type {
  ChatCompletionRequest,
  StreamingOptions,
  TokenUsage,
} from './types'

/**
 * Calculate the estimated cost based on token usage
 * Pricing for Claude 3.5 Sonnet (as of 2024):
 * Input: $3 per million tokens
 * Output: $15 per million tokens
 */
export function calculateCost(usage: TokenUsage): number {
  const inputCost = (usage.input_tokens / 1_000_000) * 3.0
  const outputCost = (usage.output_tokens / 1_000_000) * 15.0
  return inputCost + outputCost
}

/**
 * Send a chat completion request with streaming support
 */
export async function sendChatMessage(
  request: ChatCompletionRequest,
  options?: StreamingOptions,
): Promise<{ text: string; usage: TokenUsage }> {
  const { messages, model = DEFAULT_MODEL, max_tokens = MAX_TOKENS, system } = request

  try {
    options?.onStart?.()

    const stream = await anthropic.messages.stream({
      model,
      max_tokens,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      ...(system && { system }),
    })

    let fullText = ''

    // Handle streaming tokens
    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        const token = chunk.delta.text
        fullText += token
        options?.onToken?.(token)
      }
    }

    // Get the final message with usage stats
    const finalMessage = await stream.finalMessage()

    const usage: TokenUsage = {
      input_tokens: finalMessage.usage.input_tokens,
      output_tokens: finalMessage.usage.output_tokens,
      total_tokens:
        finalMessage.usage.input_tokens + finalMessage.usage.output_tokens,
      cost_usd: calculateCost({
        input_tokens: finalMessage.usage.input_tokens,
        output_tokens: finalMessage.usage.output_tokens,
        total_tokens:
          finalMessage.usage.input_tokens + finalMessage.usage.output_tokens,
      }),
    }

    options?.onComplete?.(fullText, usage)

    return { text: fullText, usage }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error : new Error('Unknown error occurred')
    options?.onError?.(errorMessage)
    throw errorMessage
  }
}

/**
 * Send a non-streaming chat completion request
 */
export async function sendChatMessageSync(
  request: ChatCompletionRequest,
): Promise<{ text: string; usage: TokenUsage }> {
  const { messages, model = DEFAULT_MODEL, max_tokens = MAX_TOKENS, system } = request

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      ...(system && { system }),
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text : ''

    const usage: TokenUsage = {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      total_tokens: response.usage.input_tokens + response.usage.output_tokens,
      cost_usd: calculateCost({
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        total_tokens: response.usage.input_tokens + response.usage.output_tokens,
      }),
    }

    return { text, usage }
  } catch (error) {
    throw error instanceof Error ? error : new Error('Unknown error occurred')
  }
}
