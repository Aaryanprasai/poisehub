
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

interface AuthTabsProps {
  onSuccess?: (email: string) => void;
  defaultTab?: string;
}

export function AuthTabs({ onSuccess, defaultTab = "login" }: AuthTabsProps) {
  const { registrationConfig } = useAuth();
  const canRegister = registrationConfig.publicRegistrationEnabled && !registrationConfig.inviteOnlyMode;

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        {canRegister && <TabsTrigger value="register">Register</TabsTrigger>}
      </TabsList>
      <TabsContent value="login" className="mt-6">
        <LoginForm onSuccess={onSuccess} />
      </TabsContent>
      {canRegister && (
        <TabsContent value="register" className="mt-6">
          <RegisterForm onSuccess={onSuccess} />
        </TabsContent>
      )}
    </Tabs>
  );
}
