
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { ShieldCheck, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
});

export function AdminLoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const navigate = useNavigate();
  const { adminLogin, verifyAdminOTP } = useAuth();

  const loginForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    setIsLoggingIn(true);
    
    try {
      await adminLogin(values.username, values.password);
      setShowOTPInput(true);
      toast.success('OTP sent to your registered email/WhatsApp');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onOTPSubmit = async (values: z.infer<typeof otpSchema>) => {
    setIsLoggingIn(true);
    
    try {
      await verifyAdminOTP(values.otp);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showOTPInput ? (
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter admin username"
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
      ) : (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                A verification code has been sent to your registered email/WhatsApp. Please enter it below to continue.
              </p>
            </div>
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code (OTP)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
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
              leftIcon={<Key className="h-4 w-4" />}
            >
              Verify & Login
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
