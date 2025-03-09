
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-extensions/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRegistrationSettings } from "@/components/admin/settings/UserRegistrationSettings";
import { SystemSettings } from "@/components/admin/settings/SystemSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { useAuth } from "@/contexts/AuthContext";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("user-registration");
  const { isSuperAdmin } = useAuth();

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>

        <Tabs
          defaultValue="user-registration"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3 gap-2">
            <TabsTrigger value="user-registration">User Registration</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            {isSuperAdmin() && (
              <TabsTrigger value="security">Security</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="user-registration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registration Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <UserRegistrationSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SystemSettings />
              </CardContent>
            </Card>
          </TabsContent>

          {isSuperAdmin() && (
            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
