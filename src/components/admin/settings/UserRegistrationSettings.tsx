
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui-extensions/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";

const formSchema = z.object({
  publicRegistrationEnabled: z.boolean(),
  inviteOnlyMode: z.boolean(),
});

export function UserRegistrationSettings() {
  const { registrationConfig, updateRegistrationConfig } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      publicRegistrationEnabled: registrationConfig.publicRegistrationEnabled,
      inviteOnlyMode: registrationConfig.inviteOnlyMode,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      updateRegistrationConfig(values);
      toast.success("Registration settings updated successfully");
    } catch (error) {
      toast.error("Failed to update registration settings");
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
            name="publicRegistrationEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Public Registration</FormLabel>
                  <FormDescription>
                    Allow users to register new accounts via the public registration form
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
            name="inviteOnlyMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Invite-Only Mode</FormLabel>
                  <FormDescription>
                    Only allow users with invitations to register new accounts
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!form.watch("publicRegistrationEnabled")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
