
import React, { useState } from 'react';
import { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui-extensions/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { AccountSettingsForm } from '@/components/settings/AccountSettingsForm';
import { VerificationForm } from '@/components/verification/VerificationForm';

interface ProfileProps {
  user?: User;
}

const Profile: React.FC<ProfileProps> = () => {
  const { user, uploadVerificationDocuments } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" onClick={() => setActiveTab('verification')}>
          {user?.verificationStatus === 'verified' ? 'Verified ✓' : 'Verify Account'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              {user && <ProfileForm />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {user && <AccountSettingsForm />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
              <CardDescription>Verify your identity to unlock all features</CardDescription>
            </CardHeader>
            <CardContent>
              {user && <VerificationForm user={user} uploadVerificationDocuments={uploadVerificationDocuments} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
