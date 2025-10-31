import { supabase } from '@/lib/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/lib/supabase/types'

export type Conversation = Tables<'conversations'>
export type ConversationInsert = TablesInsert<'conversations'>
export type ConversationUpdate = TablesUpdate<'conversations'>

/**
 * Create a new conversation
 */
export async function createConversation(
  data: ConversationInsert,
): Promise<Conversation> {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return conversation
}

/**
 * Get a conversation by ID
 */
export async function getConversation(
  id: string,
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

/**
 * Get all conversations for a project
 */
export async function getConversationsByProject(
  projectId: string,
): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Update a conversation
 */
export async function updateConversation(
  id: string,
  data: ConversationUpdate,
): Promise<Conversation> {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return conversation
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<void> {
  const { error } = await supabase.from('conversations').delete().eq('id', id)

  if (error) throw error
}

/**
 * Get or create a conversation for a project
 */
export async function getOrCreateConversation(
  projectId: string,
  title: string = 'Nova Conversa',
): Promise<Conversation> {
  // Try to get the most recent conversation for this project
  const conversations = await getConversationsByProject(projectId)

  if (conversations.length > 0) {
    return conversations[0]
  }

  // Create a new conversation if none exists
  return createConversation({
    project_id: projectId,
    title,
  })
}
