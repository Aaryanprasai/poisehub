
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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

// Connected accounts schema
const connectedAccountsSchema = z.object({
  spotify: z.boolean().default(false),
  appleMusic: z.boolean().default(false),
  youtubeMusic: z.boolean().default(false),
  soundcloud: z.boolean().default(false),
});

// Phone number schema
const phoneNumberSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
});

type ProfileValues = z.infer<typeof profileSchema>;
type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;
type PrivacySettingsValues = z.infer<typeof privacySettingsSchema>;
type ConnectedAccountsValues = z.infer<typeof connectedAccountsSchema>;
type PhoneNumberValues = z.infer<typeof phoneNumberSchema>;

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, updateUser, toggleTwoFactor, updatePhoneNumber } = useAuth();

  // Profile form
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || 'John Doe',
      email: user?.email || 'artist@example.com',
      bio: 'Independent electronic music producer based in Los Angeles, CA.',
      website: 'https://johndoe-music.com',
    },
  });

  // Account settings form
  const accountSettingsForm = useForm<AccountSettingsValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      twoFactorAuth: user?.twoFactorEnabled || false,
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

  // Phone number form
  const phoneNumberForm = useForm<PhoneNumberValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
    },
  });

  // Form submission handlers
  const onProfileSubmit = (data: ProfileValues) => {
    updateUser({
      name: data.name,
      email: data.email,
    });
  };

  const onAccountSettingsSubmit = (data: AccountSettingsValues) => {
    toggleTwoFactor(data.twoFactorAuth);
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

  const onPhoneNumberSubmit = (data: PhoneNumberValues) => {
    updatePhoneNumber(data.phoneNumber);
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
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
                          <FormDescription className="text-xs">
                            This is your public display name.
                          </FormDescription>
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
                          <FormDescription className="text-xs">
                            This email will be used for notifications and login.
                          </FormDescription>
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
                          <FormDescription className="text-xs">
                            A brief description about you as an artist.
                          </FormDescription>
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
                          <FormDescription className="text-xs">
                            Your personal or artist website URL.
                          </FormDescription>
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
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive important account updates via email.
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
                      control={accountSettingsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive promotional emails about new features and offers.
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
                      control={accountSettingsForm.control}
                      name="activityDigest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Activity Digest</FormLabel>
                            <FormDescription>
                              Receive weekly reports on your music performance.
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
          </TabsContent>
          
          {/* Security Settings - New Tab */}
          <TabsContent value="security">
            <div className="grid gap-6">
              {/* Phone Number Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Phone Number</CardTitle>
                  <CardDescription>
                    Add your phone number for account recovery and two-factor authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...phoneNumberForm}>
                    <form onSubmit={phoneNumberForm.handleSubmit(onPhoneNumberSubmit)} className="space-y-6">
                      <FormField
                        control={phoneNumberForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="+1 (555) 000-0000" />
                            </FormControl>
                            <FormDescription>
                              Your phone number will be used for security purposes only.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Save Number</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {/* Two-Factor Authentication Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!user?.phoneNumber && (
                    <Alert variant="destructive">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Phone Number Required</AlertTitle>
                      <AlertDescription>
                        You need to add a phone number before enabling two-factor authentication.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Form {...accountSettingsForm}>
                    <form onSubmit={accountSettingsForm.handleSubmit(onAccountSettingsSubmit)} className="space-y-6">
                      <FormField
                        control={accountSettingsForm.control}
                        name="twoFactorAuth"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Two-factor Authentication</FormLabel>
                              <FormDescription>
                                Receive a code on your phone each time you sign in.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!user?.phoneNumber}
                                aria-readonly
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={!user?.phoneNumber}>Save Changes</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
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
                      control={privacySettingsForm.control}
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
                      control={privacySettingsForm.control}
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
                      control={privacySettingsForm.control}
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
                            <FormDescription>
                              Connect your Spotify artist account.
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
                      control={connectedAccountsForm.control}
                      name="appleMusic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Apple Music</FormLabel>
                            <FormDescription>
                              Connect your Apple Music artist account.
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
                      control={connectedAccountsForm.control}
                      name="youtubeMusic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">YouTube Music</FormLabel>
                            <FormDescription>
                              Connect your YouTube Music channel.
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
                      control={connectedAccountsForm.control}
                      name="soundcloud"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">SoundCloud</FormLabel>
                            <FormDescription>
                              Connect your SoundCloud account.
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
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
