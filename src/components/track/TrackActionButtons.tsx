
import { Track } from "@/lib/types";
import { Button } from "@/components/ui-extensions/Button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canDeleteTrack, getDaysUntilDeletable } from "./utils";

interface TrackActionButtonsProps {
  track: Track;
  onTakedown?: () => void;
  onRestore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TrackActionButtons({ 
  track, 
  onTakedown, 
  onRestore, 
  onEdit, 
  onDelete 
}: TrackActionButtonsProps) {
  const isDeletable = canDeleteTrack(track.takenDownAt);
  
  return (
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
            <DropdownMenuItem onClick={onEdit}>Edit Track</DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onTakedown} 
              className="text-amber-600"
            >
              Take Down Track
            </DropdownMenuItem>
          </>
        )}
        
        {track.takenDownAt && (
          <>
            <DropdownMenuItem onClick={onRestore}>
              Restore Track
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {isDeletable && (
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive"
              >
                Delete Permanently
              </DropdownMenuItem>
            )}
            
            {!isDeletable && (
              <DropdownMenuItem className="text-muted-foreground cursor-not-allowed">
                Delete (Available in {getDaysUntilDeletable(track.takenDownAt!)} days)
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
