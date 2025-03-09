
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminTickets = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
          <p className="text-muted-foreground">
            Manage and respond to user support tickets
          </p>
        </div>

        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open Tickets</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Open Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No open tickets at this time.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="in-progress" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>In Progress Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No tickets in progress at this time.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No resolved tickets to display.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
