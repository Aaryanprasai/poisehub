
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { 
  ShieldAlert, 
  LogOut, 
  UserPlus,
  FileSpreadsheet
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkUpdateForm } from '@/components/admin/BulkUpdateForm';
import { AdminOverviewCards } from '@/components/admin/AdminOverviewCards';
import { RegistrationSettings } from '@/components/admin/RegistrationSettings';
import { QuickActions } from '@/components/admin/QuickActions';

export default function AdminDashboard() {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState(3);
  const [pendingTracks, setPendingTracks] = useState(7);
  const [openTickets, setOpenTickets] = useState(5);
  const [pendingPayouts, setPendingPayouts] = useState(12);
  const [accountDeletionRequests, setAccountDeletionRequests] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // For development - temporarily disable admin check
  const authEnabled = false;

  // Only check admin access if auth is enabled
  if (authEnabled && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <ShieldAlert className="h-16 w-16 text-red-500" />
            <p className="text-center">You don't have permission to access the admin panel.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. You are logged in as {user?.role}.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            {isSuperAdmin() && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/create-admin')}
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Create Admin
              </Button>
            )}
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              leftIcon={<LogOut className="h-4 w-4" />}
            >
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="settings">Admin Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <AdminOverviewCards 
              pendingUsers={pendingUsers}
              pendingTracks={pendingTracks}
              openTickets={openTickets}
              pendingPayouts={pendingPayouts}
              accountDeletionRequests={accountDeletionRequests}
            />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  Bulk Data Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BulkUpdateForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            {isSuperAdmin() && <RegistrationSettings />}
            <QuickActions />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
