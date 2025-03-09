
import { supabase } from './supabase';

export const createSuperUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-superuser');
    
    if (error) {
      console.error('Error creating superuser:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error creating superuser:', error);
    return { success: false, error };
  }
};
