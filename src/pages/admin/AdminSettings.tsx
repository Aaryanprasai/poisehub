
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistrationSettings } from '@/components/admin/RegistrationSettings';
import { CodeGenerationSettings } from '@/components/admin/CodeGenerationSettings';
import { PlatformManager } from '@/components/admin/PlatformManager';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>

        <Tabs defaultValue="registration">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="codes">ISRC/UPC</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registration" className="space-y-4 mt-4">
            <RegistrationSettings />
          </TabsContent>
          
          <TabsContent value="platforms" className="space-y-4 mt-4">
            <PlatformManager />
          </TabsContent>
          
          <TabsContent value="codes" className="space-y-4 mt-4">
            <CodeGenerationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
