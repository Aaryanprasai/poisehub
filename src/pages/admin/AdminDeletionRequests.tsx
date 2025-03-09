
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';

const AdminDeletionRequests = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Account Deletion Requests</h2>
          <p className="text-muted-foreground">
            Review and process account deletion requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Deletion Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No deletion requests pending review.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deletion Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Users with active releases require admin approval for account deletion. All releases must be properly archived or transferred before deletion can be approved.
            </p>
            <Button variant="outline">Update Deletion Policy</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDeletionRequests;
