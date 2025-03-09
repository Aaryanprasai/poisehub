
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserPlus, ShieldAlert } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const adminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'superadmin']),
});

type AdminFormValues = z.infer<typeof adminSchema>;

export default function AdminCreate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'admin',
    },
  });

  const onSubmit = (values: AdminFormValues) => {
    setIsSubmitting(true);
    
    // In a real application, this would make an API call to create the admin
    setTimeout(() => {
      console.log('Creating admin:', values);
      setIsSubmitting(false);
      toast.success(`Admin user "${values.name}" created successfully`);
      form.reset();
      navigate('/admin/users');
    }, 1500);
  };

  if (!isSuperAdmin()) {
    return (
      <AdminLayout>
        <div className="container p-4 md:p-6 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Access Denied
              </CardTitle>
              <CardDescription>
                Only superadmins can create new admin users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/admin/dashboard')}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container p-4 md:p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Admin</h1>
          <p className="text-muted-foreground">
            Add a new administrator to the system
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Details</CardTitle>
            <CardDescription>
              Create a new admin user with appropriate access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter admin name" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="admin@beatecho.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be used for login and notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a secure password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Admin will be prompted to change this on first login
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Admin Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Admin - Can manage content, users, and support tickets
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="superadmin" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Superadmin - Full access to all system features
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                  leftIcon={<UserPlus className="h-4 w-4" />}
                >
                  Create Admin User
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
