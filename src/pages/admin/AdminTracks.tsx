
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, CheckCircle, XCircle, MoreHorizontal, Music, Filter } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tracks as mockTracks } from '@/lib/mock-data';
import { Track } from '@/lib/types';

export default function AdminTracks() {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || track.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApproveTrack = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, status: 'approved', releaseDate: new Date() } : track
    ));
    toast.success('Track approved successfully');
  };

  const handleRejectTrack = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { ...track, status: 'rejected' } : track
    ));
    toast.success('Track rejected');
  };

  const handleRequestModification = (trackId: string) => {
    setTracks(tracks.map(track => 
      track.id === trackId ? { 
        ...track, 
        modificationRequested: true,
        modificationMessage: 'Please update metadata to meet our requirements.'
      } : track
    ));
    toast.success('Modification request sent to artist');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">Track Management</h1>
            <p className="text-muted-foreground">
              Review and manage submitted music
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Submitted Tracks
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select 
                    value={statusFilter} 
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tracks..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={track.artwork} 
                          alt={track.title} 
                          className="h-8 w-8 rounded object-cover"
                        />
                        {track.title}
                      </div>
                    </TableCell>
                    <TableCell>{track.artist}</TableCell>
                    <TableCell>{track.genre}</TableCell>
                    <TableCell>{getStatusBadge(track.status)}</TableCell>
                    <TableCell>{new Date(track.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleApproveTrack(track.id)}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectTrack(track.id)}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRequestModification(track.id)}>
                            Request Modification
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTracks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No tracks found
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
