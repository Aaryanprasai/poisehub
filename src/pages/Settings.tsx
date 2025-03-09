
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Profile schema
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  bio: z.string().optional(),
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
});

// Account settings schema
const accountSettingsSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  activityDigest: z.boolean().default(true),
});

// Privacy settings schema
const privacySettingsSchema = z.object({
  profileVisibility: z.boolean().default(true),
  showStreamingStats: z.boolean().default(true),
  allowTagging: z.boolean().default(true),
  shareListeningActivity: z.boolean().default(false),
});

// Manage connected accounts schema
const connectedAccountsSchema = z.object({
  spotify: z.boolean().default(false),
  appleMusic: z.boolean().default(false),
  youtubeMusic: z.boolean().default(false),
  soundcloud: z.boolean().default(false),
});

type ProfileValues = z.infer<typeof profileSchema>;
type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;
type PrivacySettingsValues = z.infer<typeof privacySettingsSchema>;
type ConnectedAccountsValues = z.infer<typeof connectedAccountsSchema>;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'artist@example.com',
      bio: 'Independent electronic music producer based in Los Angeles, CA.',
      website: 'https://johndoe-music.com',
    },
  });

  // Account settings form
  const accountSettingsForm = useForm<AccountSettingsValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      twoFactorAuth: false,
      emailNotifications: true,
      marketingEmails: false,
      activityDigest: true,
    },
  });

  // Privacy settings form
  const privacySettingsForm = useForm<PrivacySettingsValues>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: true,
      showStreamingStats: true,
      allowTagging: true,
      shareListeningActivity: false,
    },
  });

  // Connected accounts form
  const connectedAccountsForm = useForm<ConnectedAccountsValues>({
    resolver: zodResolver(connectedAccountsSchema),
    defaultValues: {
      spotify: false,
      appleMusic: false,
      youtubeMusic: false,
      soundcloud: false,
    },
  });

  // Form submission handlers
  const onProfileSubmit = (data: ProfileValues) => {
    console.log('Profile updated:', data);
    toast.success('Profile updated successfully');
  };

  const onAccountSettingsSubmit = (data: AccountSettingsValues) => {
    console.log('Account settings updated:', data);
    toast.success('Account settings updated successfully');
  };

  const onPrivacySettingsSubmit = (data: PrivacySettingsValues) => {
    console.log('Privacy settings updated:', data);
    toast.success('Privacy settings updated successfully');
  };

  const onConnectedAccountsSubmit = (data: ConnectedAccountsValues) => {
    console.log('Connected accounts updated:', data);
    toast.success('Connected accounts updated successfully');
  };

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and profile</p>
          </div>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <CardDescription className="text-xs">
                            This is your public display name.
                          </CardDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <CardDescription className="text-xs">
                            This email will be used for notifications and login.
                          </CardDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <CardDescription className="text-xs">
                            A brief description about you as an artist.
                          </CardDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <CardDescription className="text-xs">
                            Your personal or artist website URL.
                          </CardDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...accountSettingsForm}>
                  <form onSubmit={accountSettingsForm.handleSubmit(onAccountSettingsSubmit)} className="space-y-6">
                    <FormField
                      control={accountSettingsForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Two-factor Authentication</FormLabel>
                            <CardDescription>
                              Add an extra layer of security to your account.
                            </CardDescription>
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
                      control={accountSettingsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <CardDescription>
                              Receive important account updates via email.
                            </CardDescription>
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
                      control={accountSettingsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                            <CardDescription>
                              Receive promotional emails about new features and offers.
                            </CardDescription>
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
                      control={accountSettingsForm.control}
                      name="activityDigest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Activity Digest</FormLabel>
                            <CardDescription>
                              Receive weekly reports on your music performance.
                            </CardDescription>
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
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control how your information is shown
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...privacySettingsForm}>
                  <form onSubmit={privacySettingsForm.handleSubmit(onPrivacySettingsSubmit)} className="space-y-6">
                    <FormField
                      control={privacySettingsForm.control}
                      name="profileVisibility"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Public Profile</FormLabel>
                            <CardDescription>
                              Make your profile visible to other users and platforms.
                            </CardDescription>
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
                      control={privacySettingsForm.control}
                      name="showStreamingStats"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Show Streaming Stats</FormLabel>
                            <CardDescription>
                              Display your streaming numbers publicly on your profile.
                            </CardDescription>
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
                      control={privacySettingsForm.control}
                      name="allowTagging"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Allow Tagging</FormLabel>
                            <CardDescription>
                              Let other users tag you in comments and posts.
                            </CardDescription>
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
                      control={privacySettingsForm.control}
                      name="shareListeningActivity"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Share Listening Activity</FormLabel>
                            <CardDescription>
                              Share what you're listening to with your followers.
                            </CardDescription>
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
          </TabsContent>
          
          {/* Connected Accounts */}
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage your connected music services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...connectedAccountsForm}>
                  <form onSubmit={connectedAccountsForm.handleSubmit(onConnectedAccountsSubmit)} className="space-y-6">
                    <FormField
                      control={connectedAccountsForm.control}
                      name="spotify"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Spotify</FormLabel>
                            <CardDescription>
                              Connect your Spotify artist account.
                            </CardDescription>
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
                      control={connectedAccountsForm.control}
                      name="appleMusic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Apple Music</FormLabel>
                            <CardDescription>
                              Connect your Apple Music artist account.
                            </CardDescription>
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
                      control={connectedAccountsForm.control}
                      name="youtubeMusic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">YouTube Music</FormLabel>
                            <CardDescription>
                              Connect your YouTube Music channel.
                            </CardDescription>
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
                      control={connectedAccountsForm.control}
                      name="soundcloud"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">SoundCloud</FormLabel>
                            <CardDescription>
                              Connect your SoundCloud account.
                            </CardDescription>
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
