
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

interface DeleteDialogProps {
  track: Track;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteDialog({ track, open, onOpenChange, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Track Permanently</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete "{track.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete Permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
