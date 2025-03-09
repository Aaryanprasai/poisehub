
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui-extensions/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, X, Image as ImageIcon, Music as MusicIcon } from 'lucide-react';
import { Card } from '@/components/ui-extensions/Card';
import { distributionServices } from '@/lib/mock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist name is required'),
  genre: z.string().min(1, 'Genre is required'),
  releaseDate: z.string().min(1, 'Release date is required'),
  distributionServices: z.array(z.string()).min(1, 'Select at least one service'),
  description: z.string().optional(),
  upcCode: z.string().optional(),
  isrcCode: z.string().optional(),
  hasPublishingRights: z.boolean().default(false),
  publisher: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// List of music genres
const musicGenres = [
  { value: 'alternative', label: 'Alternative' },
  { value: 'blues', label: 'Blues' },
  { value: 'classical', label: 'Classical' },
  { value: 'country', label: 'Country' },
  { value: 'dance', label: 'Dance' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'folk', label: 'Folk' },
  { value: 'funk', label: 'Funk' },
  { value: 'hiphop', label: 'Hip-Hop/Rap' },
  { value: 'indie', label: 'Indie' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'kpop', label: 'K-Pop' },
  { value: 'latin', label: 'Latin' },
  { value: 'metal', label: 'Metal' },
  { value: 'pop', label: 'Pop' },
  { value: 'rnb', label: 'R&B/Soul' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'rock', label: 'Rock' },
  { value: 'soundtrack', label: 'Soundtrack' },
  { value: 'world', label: 'World' },
];

export function UploadForm({ open, onOpenChange }: UploadFormProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('details');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist: '',
      genre: '',
      releaseDate: new Date().toISOString().split('T')[0],
      distributionServices: [],
      description: '',
      upcCode: '',
      isrcCode: '',
      hasPublishingRights: false,
      publisher: '',
    },
  });

  const hasPublishingRights = form.watch('hasPublishingRights');

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is WAV or FLAC
      const fileType = file.type;
      if (fileType !== 'audio/wav' && fileType !== 'audio/flac' && fileType !== 'audio/x-flac') {
        toast.error('Please upload a WAV or FLAC file only');
        return;
      }
      
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArtworkFile(file);
      const url = URL.createObjectURL(file);
      setArtworkPreview(url);
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
  };

  const clearArtwork = () => {
    setArtworkFile(null);
    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
      setArtworkPreview(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!audioFile) {
      toast.error('Please upload an audio file');
      return;
    }

    if (!artworkFile) {
      toast.error('Please upload artwork');
      return;
    }

    setIsSubmitting(true);

    // Simulate upload delay
    setTimeout(() => {
      console.log('Form Values:', values);
      console.log('Audio File:', audioFile);
      console.log('Artwork File:', artworkFile);
      
      setIsSubmitting(false);
      toast.success('Track uploaded successfully!');
      onOpenChange(false);
      
      // Reset form
      form.reset();
      clearAudio();
      clearArtwork();
      setCurrentTab('details');
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload New Track</DialogTitle>
          <DialogDescription>
            Fill out the details below to upload your track for distribution.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="details">Track Details</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="rights">Rights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Track Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter track title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artist Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter artist name or featuring artists" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {musicGenres.map((genre) => (
                              <SelectItem key={genre.value} value={genre.value}>
                                {genre.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional information about your track"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setCurrentTab('files')}
                  >
                    Next: Upload Files
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="space-y-6">
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
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          <span className="mt-2 text-sm font-medium">Upload Artwork</span>
                          <span className="mt-1 text-xs text-muted-foreground">
                            3000x3000px recommended
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleArtworkChange}
                        />
                      </label>
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
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                          <MusicIcon className="h-10 w-10 text-muted-foreground" />
                          <span className="mt-2 text-sm font-medium">Upload Audio</span>
                          <span className="mt-1 text-xs text-muted-foreground">
                            WAV or FLAC format
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="audio/wav,audio/flac"
                          className="hidden"
                          onChange={handleAudioChange}
                        />
                      </label>
                    )}
                  </Card>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab('details')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentTab('distribution')}
                  >
                    Next: Distribution
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="distribution" className="space-y-6">
                <FormField
                  control={form.control}
                  name="distributionServices"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Distribution Services</FormLabel>
                        <FormDescription>
                          Select where you want to distribute your music
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {distributionServices.map((service) => (
                          <FormField
                            key={service.id}
                            control={form.control}
                            name="distributionServices"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={service.id}
                                  className={cn(
                                    "flex flex-col items-center space-x-0 space-y-2 rounded-md border p-3 hover:bg-accent transition-colors",
                                    field.value?.includes(service.id) && "border-primary bg-accent"
                                  )}
                                >
                                  <FormControl>
                                    <div className="flex flex-col items-center space-y-2">
                                      <Checkbox
                                        checked={field.value?.includes(service.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, service.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== service.id
                                                )
                                              )
                                        }}
                                        className="sr-only"
                                      />
                                      <div className="h-12 flex items-center justify-center">
                                        <img
                                          src={service.logo}
                                          alt={service.name}
                                          className="h-full max-w-[100px] object-contain"
                                        />
                                      </div>
                                      <div className="text-center">
                                        <FormLabel className="text-sm font-normal">
                                          {service.name}
                                        </FormLabel>
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab('files')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentTab('rights')}
                  >
                    Next: Rights
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="rights" className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="upcCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPC Code (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter UPC if you have one" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank if you don't have one. We'll assign one for you.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isrcCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISRC Code (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ISRC if you have one" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank if you don't have one. We'll assign one for you.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hasPublishingRights"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">
                          I own the publishing rights for this track
                        </FormLabel>
                        <FormDescription>
                          Check this box if you own all publishing rights to this track
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                {hasPublishingRights && (
                  <FormField
                    control={form.control}
                    name="publisher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publisher Information</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter publisher name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab('distribution')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    isLoading={isSubmitting}
                    leftIcon={<Upload className="h-4 w-4" />}
                  >
                    Upload Track
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {currentTab === 'rights' && (
                <Button 
                  type="submit" 
                  isLoading={isSubmitting}
                  leftIcon={<Upload className="h-4 w-4" />}
                >
                  Upload Track
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
