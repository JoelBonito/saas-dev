-- Create users table
CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email text NOT NULL,
    full_name text NULL,
    avatar_url text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

-- Create projects table
CREATE TABLE public.projects (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    description text NULL,
    template_type text NULL,
    tech_stack jsonb NULL DEFAULT '[]'::jsonb,
    github_repo_url text NULL,
    github_repo_name text NULL,
    github_branch text NULL DEFAULT 'main'::text,
    supabase_project_id text NULL,
    supabase_project_url text NULL,
    deployment_url text NULL,
    status text NULL DEFAULT 'active'::text,
    last_generated_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT projects_status_check CHECK ((status = ANY (ARRAY['active'::text, 'archived'::text, 'deleted'::text]))),
    CONSTRAINT projects_template_type_check CHECK ((template_type = ANY (ARRAY['web_app'::text, 'mobile'::text, 'dashboard'::text, 'api'::text, 'landing_page'::text, 'fullstack'::text])))
);
CREATE INDEX idx_projects_status ON public.projects USING btree (status);
CREATE INDEX idx_projects_user_id ON public.projects USING btree (user_id);

-- Create conversations table
CREATE TABLE public.conversations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    title text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT conversations_pkey PRIMARY KEY (id),
    CONSTRAINT conversations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);
CREATE INDEX idx_conversations_project_id ON public.conversations USING btree (project_id);

-- Create messages table
CREATE TABLE public.messages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    conversation_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    tokens_used integer NULL DEFAULT 0,
    model_used text NULL DEFAULT 'claude-sonnet-4-5-20250929'::text,
    metadata jsonb NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE,
    CONSTRAINT messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text])))
);
CREATE INDEX idx_messages_conversation_id ON public.messages USING btree (conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at DESC);

-- Create files table
CREATE TABLE public.files (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    message_id uuid NULL,
    file_path text NOT NULL,
    file_name text NOT NULL,
    file_type text NOT NULL,
    content text NOT NULL,
    version integer NULL DEFAULT 1,
    status text NULL DEFAULT 'active'::text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT files_pkey PRIMARY KEY (id),
    CONSTRAINT files_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE SET NULL,
    CONSTRAINT files_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
    CONSTRAINT files_status_check CHECK ((status = ANY (ARRAY['active'::text, 'modified'::text, 'deleted'::text])))
);
CREATE INDEX idx_files_project_id ON public.files USING btree (project_id);
CREATE UNIQUE INDEX idx_files_project_path ON public.files USING btree (project_id, file_path) WHERE (status = 'active'::text);
CREATE INDEX idx_files_status ON public.files USING btree (status);

-- Create code_generations table
CREATE TABLE public.code_generations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    message_id uuid NOT NULL,
    prompt text NOT NULL,
    generated_files jsonb NOT NULL,
    success boolean NULL DEFAULT true,
    error_message text NULL,
    tokens_consumed integer NULL DEFAULT 0,
    generation_time_ms integer NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT code_generations_pkey PRIMARY KEY (id),
    CONSTRAINT code_generations_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE,
    CONSTRAINT code_generations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);
CREATE INDEX idx_code_generations_project_id ON public.code_generations USING btree (project_id);

-- Create task_recommendations table
CREATE TABLE public.task_recommendations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    prompt text NOT NULL,
    recommendation text NOT NULL,
    optimal_tool text NOT NULL,
    reasoning text NOT NULL,
    task_type text NULL,
    estimated_tokens integer NULL,
    user_choice text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT task_recommendations_pkey PRIMARY KEY (id),
    CONSTRAINT task_recommendations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
    CONSTRAINT task_recommendations_optimal_tool_check CHECK ((optimal_tool = ANY (ARRAY['claude'::text, 'gemini'::text, 'chatgpt'::text, 'deepseek'::text]))),
    CONSTRAINT task_recommendations_recommendation_check CHECK ((recommendation = ANY (ARRAY['claude'::text, 'manual_external'::text]))),
    CONSTRAINT task_recommendations_user_choice_check CHECK ((user_choice = ANY (ARRAY['proceeded_claude'::text, 'used_external'::text, 'cancelled'::text])))
);
CREATE INDEX idx_task_recommendations_project_id ON public.task_recommendations USING btree (project_id);

-- Create integrations table
CREATE TABLE public.integrations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    integration_type text NOT NULL,
    config jsonb NOT NULL,
    is_active boolean NULL DEFAULT true,
    last_sync_at timestamptz NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT integrations_pkey PRIMARY KEY (id),
    CONSTRAINT integrations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE,
    CONSTRAINT integrations_integration_type_check CHECK ((integration_type = ANY (ARRAY['github'::text, 'supabase'::text, 'vercel'::text, 'netlify'::text])))
);
CREATE INDEX idx_integrations_project_id ON public.integrations USING btree (project_id);

-- Create user_settings table
CREATE TABLE public.user_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    default_tech_stack jsonb NULL DEFAULT '["react", "typescript", "tailwind"]'::jsonb,
    github_token text NULL,
    supabase_access_token text NULL,
    anthropic_api_key text NULL,
    preferred_model text NULL DEFAULT 'claude-sonnet-4-5-20250929'::text,
    theme text NULL DEFAULT 'dark'::text,
    notifications_enabled boolean NULL DEFAULT true,
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_settings_pkey PRIMARY KEY (id),
    CONSTRAINT user_settings_user_id_key UNIQUE (user_id),
    CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
    CONSTRAINT user_settings_theme_check CHECK ((theme = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text])))
);

-- Create api_usage table
CREATE TABLE public.api_usage (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    project_id uuid NULL,
    message_id uuid NULL,
    tokens_input integer NOT NULL,
    tokens_output integer NOT NULL,
    tokens_total integer NOT NULL,
    cost_usd numeric(10, 6) NULL,
    model_used text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT api_usage_pkey PRIMARY KEY (id),
    CONSTRAINT api_usage_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE SET NULL,
    CONSTRAINT api_usage_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL,
    CONSTRAINT api_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);
CREATE INDEX idx_api_usage_created_at ON public.api_usage USING btree (created_at DESC);
CREATE INDEX idx_api_usage_user_id ON public.api_usage USING btree (user_id);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users access own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own conversations" ON public.conversations FOR ALL USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));
CREATE POLICY "Users access own messages" ON public.messages FOR ALL USING (auth.uid() = (SELECT p.user_id FROM public.projects p JOIN public.conversations c ON p.id = c.project_id WHERE c.id = conversation_id));
CREATE POLICY "Users access own files" ON public.files FOR ALL USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));
CREATE POLICY "Users access own code generations" ON public.code_generations FOR ALL USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));
CREATE POLICY "Users access own task recommendations" ON public.task_recommendations FOR ALL USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));
CREATE POLICY "Users access own integrations" ON public.integrations FOR ALL USING (auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id));
CREATE POLICY "Users access own api usage" ON public.api_usage FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);
