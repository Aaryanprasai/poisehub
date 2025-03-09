
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { ShieldCheck } from 'lucide-react';
import { verifyAdminReset } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isResetting, setIsResetting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      navigate('/admin/login');
      return;
    }

    // In a real implementation, you would validate the token on the server
    // For this demo, we'll assume the token is valid if it exists
    setTokenValid(true);
    setTokenChecked(true);
  }, [token, navigate]);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    if (!token) return;
    
    setIsResetting(true);
    
    try {
      const result = await verifyAdminReset(token, values.password);
      
      if (result.success) {
        toast.success('Password has been reset successfully');
        
        // Log the user in with their new credentials
        try {
          await adminLogin(result.admin.username, values.password);
          navigate('/admin/dashboard');
        } catch (loginError) {
          console.error('Login after reset error:', loginError);
          navigate('/admin/login');
        }
      } else {
        toast.error(result.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsResetting(false);
    }
  };

  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
        <Card className="w-full max-w-md shadow-lg animate-slide-up border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Invalid Reset Link</CardTitle>
            <CardDescription className="text-center">
              This reset link is invalid or has expired. Please request a new password reset.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/admin/login')}
            >
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="animate-fade-in w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Poise</h1>
          </div>
        </div>

        <Card className="w-full shadow-lg animate-slide-up border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="new-password"
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
                  isLoading={isResetting}
                  leftIcon={<ShieldCheck className="h-4 w-4" />}
                >
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
