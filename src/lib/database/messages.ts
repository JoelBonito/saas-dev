import { supabase } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export type Message = Tables<'messages'>
export type MessageInsert = TablesInsert<'messages'>
export type MessageUpdate = TablesUpdate<'messages'>

/**
 * Create a new message
 */
export async function createMessage(data: MessageInsert): Promise<Message> {
  const { data: message, error } = await supabase
    .from('messages')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return message
}

/**
 * Get a message by ID
 */
export async function getMessage(id: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Get all messages for a conversation
 */
export async function getMessagesByConversation(
  conversationId: string,
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Update a message
 */
export async function updateMessage(
  id: string,
  data: MessageUpdate,
): Promise<Message> {
  const { data: message, error } = await supabase
    .from('messages')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return message
}

/**
 * Delete a message
 */
export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', id)

  if (error) throw error
}

/**
 * Bulk create messages
 */
export async function createMessages(
  messages: MessageInsert[],
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .insert(messages)
    .select()

  if (error) throw error
  return data || []
}
