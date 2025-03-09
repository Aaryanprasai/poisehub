
import { useState } from 'react';
import { Track } from '@/lib/types';
import { Card, CardContent } from '@/components/ui-extensions/Card';
import { toast } from 'sonner';
import { TrackImage } from './track/TrackImage';
import { TrackStatus } from './track/TrackStatus';
import { TrackMetadata } from './track/TrackMetadata';
import { DistributionServices } from './track/DistributionServices';
import { TrackActionButtons } from './track/TrackActionButtons';
import { ModificationMessage } from './track/ModificationMessage';
import { TakedownDialog } from './track/TakedownDialog';
import { DeleteDialog } from './track/DeleteDialog';

interface TrackCardProps {
  track: Track;
  onEdit?: (track: Track) => void;
  onDelete?: (track: Track) => void;
  onTakedown?: (track: Track) => void;
  onRestore?: (track: Track) => void;
}

export function TrackCard({ track, onEdit, onDelete, onTakedown, onRestore }: TrackCardProps) {
  const [takedownDialogOpen, setTakedownDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleEdit = () => {
    if (onEdit) {
      onEdit(track);
    }
  };

  return (
    <>
      <Card hoverEffect className="overflow-hidden">
        <TrackImage track={track} />
        <TrackStatus track={track} />
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{track.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{track.artist}</p>
            </div>
            <TrackActionButtons
              track={track}
              onEdit={handleEdit}
              onTakedown={() => setTakedownDialogOpen(true)}
              onDelete={() => setDeleteDialogOpen(true)}
              onRestore={handleRestore}
            />
          </div>
          
          <ModificationMessage track={track} />
          <TrackMetadata track={track} />
          <DistributionServices 
            services={track.distributionServices} 
            isTakenDown={!!track.takenDownAt} 
          />
        </CardContent>
      </Card>

      <TakedownDialog
        track={track}
        open={takedownDialogOpen}
        onOpenChange={setTakedownDialogOpen}
        onConfirm={handleTakedown}
      />

      <DeleteDialog
        track={track}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  );
}
