
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, UserPlus, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    status: 'verified',
    role: 'artist',
    createdAt: '2023-01-15T00:00:00Z',
    idType: 'personal'
  },
  {
    id: '2',
    name: 'Cody Fisher',
    email: 'cody@example.com',
    status: 'unverified',
    role: 'artist',
    createdAt: '2023-02-10T00:00:00Z',
    idType: 'personal'
  },
  {
    id: '3',
    name: 'Esther Howard',
    email: 'esther@example.com',
    status: 'pending',
    role: 'artist',
    createdAt: '2023-03-05T00:00:00Z',
    idType: 'business'
  },
  {
    id: '4',
    name: 'Robert Fox',
    email: 'robert@example.com',
    status: 'verified',
    role: 'artist',
    createdAt: '2023-03-20T00:00:00Z',
    idType: 'business'
  },
  {
    id: '5',
    name: 'Jenny Wilson',
    email: 'jenny@example.com',
    status: 'pending',
    role: 'artist',
    createdAt: '2023-04-12T00:00:00Z',
    idType: 'personal'
  }
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerifyUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'verified' } : user
    ));
    toast.success('User verification status updated');
  };

  const handleRejectUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'rejected' } : user
    ));
    toast.success('User verification status updated');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'unverified':
        return <Badge className="bg-slate-500">Unverified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and verification
            </p>
          </div>
          <Button 
            className="mt-4 sm:mt-0"
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Add New User
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Accounts</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.idType}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleVerifyUser(user.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Verify
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectUser(user.id)}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
