
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui-extensions/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FormTabs } from './upload/FormTabs';
import { TrackDetailsForm } from './upload/TrackDetailsForm';
import { FileUploadForm } from './upload/FileUploadForm';
import { DistributionForm } from './upload/DistributionForm';
import { RightsForm } from './upload/RightsForm';
import { formSchema, FormValues } from './upload/types';

interface UploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

  const handleAudioChange = (file: File) => {
    // Check if file is WAV or FLAC
    const fileType = file.type;
    if (fileType !== 'audio/wav' && fileType !== 'audio/flac' && fileType !== 'audio/x-flac') {
      toast.error('Please upload a WAV or FLAC file only');
      return;
    }
    
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioPreview(url);
  };

  const handleArtworkChange = (file: File) => {
    setArtworkFile(file);
    const url = URL.createObjectURL(file);
    setArtworkPreview(url);
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

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
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
            <FormTabs
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              detailsContent={
                <TrackDetailsForm 
                  form={form} 
                  onNext={() => navigateTo('files')} 
                />
              }
              filesContent={
                <FileUploadForm 
                  audioFile={audioFile}
                  audioPreview={audioPreview}
                  artworkFile={artworkFile}
                  artworkPreview={artworkPreview}
                  onAudioChange={handleAudioChange}
                  onArtworkChange={handleArtworkChange}
                  clearAudio={clearAudio}
                  clearArtwork={clearArtwork}
                  onBack={() => navigateTo('details')}
                  onNext={() => navigateTo('distribution')}
                />
              }
              distributionContent={
                <DistributionForm 
                  form={form} 
                  onBack={() => navigateTo('files')}
                  onNext={() => navigateTo('rights')}
                />
              }
              rightsContent={
                <RightsForm 
                  form={form} 
                  isSubmitting={isSubmitting}
                  onBack={() => navigateTo('distribution')}
                />
              }
            />

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
