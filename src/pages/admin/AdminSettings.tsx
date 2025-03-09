
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui-extensions/Card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui-extensions/Button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Shield, Save } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const securitySchema = z.object({
  requireAdminAuth: z.boolean().default(false),
  requireTwoFactor: z.boolean().default(false),
});

type SecurityFormValues = z.infer<typeof securitySchema>;

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      requireAdminAuth: false,
      requireTwoFactor: false,
    },
  });

  const onSubmit = (data: SecurityFormValues) => {
    setIsLoading(true);
    
    // In a real app, this would be saved to a database or API
    console.log('Security settings to be saved:', data);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Settings saved successfully');
      
      if (data.requireAdminAuth) {
        toast.info('Authentication requirement will take effect after page reload', {
          description: 'This is currently disabled for development'
        });
      }
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        
        <div className="grid gap-6">
          {/* Security Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure authentication and security settings for the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="requireAdminAuth"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Admin Authentication</FormLabel>
                          <FormDescription>
                            When enabled, users must authenticate to access admin features.
                            <br />
                            <span className="text-yellow-600 font-medium">
                              Currently disabled for development
                            </span>
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requireTwoFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            When enabled, admin users will need to verify with OTP.
                            <br />
                            <span className="text-yellow-600 font-medium">
                              Will be implemented with real API in the future
                            </span>
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!form.getValues().requireAdminAuth}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    leftIcon={<Save className="h-4 w-4" />}
                    isLoading={isLoading}
                  >
                    Save Security Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* API Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Set up authentication API endpoints for secure admin access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4 bg-slate-50">
                <p className="text-slate-700 mb-2">
                  This section will allow you to configure authentication APIs when they're implemented.
                </p>
                <p className="text-slate-600 text-sm">
                  Authentication is currently disabled for development, but this section will contain:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                  <li>API endpoint configuration</li>
                  <li>Authentication method selection</li>
                  <li>API key management</li>
                  <li>OAuth integration settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
