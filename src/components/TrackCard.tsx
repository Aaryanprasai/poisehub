import { useState } from 'react';
import { Track } from '@/lib/types';
import { Card, CardContent } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { Play, Pause, MoreHorizontal, Calendar, Clock, Disc3, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function canDeleteTrack(takenDownAt?: Date): boolean {
  if (!takenDownAt) return false;
  
  const now = new Date();
  const takedownDate = new Date(takenDownAt);
  const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // approximate 3 months in milliseconds
  
  return now.getTime() - takedownDate.getTime() >= threeMonthsInMs;
}

interface TrackCardProps {
  track: Track;
  onEdit?: (track: Track) => void;
  onDelete?: (track: Track) => void;
  onTakedown?: (track: Track) => void;
  onRestore?: (track: Track) => void;
}

export function TrackCard({ track, onEdit, onDelete, onTakedown, onRestore }: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [takedownDialogOpen, setTakedownDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
  };

  const handleTakedown = () => {
    if (onTakedown) {
      onTakedown(track);
      setTakedownDialogOpen(false);
      toast.success("Track has been taken down from all platforms");
    }
  };

  const handleRestore = () => {
    if (onRestore) {
      onRestore(track);
      toast.success("Track will be restored on all platforms");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(track);
      setDeleteDialogOpen(false);
      toast.success("Track has been permanently deleted");
    }
  };

  const isDeletable = canDeleteTrack(track.takenDownAt);
  
  const statusVariants: Record<string, string> = {
    pending: 'status-badge status-pending',
    approved: 'status-badge status-approved',
    rejected: 'status-badge status-rejected',
  };

  return (
    <>
      <Card hoverEffect className="overflow-hidden">
        <div className="group relative aspect-square">
          <img
            src={track.artwork}
            alt={`${track.title} artwork`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
              track.takenDownAt && "opacity-60"
            )}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              onClick={togglePlayPause}
              size="icon"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full h-12 w-12"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 ml-1 text-white" />
              )}
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <span className={cn(statusVariants[track.status])}>
              {track.status.charAt(0).toUpperCase() + track.status.slice(1)}
            </span>
          </div>
          {track.takenDownAt && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Taken Down
              </span>
            </div>
          )}
          {track.modificationRequested && (
            <div className="absolute bottom-2 right-2">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Needs Modification
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{track.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{track.artist}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {!track.takenDownAt && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(track)}>Edit Track</DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setTakedownDialogOpen(true)} 
                      className="text-amber-600"
                    >
                      Take Down Track
                    </DropdownMenuItem>
                  </>
                )}
                
                {track.takenDownAt && (
                  <>
                    <DropdownMenuItem onClick={() => handleRestore()}>
                      Restore Track
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {isDeletable && (
                      <DropdownMenuItem 
                        onClick={() => setDeleteDialogOpen(true)} 
                        className="text-destructive"
                      >
                        Delete Permanently
                      </DropdownMenuItem>
                    )}
                    
                    {!isDeletable && (
                      <DropdownMenuItem className="text-muted-foreground cursor-not-allowed">
                        Delete (Available in {Math.ceil((90 - ((new Date().getTime() - new Date(track.takenDownAt!).getTime()) / (24 * 60 * 60 * 1000))))} days)
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {track.modificationRequested && track.modificationMessage && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
              <p className="font-medium text-yellow-800">Modification needed:</p>
              <p className="text-yellow-700">{track.modificationMessage}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-y-1 text-sm">
            <div className="w-full flex items-center gap-1.5 text-muted-foreground">
              <Disc3 className="h-3.5 w-3.5" />
              <span>{track.genre}</span>
            </div>
            <div className="w-full flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDuration(track.duration)}</span>
            </div>
            <div className="w-full flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {track.takenDownAt ? (
                  `Taken down: ${formatDate(track.takenDownAt)}`
                ) : track.releaseDate ? (
                  `Released: ${formatDate(track.releaseDate)}`
                ) : (
                  `Submitted: ${formatDate(track.submittedAt)}`
                )}
              </span>
            </div>
          </div>
          
          {track.distributionServices.length > 0 && !track.takenDownAt && (
            <div className="mt-3 flex flex-wrap gap-2">
              {track.distributionServices.slice(0, 3).map((service) => (
                <div 
                  key={service.id}
                  className="h-5 w-5 relative group"
                  title={service.name}
                >
                  <img 
                    src={service.logo} 
                    alt={service.name} 
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
              {track.distributionServices.length > 3 && (
                <div className="h-5 w-5 bg-secondary rounded-full flex items-center justify-center text-xs font-medium">
                  +{track.distributionServices.length - 3}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Takedown confirmation dialog */}
      <Dialog open={takedownDialogOpen} onOpenChange={setTakedownDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Down Track</DialogTitle>
            <DialogDescription>
              Are you sure you want to take down "{track.title}"? This will remove the track from all distribution platforms.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTakedownDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleTakedown}>Take Down Track</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Track Permanently</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete "{track.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
