
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-extensions/Button";

const formSchema = z.object({
  trackApprovalMode: z.enum(["automatic", "manual", "ai-assisted"]),
  maxUploadSizeMB: z.coerce.number().int().min(1).max(1000),
  systemEmailAddress: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function SystemSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  // In a real app, these would come from an API or context
  const defaultValues = {
    trackApprovalMode: "manual" as const,
    maxUploadSizeMB: 100,
    systemEmailAddress: "system@poise.com",
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // In a real app, this would be an API call
      console.log("System settings updated:", values);
      toast.success("System settings updated successfully");
    } catch (error) {
      toast.error("Failed to update system settings");
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
            name="trackApprovalMode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Track Approval Mode</FormLabel>
                <FormDescription>
                  Choose how new track uploads are approved in the system
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="automatic" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Automatic (No review)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="manual" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Manual (Admin review required)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="ai-assisted" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        AI-Assisted (With admin final approval)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="maxUploadSizeMB"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Upload Size (MB)</FormLabel>
                <FormDescription>
                  Set the maximum file size for track uploads
                </FormDescription>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1}
                    max={1000}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="systemEmailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>System Email Address</FormLabel>
                <FormDescription>
                  Email address used for system notifications
                </FormDescription>
                <FormControl>
                  <Input type="email" {...field} />
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
