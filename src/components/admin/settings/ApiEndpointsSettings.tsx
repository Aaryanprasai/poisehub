
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-extensions/Button";

const formSchema = z.object({
  royaltyApiUrl: z.string().url({ message: "Please enter a valid URL" }),
  analyticsApiUrl: z.string().url({ message: "Please enter a valid URL" }),
  userApiUrl: z.string().url({ message: "Please enter a valid URL" }),
  trackApiUrl: z.string().url({ message: "Please enter a valid URL" }),
  distributionApiUrl: z.string().url({ message: "Please enter a valid URL" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ApiEndpointsSettings() {
  const [isSaving, setIsSaving] = useState(false);
  
  // In a real app, these would come from an API or context
  const defaultValues = {
    royaltyApiUrl: "https://api.example.com/royalties",
    analyticsApiUrl: "https://api.example.com/analytics",
    userApiUrl: "https://api.example.com/users",
    trackApiUrl: "https://api.example.com/tracks",
    distributionApiUrl: "https://api.example.com/distribution",
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
      console.log("API endpoints updated:", values);
      toast.success("API endpoints updated successfully");
    } catch (error) {
      toast.error("Failed to update API endpoints");
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
            name="royaltyApiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Royalty API URL</FormLabel>
                <FormDescription>
                  Endpoint for royalty processing and reporting
                </FormDescription>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="analyticsApiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Analytics API URL</FormLabel>
                <FormDescription>
                  Endpoint for analytics and insights data
                </FormDescription>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="userApiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User API URL</FormLabel>
                <FormDescription>
                  Endpoint for user management
                </FormDescription>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="trackApiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track API URL</FormLabel>
                <FormDescription>
                  Endpoint for track management
                </FormDescription>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="distributionApiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distribution API URL</FormLabel>
                <FormDescription>
                  Endpoint for distribution services
                </FormDescription>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
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
          Save API Endpoints
        </Button>
      </form>
    </Form>
  );
}
