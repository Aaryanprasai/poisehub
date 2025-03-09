
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (email: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get the 'from' path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoggingIn(true);
    
    try {
      await login(values.emailOrUsername, values.password);
      toast.success('Login successful!');
      navigate(from);
      if (onSuccess) {
        onSuccess(values.emailOrUsername);
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoggingIn(true);
    
    // This function will be connected to real Google OAuth later
    setTimeout(async () => {
      try {
        await login('google-user@example.com', 'password');
        toast.success('Google login successful!');
        navigate(from);
        if (onSuccess) {
          onSuccess('google-user@example.com');
        }
      } catch (error) {
        toast.error('Google login failed. Please try again.');
      } finally {
        setIsGoogleLoggingIn(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emailOrUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com or username"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoggingIn}
          >
            Sign In
          </Button>
        </form>
      </Form>
      
      <div className="flex items-center">
        <Separator className="flex-grow" />
        <span className="px-3 text-xs text-muted-foreground">OR</span>
        <Separator className="flex-grow" />
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        className="w-full border-gray-300 hover:bg-gray-50"
        onClick={handleGoogleLogin}
        isLoading={isGoogleLoggingIn}
        leftIcon={<Mail className="h-4 w-4" />}
      >
        Continue with Google
      </Button>
    </div>
  );
}
