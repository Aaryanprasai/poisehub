
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';

const UpdateProfile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Update Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          {user && <ProfileForm />}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfile;
