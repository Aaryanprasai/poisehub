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
import { LogIn } from 'lucide-react';
import { User } from '@/lib/types';

// Login Form Schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Simple credential check - no OTP verification
      if (data.username === 'poise' && data.password === 'adminpass123') {
        const adminUser: User = {
          id: 'admin1',
          name: 'Poise Admin',
          email: data.username + '@poisemusic.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          phoneNumber: '+1234567890',
          twoFactorEnabled: false,
          role: data.username === 'poise' ? 'superadmin' : 'admin',
          createdAt: new Date().toISOString(),
          verificationStatus: 'verified',
        };
        
        setUser(adminUser);
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
    </div>
  );
}
