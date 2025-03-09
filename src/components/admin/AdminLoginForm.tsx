
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { adminLogin as loginToAdmin, requestAdminPasswordReset } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .email('Must be a valid email')
    .refine(val => val.endsWith('@poisemusic.com'), {
      message: 'Only @poisemusic.com email addresses are allowed',
    }),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Must be a valid email')
    .refine(val => val.endsWith('@poisemusic.com'), {
      message: 'Only @poisemusic.com email addresses are allowed',
    }),
});

export function AdminLoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const loginForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const resetForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    setIsLoggingIn(true);
    
    try {
      const adminUser = await loginToAdmin(values.username, values.password);
      
      // Use the adminLogin function from AuthContext to set the user in the app state
      await adminLogin(values.username, values.password);
      
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onResetSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsResetting(true);
    
    try {
      await requestAdminPasswordReset(values.email);
      toast.success('If your email exists in our system, you will receive password reset instructions');
      setIsResetOpen(false);
      resetForm.reset();
    } catch (error) {
      console.error('Password reset error:', error);
      // Don't reveal if the email exists or not for security
      toast.success('If your email exists in our system, you will receive password reset instructions');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@poisemusic.com"
                    autoComplete="username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
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
            leftIcon={<ShieldCheck className="h-4 w-4" />}
          >
            Admin Sign In
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="text-sm">
              Forgot password?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your @poisemusic.com email to receive password reset instructions.
              </DialogDescription>
            </DialogHeader>
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
                          placeholder="admin@poisemusic.com" 
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
                    leftIcon={<Mail className="h-4 w-4" />}
                  >
                    Send Reset Instructions
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
