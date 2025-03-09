
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-extensions/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ApiEndpointsSettings } from "@/components/admin/settings/ApiEndpointsSettings";
import { ApiCredentialsSettings } from "@/components/admin/settings/ApiCredentialsSettings";
import { ApiWebhooksSettings } from "@/components/admin/settings/ApiWebhooksSettings";

const AdminApiConfig = () => {
  const [activeTab, setActiveTab] = useState("endpoints");
  const { isSuperAdmin } = useAuth();

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">API Configuration</h1>
          <p className="text-muted-foreground">
            Manage API endpoints, credentials, and webhooks for third-party integrations
          </p>
        </div>

        <Tabs
          defaultValue="endpoints"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-1 md:grid-cols-3 gap-2">
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="credentials">API Credentials</TabsTrigger>
            {isSuperAdmin() && (
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiEndpointsSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <ApiCredentialsSettings />
              </CardContent>
            </Card>
          </TabsContent>

          {isSuperAdmin() && (
            <TabsContent value="webhooks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApiWebhooksSettings />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApiConfig;
