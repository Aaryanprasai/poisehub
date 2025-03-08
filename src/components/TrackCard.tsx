
import { useState } from 'react';
import { Track } from '@/lib/types';
import { Card, CardContent } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { Play, Pause, MoreHorizontal, Calendar, Clock, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface TrackCardProps {
  track: Track;
  onEdit?: (track: Track) => void;
  onDelete?: (track: Track) => void;
}

export function TrackCard({ track, onEdit, onDelete }: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control audio playback
  };

  const statusVariants: Record<string, string> = {
    pending: 'status-badge status-pending',
    approved: 'status-badge status-approved',
    rejected: 'status-badge status-rejected',
  };

  return (
    <Card hoverEffect className="overflow-hidden">
      <div className="group relative aspect-square">
        <img
          src={track.artwork}
          alt={`${track.title} artwork`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
              <DropdownMenuItem onClick={() => onEdit?.(track)}>Edit Track</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(track)} className="text-destructive">
                Delete Track
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
              {track.releaseDate
                ? `Released: ${formatDate(track.releaseDate)}`
                : `Submitted: ${formatDate(track.submittedAt)}`}
            </span>
          </div>
        </div>
        
        {track.distributionServices.length > 0 && (
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
  );
}
