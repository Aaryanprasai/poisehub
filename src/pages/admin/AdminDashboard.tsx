
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { 
  Users, 
  Music, 
  Ticket, 
  DollarSign, 
  ShieldAlert, 
  LogOut, 
  Settings,
  Mail,
  UserPlus,
  FileSpreadsheet
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BulkUpdateForm } from '@/components/admin/BulkUpdateForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const registrationSchema = z.object({
  publicRegistrationEnabled: z.boolean(),
  inviteOnlyMode: z.boolean(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function AdminDashboard() {
  const { user, logout, isAdmin, isSuperAdmin, registrationConfig, updateRegistrationConfig } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState(3);
  const [pendingTracks, setPendingTracks] = useState(7);
  const [openTickets, setOpenTickets] = useState(5);
  const [pendingPayouts, setPendingPayouts] = useState(12);
  const [accountDeletionRequests, setAccountDeletionRequests] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');

  const form = useForm<RegistrationFormValues>({
    defaultValues: {
      publicRegistrationEnabled: registrationConfig.publicRegistrationEnabled,
      inviteOnlyMode: registrationConfig.inviteOnlyMode,
    },
  });

  // Update form when registrationConfig changes (to handle auto-enable of invite-only)
  React.useEffect(() => {
    form.reset({
      publicRegistrationEnabled: registrationConfig.publicRegistrationEnabled,
      inviteOnlyMode: registrationConfig.inviteOnlyMode,
    });
  }, [registrationConfig, form]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const onSubmit = (values: RegistrationFormValues) => {
    updateRegistrationConfig(values);
    toast.success('Registration settings updated successfully');
  };

  const adminCards = [
    {
      title: 'Pending Verifications',
      value: pendingUsers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Content for Review',
      value: pendingTracks,
      icon: Music,
      color: 'bg-purple-500',
      link: '/admin/tracks'
    },
    {
      title: 'Open Support Tickets',
      value: openTickets,
      icon: Ticket,
      color: 'bg-amber-500',
      link: '/admin/tickets'
    },
    {
      title: 'Pending Payouts',
      value: pendingPayouts,
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/admin/royalties'
    },
    {
      title: 'Deletion Requests',
      value: accountDeletionRequests,
      icon: ShieldAlert,
      color: 'bg-red-500',
      link: '/admin/deletion-requests'
    }
  ];

  if (!isAdmin()) {
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
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
              {adminCards.map((card) => (
                <Card key={card.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                        <p className="text-3xl font-bold mt-2">{card.value}</p>
                      </div>
                      <div className={`${card.color} p-2 rounded-full text-white`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4" 
                      onClick={() => navigate(card.link)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

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
            {isSuperAdmin() && (
              <Card>
                <CardHeader>
                  <CardTitle>Registration Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="publicRegistrationEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Public Registration</FormLabel>
                              <FormDescription>
                                Allow users to register accounts publicly
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                  // If turning off public registration, auto-enable invite-only
                                  if (!checked) {
                                    form.setValue('inviteOnlyMode', true);
                                  }
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="inviteOnlyMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Invite-Only Mode</FormLabel>
                              <FormDescription>
                                Only allow new users to register with an invitation
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!form.getValues().publicRegistrationEnabled}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit"
                        leftIcon={<Settings className="h-4 w-4" />}
                      >
                        Save Settings
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      // In a real app, this would send invitations
                      toast.success('Test invitations sent successfully');
                    }}
                    leftIcon={<Mail className="h-4 w-4" />}
                  >
                    Send Batch Invitations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate('/admin/system-settings')}
                    leftIcon={<Settings className="h-4 w-4" />}
                  >
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
