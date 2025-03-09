
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  accountType: z.enum(['personal', 'business'], {
    required_error: 'Account type is required',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: (email: string) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const { register, registrationConfig } = useAuth();
  const [canRegister, setCanRegister] = useState<boolean>(false);

  // Check if registration is allowed
  useEffect(() => {
    const isRegistrationEnabled = 
      registrationConfig.publicRegistrationEnabled && 
      !registrationConfig.inviteOnlyMode;
    
    setCanRegister(isRegistrationEnabled);
  }, [registrationConfig]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      accountType: 'personal',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    if (!canRegister) {
      toast.error('Registration is currently not available');
      return;
    }

    setIsRegistering(true);
    
    try {
      // Call the register function from AuthContext with accountType
      await register(values.name, values.email, values.password, values.accountType);
      
      toast.success('Registration successful! Please log in.');
      if (onSuccess) {
        onSuccess(values.email);
      }
      form.reset();
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  if (!canRegister) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Registration Unavailable</AlertTitle>
        <AlertDescription>
          Public registration is currently disabled. Please contact an administrator for an invitation.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your.email@example.com"
                  type="email"
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
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Account Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="personal" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Individual Artist
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="business" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Business or Label
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select whether you're registering as an individual artist or a business entity
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isRegistering}
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
}
