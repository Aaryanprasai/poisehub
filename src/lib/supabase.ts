
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a Supabase client with the public key for regular operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For admin operations, we'll use the edge function to authenticate
export const supabaseAdmin = supabase;

// Call the admin authentication edge function
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await supabase.functions.invoke('admin-auth', {
      body: { username, password },
    });

    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Authentication failed');
    }

    return response.data.user;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Call the admin password reset edge function
export const requestAdminPasswordReset = async (email: string) => {
  try {
    const response = await supabase.functions.invoke('admin-reset-password', {
      body: { email },
    });

    return response.data;
  } catch (error) {
    console.error('Admin password reset error:', error);
    throw error;
  }
};
