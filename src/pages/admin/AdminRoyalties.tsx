
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter, ArrowUpDown } from 'lucide-react';

// Mock data for royalty payments
const mockRoyaltyData = [
  {
    id: '1',
    artist: 'John Doe',
    trackTitle: 'Summer Vibes',
    platform: 'Spotify',
    amount: 235.50,
    status: 'paid',
    date: '2023-10-15',
  },
  {
    id: '2',
    artist: 'Jane Smith',
    trackTitle: 'Midnight Dreams',
    platform: 'Apple Music',
    amount: 189.75,
    status: 'pending',
    date: '2023-10-20',
  },
  {
    id: '3',
    artist: 'Alex Johnson',
    trackTitle: 'Ocean Waves',
    platform: 'YouTube Music',
    amount: 312.25,
    status: 'processing',
    date: '2023-10-18',
  },
  {
    id: '4',
    artist: 'Maria Garcia',
    trackTitle: 'Electric Sunset',
    platform: 'Amazon Music',
    amount: 175.90,
    status: 'paid',
    date: '2023-10-12',
  },
  {
    id: '5',
    artist: 'David Lee',
    trackTitle: 'Urban Jungle',
    platform: 'Deezer',
    amount: 142.30,
    status: 'pending',
    date: '2023-10-22',
  },
];

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    case 'processing':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

export default function AdminRoyalties() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Filter the data based on search term and status
  const filteredData = mockRoyaltyData.filter(royalty => {
    const matchesSearch = 
      royalty.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      royalty.trackTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      royalty.platform.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || royalty.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Royalty Management</h1>
        
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Payout Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Royalty Payments</CardTitle>
                <CardDescription>
                  Manage and track royalty payments to artists.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by artist, track or platform..."
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
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                            Artist <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                            Amount <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
                            Date <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((royalty) => (
                          <TableRow key={royalty.id}>
                            <TableCell className="font-medium">{royalty.id}</TableCell>
                            <TableCell>{royalty.artist}</TableCell>
                            <TableCell>{royalty.trackTitle}</TableCell>
                            <TableCell>{royalty.platform}</TableCell>
                            <TableCell>${royalty.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(royalty.status)}>
                                {royalty.status.charAt(0).toUpperCase() + royalty.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{royalty.date}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No royalty payments found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Royalty Reports</CardTitle>
                <CardDescription>
                  View and generate royalty reports for specific time periods.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-16 text-muted-foreground">
                  Reports functionality will be implemented in a future update.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>
                  Configure global royalty payout settings and schedules.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-16 text-muted-foreground">
                  Payout settings functionality will be implemented in a future update.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
