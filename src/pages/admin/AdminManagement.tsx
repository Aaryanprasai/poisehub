
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, UserCog, CheckCircle, XCircle, MoreHorizontal, Eye, ShieldAlert, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from 'react-router-dom';

// Mock admin data
const mockAdmins = [
  {
    id: 'admin1',
    name: 'Beat Echo Admin',
    email: 'beatecho@beatecho.com',
    role: 'superadmin',
    lastActive: '2023-10-15T14:30:00Z',
    createdAt: '2023-01-10T00:00:00Z',
    actionsCount: 245,
  },
  {
    id: 'admin2',
    name: 'Regular Admin',
    email: 'admin@beatecho.com',
    role: 'admin',
    lastActive: '2023-10-14T09:15:00Z',
    createdAt: '2023-02-05T00:00:00Z',
    actionsCount: 128,
  },
  {
    id: 'admin3',
    name: 'Content Manager',
    email: 'content@beatecho.com',
    role: 'admin',
    lastActive: '2023-10-12T16:45:00Z', 
    createdAt: '2023-04-20T00:00:00Z',
    actionsCount: 76,
  }
];

// Mock admin actions for the activity log
const mockAdminActivity = [
  {
    id: '1',
    adminId: 'admin2',
    adminName: 'Regular Admin',
    action: 'Approved user verification',
    targetId: 'user123',
    targetName: 'Jane Cooper',
    timestamp: '2023-10-14T09:15:00Z',
  },
  {
    id: '2',
    adminId: 'admin3',
    adminName: 'Content Manager',
    action: 'Approved track release',
    targetId: 'track456',
    targetName: 'Summer Vibes',
    timestamp: '2023-10-12T16:45:00Z',
  },
  {
    id: '3',
    adminId: 'admin1',
    adminName: 'Beat Echo Admin',
    action: 'Updated system settings',
    targetId: 'settings',
    targetName: 'Registration Settings',
    timestamp: '2023-10-15T14:30:00Z',
  },
  {
    id: '4',
    adminId: 'admin2',
    adminName: 'Regular Admin',
    action: 'Rejected user verification',
    targetId: 'user789',
    targetName: 'Robert Fox',
    timestamp: '2023-10-14T08:30:00Z',
  },
  {
    id: '5',
    adminId: 'admin3',
    adminName: 'Content Manager',
    action: 'Rejected track release',
    targetId: 'track789',
    targetName: 'Winter Blues',
    timestamp: '2023-10-12T15:20:00Z',
  },
];

export default function AdminManagement() {
  const [admins, setAdmins] = useState(mockAdmins);
  const [activity, setActivity] = useState(mockAdminActivity);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter activity based on search query
  const filteredActivity = activity.filter(item => 
    item.adminName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.targetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAdmin = (admin: any) => {
    setSelectedAdmin(admin);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAdmin = () => {
    if (selectedAdmin) {
      // Remove admin from the list
      setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
      // Remove admin's activity from the activity log
      setActivity(activity.filter(item => item.adminId !== selectedAdmin.id));
      toast.success(`Admin ${selectedAdmin.name} has been deleted`);
      setShowDeleteDialog(false);
    }
  };

  // Check if the current user is a superadmin, otherwise redirect
  if (!isSuperAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <ShieldAlert className="h-16 w-16 text-red-500" />
            <p className="text-center">Only superadmins can access the admin management section.</p>
            <Button onClick={() => navigate('/admin/dashboard')}>
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
            <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
            <p className="text-muted-foreground">
              Manage admin accounts and monitor admin activity
            </p>
          </div>
          <Button 
            className="mt-4 sm:mt-0"
            leftIcon={<UserCog className="h-4 w-4" />}
            onClick={() => navigate('/admin/create-admin')}
          >
            Create New Admin
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Admin Accounts</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search admins..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'superadmin' ? 'destructive' : 'default'} className="capitalize">
                        {admin.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(admin.lastActive).toLocaleString()}</TableCell>
                    <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* Don't allow superadmin to delete themselves */}
                          {admin.id !== user?.id && (
                            <DropdownMenuItem onClick={() => handleDeleteAdmin(admin)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Admin
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No admin accounts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivity.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.adminName}</TableCell>
                    <TableCell>{item.action}</TableCell>
                    <TableCell>{item.targetName}</TableCell>
                    <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {filteredActivity.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No activity found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete admin confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedAdmin?.name}'s admin account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAdmin}>
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
