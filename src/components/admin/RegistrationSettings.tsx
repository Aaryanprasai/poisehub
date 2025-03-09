
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';

const registrationSchema = z.object({
  publicRegistrationEnabled: z.boolean(),
  inviteOnlyMode: z.boolean(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export function RegistrationSettings() {
  const { registrationConfig, updateRegistrationConfig } = useAuth();

  const form = useForm<RegistrationFormValues>({
    defaultValues: {
      publicRegistrationEnabled: registrationConfig.publicRegistrationEnabled,
      inviteOnlyMode: registrationConfig.inviteOnlyMode,
    },
  });

  // Update form when registrationConfig changes (to handle auto-enable of invite-only)
  React.useEffect(() => {
    form.reset({
      publicRegistrationEnabled: registrationConfig.publicRegistrationEnabled,
      inviteOnlyMode: registrationConfig.inviteOnlyMode,
    });
  }, [registrationConfig, form]);

  const onSubmit = (values: RegistrationFormValues) => {
    updateRegistrationConfig(values);
    toast.success('Registration settings updated successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="publicRegistrationEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Registration</FormLabel>
                    <FormDescription>
                      Allow users to register accounts publicly
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        // If turning off public registration, auto-enable invite-only
                        if (!checked) {
                          form.setValue('inviteOnlyMode', true);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inviteOnlyMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Invite-Only Mode</FormLabel>
                    <FormDescription>
                      Only allow new users to register with an invitation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!form.getValues().publicRegistrationEnabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit"
              leftIcon={<Settings className="h-4 w-4" />}
            >
              Save Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
