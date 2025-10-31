import { supabase } from '@/lib/supabase/client'
import type { Tables, TablesInsert } from '@/lib/supabase/types'

export type ApiUsage = Tables<'api_usage'>
export type ApiUsageInsert = TablesInsert<'api_usage'>

/**
 * Track API usage
 */
export async function trackApiUsage(data: ApiUsageInsert): Promise<ApiUsage> {
  const { data: usage, error } = await supabase
    .from('api_usage')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return usage
}

/**
 * Get API usage by user
 */
export async function getApiUsageByUser(
  userId: string,
  limit: number = 100,
): Promise<ApiUsage[]> {
  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get API usage by project
 */
export async function getApiUsageByProject(
  projectId: string,
  limit: number = 100,
): Promise<ApiUsage[]> {
  const { data, error } = await supabase
    .from('api_usage')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

/**
 * Get total API usage statistics for a user
 */
export async function getUserApiUsageStats(userId: string): Promise<{
  total_tokens: number
  total_cost_usd: number
  total_requests: number
}> {
  const { data, error } = await supabase
    .from('api_usage')
    .select('tokens_total, cost_usd')
    .eq('user_id', userId)

  if (error) throw error

  if (!data || data.length === 0) {
    return {
      total_tokens: 0,
      total_cost_usd: 0,
      total_requests: 0,
    }
  }

  const total_tokens = data.reduce((sum, item) => sum + item.tokens_total, 0)
  const total_cost_usd = data.reduce(
    (sum, item) => sum + (item.cost_usd || 0),
    0,
  )

  return {
    total_tokens,
    total_cost_usd,
    total_requests: data.length,
  }
}

/**
 * Get total API usage statistics for a project
 */
export async function getProjectApiUsageStats(projectId: string): Promise<{
  total_tokens: number
  total_cost_usd: number
  total_requests: number
}> {
  const { data, error } = await supabase
    .from('api_usage')
    .select('tokens_total, cost_usd')
    .eq('project_id', projectId)

  if (error) throw error

  if (!data || data.length === 0) {
    return {
      total_tokens: 0,
      total_cost_usd: 0,
      total_requests: 0,
    }
  }

  const total_tokens = data.reduce((sum, item) => sum + item.tokens_total, 0)
  const total_cost_usd = data.reduce(
    (sum, item) => sum + (item.cost_usd || 0),
    0,
  )

  return {
    total_tokens,
    total_cost_usd,
    total_requests: data.length,
  }
}
