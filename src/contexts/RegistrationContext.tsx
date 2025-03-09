
import React, { createContext, useContext, useState, useEffect } from 'react';

interface RegistrationConfig {
  publicRegistrationEnabled: boolean;
  inviteOnlyMode: boolean;
}

interface RegistrationContextType {
  registrationConfig: RegistrationConfig;
  updateRegistrationConfig: (config: Partial<RegistrationConfig>) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [registrationConfig, setRegistrationConfig] = useState<RegistrationConfig>({
    publicRegistrationEnabled: true,
    inviteOnlyMode: false
  });

  // Ensure invite-only mode is enabled when public registration is disabled
  useEffect(() => {
    if (!registrationConfig.publicRegistrationEnabled && !registrationConfig.inviteOnlyMode) {
      setRegistrationConfig(prev => ({
        ...prev,
        inviteOnlyMode: true
      }));
    }
  }, [registrationConfig.publicRegistrationEnabled]);

  const updateRegistrationConfig = (config: Partial<RegistrationConfig>) => {
    setRegistrationConfig(prevConfig => {
      const newConfig = {
        ...prevConfig,
        ...config
      };
      
      // If public registration is disabled, force invite-only to be true
      if (!newConfig.publicRegistrationEnabled) {
        newConfig.inviteOnlyMode = true;
      }
      
      return newConfig;
    });
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationConfig,
        updateRegistrationConfig,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

// Custom hook to use registration context
export function useRegistrationContext() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistrationContext must be used within a RegistrationProvider');
  }
  return context;
}
