
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables are expected to be set in Vercel's dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dxugcngjknympflmwvrx.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dWdjbmdqa255bXBmbG13dnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjY5MjgsImV4cCI6MjA1NzEwMjkyOH0.G5D2JJF8Pod-mQgQH-LbS8IbQNglXIRglc0F_d5vj4o";
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create a single supabase client for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a separate client with service role for admin operations
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
  : supabase;
