
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import { SecurityForm } from '@/components/settings/SecurityForm';
import { PrivacyForm } from '@/components/settings/PrivacyForm';
import { ConnectionsForm } from '@/components/settings/ConnectionsForm';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

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
            <ProfileForm />
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <AccountSettingsForm />
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <SecurityForm />
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <PrivacyForm />
          </TabsContent>
          
          {/* Connected Accounts */}
          <TabsContent value="connections">
            <ConnectionsForm />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
