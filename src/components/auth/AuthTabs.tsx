
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui-extensions/Card';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState('login');
  const { registrationConfig } = useAuth();
  
  const handleRegisterSuccess = (email: string) => {
    setActiveTab('login');
  };

  // If public registration is disabled, don't show the register tab
  const showRegisterTab = registrationConfig.publicRegistrationEnabled;

  return (
    <CardContent>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${showRegisterTab ? 'grid-cols-2' : 'grid-cols-1'} mb-6`}>
          <TabsTrigger value="login">Login</TabsTrigger>
          {showRegisterTab && <TabsTrigger value="register">Register</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
          <LoginForm />
        </TabsContent>
        
        {showRegisterTab && (
          <TabsContent value="register" className="mt-0">
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </TabsContent>
        )}
      </Tabs>
    </CardContent>
  );
}
