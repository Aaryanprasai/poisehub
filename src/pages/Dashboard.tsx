
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { RoyaltyChart } from '@/components/RoyaltyChart';
import { TrackCard } from '@/components/TrackCard';
import { UploadForm } from '@/components/UploadForm';
import { tracks, royaltyData } from '@/lib/mock-data';
import { ArrowRight, Plus, Music, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';

const Dashboard = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Filter tracks by status
  const pendingTracks = tracks.filter(track => track.status === 'pending');
  const approvedTracks = tracks.filter(track => track.status === 'approved');
  const rejectedTracks = tracks.filter(track => track.status === 'rejected');

  // Calculate total earnings
  const totalEarnings = royaltyData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Manage your music distribution all in one place</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0" 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload New Track
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tracks.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {approvedTracks.length} approved releases
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTracks.length}</div>
              <p className="text-xs text-muted-foreground">
                Tracks awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedTracks.length}</div>
              <p className="text-xs text-muted-foreground">
                Tracks that need revision
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <span className="text-muted-foreground text-sm">YTD</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From all platforms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tracks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Tracks</h2>
            <Button variant="ghost" size="sm">
              <Link to="/tracks" className="flex items-center gap-1">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.slice(0, 4).map((track, index) => (
              <div 
                key={track.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <TrackCard track={track} />
              </div>
            ))}
          </div>
        </div>

        {/* Royalty Chart */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Royalty Overview</h2>
            <Button variant="ghost" size="sm">
              <Link to="/payments" className="flex items-center gap-1">
                View detailed report <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
            <RoyaltyChart data={royaltyData} />
          </div>
        </div>
      </div>

      <UploadForm open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </AppLayout>
  );
};

export default Dashboard;
