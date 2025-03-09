
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, UserX, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for account deletion requests
const mockDeletionRequests = [
  {
    id: '1',
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    requestDate: '2023-10-15',
    status: 'pending',
    hasReleases: true,
    reason: 'No longer using the platform',
  },
  {
    id: '2',
    username: 'SarahSmith',
    email: 'sarah.smith@example.com',
    requestDate: '2023-10-17',
    status: 'pending',
    hasReleases: true,
    reason: 'Privacy concerns',
  },
  {
    id: '3',
    username: 'MikeJohnson',
    email: 'mike.johnson@example.com',
    requestDate: '2023-10-18',
    status: 'approved',
    hasReleases: false,
    reason: 'Moving to another platform',
  },
  {
    id: '4',
    username: 'EmilyDavis',
    email: 'emily.davis@example.com',
    requestDate: '2023-10-20',
    status: 'rejected',
    hasReleases: true,
    reason: 'Accidental request',
  },
  {
    id: '5',
    username: 'AlexWilson',
    email: 'alex.wilson@example.com',
    requestDate: '2023-10-22',
    status: 'pending',
    hasReleases: false,
    reason: 'Personal reasons',
  },
];

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'rejected':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export default function AdminDeletionRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [requests, setRequests] = useState(mockDeletionRequests);
  
  // Filter the data based on search term and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Count requests by status
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  // Handle request actions
  const handleApprove = (id: string) => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id ? { ...request, status: 'approved' } : request
      )
    );
    toast.success('Account deletion request approved');
  };

  const handleReject = (id: string) => {
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id ? { ...request, status: 'rejected' } : request
      )
    );
    toast.success('Account deletion request rejected');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Account Deletion Requests</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                  <p className="text-3xl font-bold">{pendingCount}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold">{approvedCount}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <Check className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold">{rejectedCount}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-full text-red-600">
                  <X className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Deletion Requests</CardTitle>
            <CardDescription>
              Review and manage account deletion requests from users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by username, email or reason..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>{filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Has Releases</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>{request.username}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>{request.hasReleases ? 'Yes' : 'No'}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={request.reason}>
                          {request.reason}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReject(request.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {request.status !== 'pending' && (
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No deletion requests found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
