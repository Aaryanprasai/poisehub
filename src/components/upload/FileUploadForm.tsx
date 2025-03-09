
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui-extensions/Button';
import { Card } from '@/components/ui-extensions/Card';
import { ImageIcon, MusicIcon, X } from 'lucide-react';
import { useRef } from 'react';

interface FileUploadFormProps {
  audioFile: File | null;
  audioPreview: string | null;
  artworkFile: File | null;
  artworkPreview: string | null;
  onAudioChange: (file: File) => void;
  onArtworkChange: (file: File) => void;
  clearAudio: () => void;
  clearArtwork: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function FileUploadForm({
  audioFile,
  audioPreview,
  artworkFile,
  artworkPreview,
  onAudioChange,
  onArtworkChange,
  clearAudio,
  clearArtwork,
  onBack,
  onNext
}: FileUploadFormProps) {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);

  const handleAudioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is WAV or FLAC
      const fileType = file.type;
      if (fileType !== 'audio/wav' && fileType !== 'audio/flac' && fileType !== 'audio/x-flac') {
        // This will be handled by the parent component
        return;
      }
      onAudioChange(file);
    }
  };

  const handleArtworkInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onArtworkChange(file);
    }
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="h-[220px] bg-muted/40 overflow-hidden">
          {artworkPreview ? (
            <div className="relative h-full">
              <img
                src={artworkPreview}
                alt="Artwork preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={clearArtwork}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button 
              type="button"
              className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
              onClick={() => artworkInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <span className="mt-2 text-sm font-medium">Upload Artwork</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  3000x3000px recommended
                </span>
              </div>
              <input
                ref={artworkInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleArtworkInputChange}
              />
            </button>
          )}
        </Card>

        <Card className="h-[220px] bg-muted/40">
          {audioFile ? (
            <div className="flex flex-col items-center justify-center h-full p-4 relative">
              <MusicIcon className="h-10 w-10 text-primary mb-2" />
              <p className="text-sm font-medium truncate max-w-full">{audioFile.name}</p>
              <p className="text-xs text-muted-foreground mb-4">
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              
              {audioPreview && (
                <audio controls className="w-full max-w-[200px]">
                  <source src={audioPreview} />
                  Your browser does not support the audio element.
                </audio>
              )}
              
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={clearAudio}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
              onClick={() => audioInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center">
                <MusicIcon className="h-10 w-10 text-muted-foreground" />
                <span className="mt-2 text-sm font-medium">Upload Audio</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  WAV or FLAC format
                </span>
              </div>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/wav,audio/flac"
                className="hidden"
                onChange={handleAudioInputChange}
              />
            </button>
          )}
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
        >
          Next: Distribution
        </Button>
      </div>
    </>
  );
}
