// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      api_usage: {
        Row: {
          cost_usd: number | null
          created_at: string
          id: string
          message_id: string | null
          model_used: string
          project_id: string | null
          tokens_input: number
          tokens_output: number
          tokens_total: number
          user_id: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          id?: string
          message_id?: string | null
          model_used: string
          project_id?: string | null
          tokens_input: number
          tokens_output: number
          tokens_total: number
          user_id: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          id?: string
          message_id?: string | null
          model_used?: string
          project_id?: string | null
          tokens_input?: number
          tokens_output?: number
          tokens_total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'api_usage_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'api_usage_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'api_usage_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      code_generations: {
        Row: {
          created_at: string
          error_message: string | null
          generation_time_ms: number | null
          generated_files: Json
          id: string
          message_id: string
          project_id: string
          prompt: string
          success: boolean | null
          tokens_consumed: number | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          generation_time_ms?: number | null
          generated_files: Json
          id?: string
          message_id: string
          project_id: string
          prompt: string
          success?: boolean | null
          tokens_consumed?: number | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          generation_time_ms?: number | null
          generated_files?: Json
          id?: string
          message_id?: string
          project_id?: string
          prompt?: string
          success?: boolean | null
          tokens_consumed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'code_generations_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'code_generations_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          project_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'conversations_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      files: {
        Row: {
          content: string
          created_at: string
          file_name: string
          file_path: string
          file_type: string
          id: string
          message_id: string | null
          project_id: string
          status: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          content: string
          created_at?: string
          file_name: string
          file_path: string
          file_type: string
          id?: string
          message_id?: string | null
          project_id: string
          status?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          message_id?: string | null
          project_id?: string
          status?: string | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'files_message_id_fkey'
            columns: ['message_id']
            isOneToOne: false
            referencedRelation: 'messages'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'files_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      integrations: {
        Row: {
          config: Json
          created_at: string
          id: string
          integration_type: string
          is_active: boolean | null
          last_sync_at: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_sync_at?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'integrations_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          model_used: string | null
          role: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          deployment_url: string | null
          description: string | null
          github_branch: string | null
          github_repo_name: string | null
          github_repo_url: string | null
          id: string
          last_generated_at: string | null
          name: string
          status: string | null
          supabase_project_id: string | null
          supabase_project_url: string | null
          tech_stack: Json | null
          template_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deployment_url?: string | null
          description?: string | null
          github_branch?: string | null
          github_repo_name?: string | null
          github_repo_url?: string | null
          id?: string
          last_generated_at?: string | null
          name: string
          status?: string | null
          supabase_project_id?: string | null
          supabase_project_url?: string | null
          tech_stack?: Json | null
          template_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deployment_url?: string | null
          description?: string | null
          github_branch?: string | null
          github_repo_name?: string | null
          github_repo_url?: string | null
          id?: string
          last_generated_at?: string | null
          name?: string
          status?: string | null
          supabase_project_id?: string | null
          supabase_project_url?: string | null
          tech_stack?: Json | null
          template_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      task_recommendations: {
        Row: {
          created_at: string
          estimated_tokens: number | null
          id: string
          optimal_tool: string
          project_id: string
          prompt: string
          reasoning: string
          recommendation: string
          task_type: string | null
          user_choice: string | null
        }
        Insert: {
          created_at?: string
          estimated_tokens?: number | null
          id?: string
          optimal_tool: string
          project_id: string
          prompt: string
          reasoning: string
          recommendation: string
          task_type?: string | null
          user_choice?: string | null
        }
        Update: {
          created_at?: string
          estimated_tokens?: number | null
          id?: string
          optimal_tool?: string
          project_id?: string
          prompt?: string
          reasoning?: string
          recommendation?: string
          task_type?: string | null
          user_choice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'task_recommendations_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      user_settings: {
        Row: {
          anthropic_api_key: string | null
          default_tech_stack: Json | null
          github_token: string | null
          id: string
          notifications_enabled: boolean | null
          preferred_model: string | null
          supabase_access_token: string | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          anthropic_api_key?: string | null
          default_tech_stack?: Json | null
          github_token?: string | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_model?: string | null
          supabase_access_token?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          anthropic_api_key?: string | null
          default_tech_stack?: Json | null
          github_token?: string | null
          id?: string
          notifications_enabled?: boolean | null
          preferred_model?: string | null
          supabase_access_token?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_settings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
