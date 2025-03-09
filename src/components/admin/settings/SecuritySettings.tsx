
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Shield, LockOff } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-extensions/Button";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  requireStrongPasswords: z.boolean(),
  sessionTimeoutMinutes: z.coerce.number().int().min(5).max(1440),
  enforceIPRestriction: z.boolean(),
  allowedIPs: z.string().optional(),
  loginAttempts: z.coerce.number().int().min(1).max(10),
  publicLoginEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function SecuritySettings() {
  const [isSaving, setIsSaving] = useState(false);
  const { registrationConfig, updateRegistrationConfig } = useAuth();
  
  // In a real app, these would come from an API or context
  const defaultValues = {
    requireStrongPasswords: true,
    sessionTimeoutMinutes: 60,
    enforceIPRestriction: false,
    allowedIPs: "",
    loginAttempts: 5,
    publicLoginEnabled: registrationConfig.publicLoginEnabled,
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchIPRestriction = form.watch("enforceIPRestriction");

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    
    try {
      // Update the registration config for public login
      updateRegistrationConfig({
        publicLoginEnabled: values.publicLoginEnabled
      });
      
      // Simulate API call for other settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      console.log("Security settings updated:", values);
      toast.success("Security settings updated successfully");
    } catch (error) {
      toast.error("Failed to update security settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="publicLoginEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow Public Login</FormLabel>
                  <FormDescription>
                    Enable or disable direct user login. When disabled, only admin access is allowed.
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
            name="requireStrongPasswords"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Require Strong Passwords</FormLabel>
                  <FormDescription>
                    Enforce password complexity requirements for all users
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
            name="sessionTimeoutMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <FormDescription>
                  Set how long admin users can remain inactive before requiring re-login
                </FormDescription>
                <FormControl>
                  <Input 
                    type="number" 
                    min={5}
                    max={1440}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="loginAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Login Attempts</FormLabel>
                <FormDescription>
                  Number of failed login attempts before account lockout
                </FormDescription>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    max={10}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="enforceIPRestriction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">IP Restriction</FormLabel>
                  <FormDescription>
                    Restrict admin access to specific IP addresses
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
          
          {watchIPRestriction && (
            <FormField
              control={form.control}
              name="allowedIPs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed IP Addresses</FormLabel>
                  <FormDescription>
                    Enter comma-separated IP addresses or CIDR ranges (e.g., 192.168.1.1, 10.0.0.0/24)
                  </FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="192.168.1.1, 10.0.0.0/24" 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <Button 
          type="submit" 
          variant="destructive"
          isLoading={isSaving}
          leftIcon={<Shield className="h-4 w-4" />}
        >
          Update Security Settings
        </Button>
        
        {!form.watch("publicLoginEnabled") && (
          <Button 
            type="button" 
            variant="outline"
            className="ml-2"
            onClick={() => {
              form.setValue("publicLoginEnabled", true);
              form.handleSubmit(onSubmit)();
            }}
            leftIcon={<LockOff className="h-4 w-4" />}
          >
            Re-enable Public Login
          </Button>
        )}
      </form>
    </Form>
  );
}
