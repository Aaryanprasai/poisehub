
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminRoyalties = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Royalty Management</h2>
          <p className="text-muted-foreground">
            View and manage artist royalty payments
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="current">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Quarter</SelectItem>
              <SelectItem value="previous">Previous Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Royalty Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No royalty data to display for the selected period.</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRoyalties;
