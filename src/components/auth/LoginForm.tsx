
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
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (email: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registrationConfig } = useAuth();
  
  // Get the 'from' path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const resetForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
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
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onResetSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsResetting(true);
    
    try {
      // This will be implemented with actual Supabase auth in the future
      // For now, just show a success message
      setTimeout(() => {
        setResetLinkSent(true);
        toast.success('Password reset instructions sent to your email');
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send reset instructions. Please try again.');
      }
    } finally {
      setIsResetting(false);
    }
  };

  // If public login is disabled, show a message instead of the login form
  if (!registrationConfig.publicLoginEnabled) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Direct login is currently disabled. Please contact an administrator for access or visit the admin portal.
          </AlertDescription>
        </Alert>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/admin')}
        >
          Go to Admin Portal
        </Button>
      </div>
    );
  }

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
          <div className="text-right">
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-sm p-0 h-auto">
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email to receive password reset instructions.
                  </DialogDescription>
                </DialogHeader>
                {resetLinkSent ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Password reset instructions have been sent to your email.
                        Please check your inbox and follow the instructions to reset your password.
                      </AlertDescription>
                    </Alert>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setResetLinkSent(false);
                        resetForm.reset();
                        setIsResetOpen(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                      <FormField
                        control={resetForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="w-full" 
                          isLoading={isResetting}
                        >
                          Send Reset Instructions
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoggingIn}
          >
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
}
