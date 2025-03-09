
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui-extensions/Card';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState('login');
  
  const handleRegisterSuccess = (email: string) => {
    setActiveTab('login');
  };

  return (
    <CardContent>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="mt-0">
          <LoginForm />
        </TabsContent>
        
        <TabsContent value="register" className="mt-0">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </TabsContent>
      </Tabs>
    </CardContent>
  );
}
