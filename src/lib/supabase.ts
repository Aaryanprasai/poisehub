
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
    console.log(`Calling admin-auth function with username: ${username}`);
    
    const response = await supabase.functions.invoke('admin-auth', {
      body: { username, password },
    });

    console.log('Admin auth response:', response);

    if (!response.data?.success) {
      const errorMessage = response.data?.error || 'Authentication failed';
      console.error('Admin auth error:', errorMessage);
      throw new Error(errorMessage);
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

    if (!response.data) {
      console.error('Password reset error: No data returned');
      return { success: false, error: 'No response from server' };
    }

    return response.data;
  } catch (error) {
    console.error('Admin password reset error:', error);
    throw error;
  }
};

// Verify reset token and set new password
export const verifyAdminReset = async (token: string, newPassword: string) => {
  try {
    const response = await supabase.functions.invoke('admin-verify-reset', {
      body: { token, newPassword },
    });

    return response.data;
  } catch (error) {
    console.error('Admin reset verification error:', error);
    throw error;
  }
};
