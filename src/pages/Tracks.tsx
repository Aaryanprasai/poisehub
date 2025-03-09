
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { TrackCard } from '@/components/TrackCard';
import { UploadForm } from '@/components/UploadForm';
import { tracks } from '@/lib/mock-data';
import { Plus, Music, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from '@/components/AppLayout';

const Tracks = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Filter tracks by status
  const pendingTracks = tracks.filter(track => track.status === 'pending');
  const approvedTracks = tracks.filter(track => track.status === 'approved');
  const rejectedTracks = tracks.filter(track => track.status === 'rejected');

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tracks</h1>
            <p className="text-muted-foreground">Manage your releases and distribution</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0" 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload New Track
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Tracks ({tracks.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingTracks.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedTracks.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedTracks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {pendingTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="approved">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {approvedTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rejected">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {rejectedTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <UploadForm open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </AppLayout>
  );
};

export default Tracks;
