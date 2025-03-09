
import React, { useState, createContext, ReactNode, useEffect } from 'react';
import { User, RegistrationConfig } from '../types/auth';
import { AuthContextType } from './AuthContextType';
import { supabase } from '../lib/supabase';

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig>({
    publicRegistrationEnabled: true,
    inviteOnlyMode: false,
    publicLoginEnabled: true
  });
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            // Map database user to our User type
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
              phoneNumber: userData.phone_number || '',
              twoFactorEnabled: userData.two_factor_enabled,
              role: userData.role,
              createdAt: userData.created_at,
              idType: userData.id_type,
              verificationStatus: userData.verification_status,
              deleteStatus: userData.delete_status,
              hasReleases: userData.has_releases
            });
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              avatar: userData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
              phoneNumber: userData.phone_number || '',
              twoFactorEnabled: userData.two_factor_enabled,
              role: userData.role,
              createdAt: userData.created_at,
              idType: userData.id_type,
              verificationStatus: userData.verification_status,
              deleteStatus: userData.delete_status,
              hasReleases: userData.has_releases
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Fetch registration config
    const fetchRegistrationConfig = async () => {
      try {
        const { data } = await supabase
          .from('registration_config')
          .select('*')
          .limit(1)
          .single();
        
        if (data) {
          setRegistrationConfig({
            publicRegistrationEnabled: data.public_registration_enabled,
            inviteOnlyMode: data.invite_only_mode,
            publicLoginEnabled: data.public_login_enabled
          });
        }
      } catch (error) {
        console.error('Error fetching registration config:', error);
      }
    };

    fetchRegistrationConfig();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Check if public login is enabled
    if (!registrationConfig.publicLoginEnabled) {
      throw new Error('Public login is currently disabled. Please contact an administrator for access.');
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<void> => {
    // Assume admin logins use email + password
    const email = username.includes('@') ? username : `${username}@beatecho.com`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw new Error('Invalid admin credentials');
    }
    
    // Check if user has admin role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    
    if (!userData || (userData.role !== 'admin' && userData.role !== 'superadmin')) {
      // Sign out if not an admin
      await supabase.auth.signOut();
      throw new Error('User does not have admin privileges');
    }
  };

  const register = async (name: string, email: string, password: string, idType: 'personal' | 'business'): Promise<void> => {
    // Check if public registration is enabled
    if (!registrationConfig.publicRegistrationEnabled) {
      throw new Error('Public registration is currently disabled');
    }
    
    // Check if invite-only mode is enabled
    if (registrationConfig.inviteOnlyMode) {
      throw new Error('Registration is currently invite-only');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (data.user) {
      // Create user profile in users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name: name,
          email: email,
          role: 'artist',
          created_at: new Date().toISOString(),
          id_type: idType,
          verification_status: 'unverified',
          two_factor_enabled: false,
          has_releases: false,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      // Update the user in the database
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          phone_number: userData.phoneNumber,
          two_factor_enabled: userData.twoFactorEnabled,
          avatar: userData.avatar,
          id_type: userData.idType,
          verification_status: userData.verificationStatus,
          delete_status: userData.deleteStatus
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating user:', error);
        return;
      }
      
      // Update local state
      setUser({ ...user, ...userData });
    }
  };

  const toggleTwoFactor = async (enabled: boolean) => {
    if (user) {
      await updateUser({ twoFactorEnabled: enabled });
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (user) {
      await updateUser({ phoneNumber });
    }
  };

  const uploadVerificationDocuments = async (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument: string,
    taxDocument: string
  ) => {
    if (user) {
      // In a real implementation, you would upload these documents to Supabase storage
      // For now, we'll just update the user's verification status to 'pending'
      await updateUser({
        idType,
        verificationStatus: 'pending'
      });
    }
  };

  const requestAccountDeletion = async () => {
    if (user) {
      // If user has releases, set delete status to pending for admin approval
      if (user.hasReleases) {
        await updateUser({
          deleteStatus: 'pending'
        });
      } else {
        // Immediately delete account for users without releases
        // In a real implementation, you might want to delete the auth record too
        await logout();
      }
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return user?.role === 'superadmin';
  };
  
  const updateRegistrationConfig = async (config: Partial<RegistrationConfig>) => {
    // Update database
    const { error } = await supabase
      .from('registration_config')
      .update({
        public_registration_enabled: config.publicRegistrationEnabled,
        invite_only_mode: config.inviteOnlyMode,
        public_login_enabled: config.publicLoginEnabled
      })
      .eq('id', 1);
    
    if (error) {
      console.error('Error updating registration config:', error);
      return;
    }
    
    // Update local state
    setRegistrationConfig({
      ...registrationConfig,
      ...config
    });
  };

  if (loading) {
    // You could return a loading state here if needed
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoggedIn: !!user,
        login,
        register,
        adminLogin,
        logout,
        updateUser,
        toggleTwoFactor,
        updatePhoneNumber,
        uploadVerificationDocuments,
        requestAccountDeletion,
        isAdmin,
        isSuperAdmin,
        registrationConfig,
        updateRegistrationConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
