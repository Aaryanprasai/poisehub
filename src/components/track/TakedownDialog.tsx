
import { Track } from "@/lib/types";
import { Button } from "@/components/ui-extensions/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TakedownDialogProps {
  track: Track;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TakedownDialog({ track, open, onOpenChange, onConfirm }: TakedownDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take Down Track</DialogTitle>
          <DialogDescription>
            Are you sure you want to take down "{track.title}"? This will remove the track from all distribution platforms.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Take Down Track</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
