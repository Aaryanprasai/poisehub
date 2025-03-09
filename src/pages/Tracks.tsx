
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { TrackCard } from '@/components/TrackCard';
import { UploadForm } from '@/components/UploadForm';
import { tracks as mockTracks } from '@/lib/mock-data';
import { Plus, Music, CheckCircle, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from '@/components/AppLayout';
import { Track } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Tracks = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    artist: '',
    genre: ''
  });

  // Filter tracks by status
  const pendingTracks = tracks.filter(track => track.status === 'pending' && !track.takenDownAt);
  const approvedTracks = tracks.filter(track => track.status === 'approved' && !track.takenDownAt);
  const rejectedTracks = tracks.filter(track => track.status === 'rejected' && !track.takenDownAt);
  const takenDownTracks = tracks.filter(track => !!track.takenDownAt);
  const modificationTracks = tracks.filter(track => track.modificationRequested && !track.takenDownAt);

  const handleEditTrack = (track: Track) => {
    setSelectedTrack(track);
    setEditFormData({
      title: track.title,
      artist: track.artist,
      genre: track.genre
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedTrack) return;

    const updatedTracks = tracks.map(track => {
      if (track.id === selectedTrack.id) {
        return {
          ...track,
          title: editFormData.title,
          artist: editFormData.artist,
          genre: editFormData.genre,
          modificationRequested: false,
          modificationMessage: undefined
        };
      }
      return track;
    });

    setTracks(updatedTracks);
    setEditDialogOpen(false);
    toast.success("Track details updated successfully");
  };

  const handleTakedownTrack = (track: Track) => {
    const updatedTracks = tracks.map(t => {
      if (t.id === track.id) {
        return { ...t, takenDownAt: new Date() };
      }
      return t;
    });
    setTracks(updatedTracks);
  };

  const handleRestoreTrack = (track: Track) => {
    const updatedTracks = tracks.map(t => {
      if (t.id === track.id) {
        const updatedTrack = { ...t };
        delete updatedTrack.takenDownAt;
        return updatedTrack;
      }
      return t;
    });
    setTracks(updatedTracks);
  };

  const handleDeleteTrack = (track: Track) => {
    const updatedTracks = tracks.filter(t => t.id !== track.id);
    setTracks(updatedTracks);
  };

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
            onClick={() => setUploadDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload New Track
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All Tracks ({tracks.filter(t => !t.takenDownAt).length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingTracks.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedTracks.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedTracks.length})</TabsTrigger>
            {modificationTracks.length > 0 && (
              <TabsTrigger value="modifications" className="flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                Modifications ({modificationTracks.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="takendown">Taken Down ({takenDownTracks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {tracks.filter(t => !t.takenDownAt).map((track) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onEdit={handleEditTrack}
                  onTakedown={handleTakedownTrack}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pending">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {pendingTracks.map((track) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onEdit={handleEditTrack}
                  onTakedown={handleTakedownTrack}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="approved">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {approvedTracks.map((track) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onEdit={handleEditTrack}
                  onTakedown={handleTakedownTrack}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rejected">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {rejectedTracks.map((track) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onEdit={handleEditTrack}
                  onTakedown={handleTakedownTrack}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="modifications">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {modificationTracks.map((track) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onEdit={handleEditTrack}
                  onTakedown={handleTakedownTrack}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="takendown">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-6">
              {takenDownTracks.map((track) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onDelete={handleDeleteTrack}
                  onRestore={handleRestoreTrack}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <UploadForm open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />

      {/* Edit track dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>
              Make changes to your track information.
              {selectedTrack?.modificationRequested && selectedTrack?.modificationMessage && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="font-medium text-yellow-800">Requested changes:</p>
                  <p className="text-yellow-700">{selectedTrack.modificationMessage}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                id="title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="artist" className="text-right">
                Artist
              </label>
              <Input
                id="artist"
                value={editFormData.artist}
                onChange={(e) => setEditFormData({ ...editFormData, artist: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="genre" className="text-right">
                Genre
              </label>
              <Input
                id="genre"
                value={editFormData.genre}
                onChange={(e) => setEditFormData({ ...editFormData, genre: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Tracks;
