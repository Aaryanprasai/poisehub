
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Lock, Shield, LogIn } from 'lucide-react';

// Login Form Schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// OTP Form Schema
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export function AdminLoginForm() {
  const { adminLogin, verifyAdminOTP, adminOTPRequired, isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (isAuthenticated && isAdmin()) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // OTP form
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await adminLogin(data.username, data.password);
      toast.success('Please enter the OTP sent to your registered device');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP submission
  const onOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      await verifyAdminOTP(data.otp);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('OTP error:', error);
      toast.error('Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!adminOTPRequired ? (
        // Login form
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your admin username" 
                      {...field} 
                      disabled={isLoading}
                      className="bg-slate-800 border-slate-700 text-white"
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      disabled={isLoading}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200" 
              disabled={isLoading}
              leftIcon={<LogIn className="h-4 w-4" />}
            >
              {isLoading ? 'Signing in...' : 'Admin Sign In'}
            </Button>
          </form>
        </Form>
      ) : (
        // OTP verification form
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
              <p className="text-slate-400 text-sm">
                Enter the 6-digit code sent to your registered device
              </p>
            </div>
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Enter 6-digit OTP" 
                      {...field} 
                      disabled={isLoading}
                      maxLength={6}
                      className="text-center text-xl tracking-widest bg-slate-800 border-slate-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gray-200" 
              disabled={isLoading}
              leftIcon={<Lock className="h-4 w-4" />}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
