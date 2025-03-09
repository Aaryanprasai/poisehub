
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Save } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui-extensions/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  serviceProvider: z.string().min(1, { message: "Please select a service provider" }),
  apiKey: z.string().min(1, { message: "API key is required" }),
  apiSecret: z.string().min(1, { message: "API secret is required" }),
  environment: z.enum(["development", "staging", "production"]),
});

type FormValues = z.infer<typeof formSchema>;

export function ApiCredentialsSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  
  // In a real app, these would come from an API or context
  const defaultValues = {
    serviceProvider: "spotify",
    apiKey: "sk_test_4eC39HqLyjWDarjtT1zdp7dc",
    apiSecret: "whsec_abcdefghijklmnopqrstuvwxyz1234567890",
    environment: "development" as const,
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
      console.log("API credentials updated:", values);
      toast.success("API credentials updated successfully");
    } catch (error) {
      toast.error("Failed to update API credentials");
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
            name="serviceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Provider</FormLabel>
                <FormDescription>
                  Select the third-party service provider
                </FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service provider" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="apple_music">Apple Music</SelectItem>
                    <SelectItem value="youtube_music">YouTube Music</SelectItem>
                    <SelectItem value="deezer">Deezer</SelectItem>
                    <SelectItem value="tidal">Tidal</SelectItem>
                    <SelectItem value="custom">Custom Provider</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="environment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Environment</FormLabel>
                <FormDescription>
                  Select which environment these credentials are for
                </FormDescription>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormDescription>
                  Client ID or API key for authentication
                </FormDescription>
                <div className="flex">
                  <FormControl>
                    <Input 
                      type={showApiKey ? "text" : "password"} 
                      {...field} 
                      className="rounded-r-none"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-l-none border-l-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="apiSecret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Secret</FormLabel>
                <FormDescription>
                  Client secret or API secret for authentication
                </FormDescription>
                <div className="flex">
                  <FormControl>
                    <Input 
                      type={showApiSecret ? "text" : "password"} 
                      {...field} 
                      className="rounded-r-none"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-l-none border-l-0"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                  >
                    {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save API Credentials
        </Button>
      </form>
    </Form>
  );
}
