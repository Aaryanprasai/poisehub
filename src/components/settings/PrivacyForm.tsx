
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { toast } from 'sonner';

// Privacy settings schema
const privacySettingsSchema = z.object({
  profileVisibility: z.boolean().default(true),
  showStreamingStats: z.boolean().default(true),
  allowTagging: z.boolean().default(true),
  shareListeningActivity: z.boolean().default(false),
});

type PrivacySettingsValues = z.infer<typeof privacySettingsSchema>;

export function PrivacyForm() {
  // Privacy settings form
  const form = useForm<PrivacySettingsValues>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: true,
      showStreamingStats: true,
      allowTagging: true,
      shareListeningActivity: false,
    },
  });

  const onSubmit = (data: PrivacySettingsValues) => {
    console.log('Privacy settings updated:', data);
    toast.success('Privacy settings updated successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control how your information is shown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileVisibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Public Profile</FormLabel>
                    <FormDescription>
                      Make your profile visible to other users and platforms.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="showStreamingStats"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Show Streaming Stats</FormLabel>
                    <FormDescription>
                      Display your streaming numbers publicly on your profile.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allowTagging"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Tagging</FormLabel>
                    <FormDescription>
                      Let other users tag you in comments and posts.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shareListeningActivity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Share Listening Activity</FormLabel>
                    <FormDescription>
                      Share what you're listening to with your followers.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
