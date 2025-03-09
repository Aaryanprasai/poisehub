
import React, { createContext, ReactNode, useEffect } from 'react';
import { AuthContextType } from './AuthContextType';
import { LoadingSpinner } from '../components/auth/LoadingSpinner';
import { useAuthentication } from '../hooks/useAuthentication';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuthRoles } from '../hooks/useAuthRoles';

// Create the context with undefined as default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    setUser,
    registrationConfig,
    setRegistrationConfig,
    loading,
    setLoading,
    login,
    adminLogin,
    register,
    logout
  } = useAuthentication();

  const {
    updateUser,
    toggleTwoFactor,
    updatePhoneNumber,
    uploadVerificationDocuments,
    requestAccountDeletion
  } = useUserProfile(user, setUser);

  const { isAdmin, isSuperAdmin } = useAuthRoles(user);

  // Initialize with mock data
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const updateRegistrationConfig = async (config: Partial<typeof registrationConfig>) => {
    // Update local state only
    setRegistrationConfig({
      ...registrationConfig,
      ...config
    });
  };

  if (loading) {
    return <LoadingSpinner />;
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
