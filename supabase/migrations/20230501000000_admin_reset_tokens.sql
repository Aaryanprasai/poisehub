
-- Create a table for password reset tokens
CREATE TABLE IF NOT EXISTS public.admin_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS to protect the tokens table
ALTER TABLE public.admin_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Only allow access through secure functions (no direct API access)
CREATE POLICY "No direct access to reset tokens" 
  ON public.admin_reset_tokens
  FOR ALL
  USING (false);
