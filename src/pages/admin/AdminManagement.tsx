
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, UserCog, Edit, Trash2, PlusCircle, ShieldAlert } from 'lucide-react';
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from '@/components/ui/badge';

// Mock admin data
const mockAdmins = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane@beatecho.com',
    role: 'admin',
    lastActive: '2023-10-15T14:30:00Z',
    actionsCount: 245,
  },
  {
    id: '2',
    name: 'Robert Fox',
    email: 'robert@beatecho.com',
    role: 'admin',
    lastActive: '2023-10-14T09:20:00Z',
    actionsCount: 152,
  },
  {
    id: '3',
    name: 'Beat Echo',
    email: 'beatecho@beatecho.com',
    role: 'superadmin',
    lastActive: '2023-10-15T16:45:00Z',
    actionsCount: 897,
  },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.enum(["admin", "superadmin"], { 
    required_error: "Please select a role." 
  }),
});

export default function AdminManagement() {
  const { user, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState(mockAdmins);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: selectedAdmin?.name || "",
      email: selectedAdmin?.email || "",
      role: (selectedAdmin?.role as "admin" | "superadmin") || "admin",
    },
  });

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (admin: any) => {
    setSelectedAdmin(admin);
    form.reset({
      name: admin.name,
      email: admin.email,
      role: admin.role as "admin" | "superadmin",
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (admin: any) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
    toast.success(`Admin ${selectedAdmin.name} has been deleted`);
    setIsDeleteDialogOpen(false);
  };

  const onSubmitEdit = (data: z.infer<typeof formSchema>) => {
    setAdmins(admins.map(admin => 
      admin.id === selectedAdmin.id ? { ...admin, ...data } : admin
    ));
    toast.success(`Admin ${data.name} has been updated`);
    setIsEditDialogOpen(false);
  };

  const onSubmitAdd = (data: z.infer<typeof formSchema>) => {
    const newAdmin = {
      id: String(admins.length + 1),
      name: data.name,
      email: data.email,
      role: data.role,
      lastActive: new Date().toISOString(),
      actionsCount: 0,
    };
    setAdmins([...admins, newAdmin]);
    toast.success(`Admin ${data.name} has been added`);
    setIsAddDialogOpen(false);
    form.reset({
      name: "",
      email: "",
      role: "admin",
    });
  };

  if (!isSuperAdmin()) {
    return (
      <AdminLayout>
        <div className="container p-6 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <ShieldAlert className="h-16 w-16 text-red-500" />
              <p className="text-center">Only superadmins can access this page.</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
            <p className="text-muted-foreground">
              Manage admin accounts and permissions
            </p>
          </div>
          <Button 
            className="mt-4 sm:mt-0"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() => {
              form.reset({
                name: "",
                email: "",
                role: "admin",
              });
              setIsAddDialogOpen(true);
            }}
          >
            Add New Admin
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
                  <TableHead>Actions Count</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        {admin.name}
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {admin.role === 'superadmin' ? (
                        <Badge className="bg-purple-500">Super Admin</Badge>
                      ) : (
                        <Badge className="bg-blue-500">Admin</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(admin.lastActive).toLocaleString()}</TableCell>
                    <TableCell>{admin.actionsCount}</TableCell>
                    <TableCell className="text-right">
                      {user?.id !== admin.id && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEdit(admin)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(admin)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {user?.id === admin.id && (
                        <span className="text-sm text-muted-foreground italic">Current user</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAdmins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Admin Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Admin</DialogTitle>
              <DialogDescription>
                Make changes to the admin account.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal">Admin</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="superadmin" />
                            </FormControl>
                            <FormLabel className="font-normal">Super Admin</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Admin Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Admin</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this admin account? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="font-medium">{selectedAdmin?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedAdmin?.email}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Admin Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new admin account with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal">Admin</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="superadmin" />
                            </FormControl>
                            <FormLabel className="font-normal">Super Admin</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add admin</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
