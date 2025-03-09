
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui-extensions/Button";
import { Track } from "@/lib/types";

interface TrackImageProps {
  track: Track;
}

export function TrackImage({ track }: TrackImageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
  };

  return (
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
    </div>
  );
}
