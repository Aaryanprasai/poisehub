
import { cn } from "@/lib/utils";
import { Track } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

const statusVariants: Record<string, string> = {
  pending: 'status-badge status-pending',
  approved: 'status-badge status-approved',
  rejected: 'status-badge status-rejected',
};

interface TrackStatusProps {
  track: Track;
}

export function TrackStatus({ track }: TrackStatusProps) {
  return (
    <>
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
    </>
  );
}
