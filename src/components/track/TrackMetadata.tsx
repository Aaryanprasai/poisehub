
import { Calendar, Clock, Disc3 } from "lucide-react";
import { Track } from "@/lib/types";
import { formatDate, formatDuration } from "./utils";

interface TrackMetadataProps {
  track: Track;
}

export function TrackMetadata({ track }: TrackMetadataProps) {
  return (
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
  );
}
