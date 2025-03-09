
import React, { createContext, useContext, useState } from 'react';

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

  const updateRegistrationConfig = (config: Partial<RegistrationConfig>) => {
    setRegistrationConfig({
      ...registrationConfig,
      ...config
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
