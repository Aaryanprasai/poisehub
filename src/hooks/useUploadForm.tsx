
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { formSchema, FormValues } from '@/components/upload/types';
import { useAdminContext } from '@/contexts/AdminContext';

export function useUploadForm(onClose: () => void) {
  const { generateISRC, generateUPC, codeGenerationSettings } = useAdminContext();
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
      publisherInfo: {
        pro: '',
        ipi: '',
        publishingShare: '',
        notes: ''
      }
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

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
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

    // Auto-generate ISRC if not provided and auto-generation is enabled
    if (!values.isrcCode && codeGenerationSettings.isrc.autoGenerate) {
      const generatedISRC = generateISRC();
      form.setValue('isrcCode', generatedISRC);
      values.isrcCode = generatedISRC;
    }

    // Auto-generate UPC if not provided and auto-generation is enabled
    if (!values.upcCode && codeGenerationSettings.upc.autoGenerate) {
      const generatedUPC = generateUPC();
      form.setValue('upcCode', generatedUPC);
      values.upcCode = generatedUPC;
    }

    // Simulate upload delay
    setTimeout(() => {
      console.log('Form Values:', values);
      console.log('Audio File:', audioFile);
      console.log('Artwork File:', artworkFile);
      
      setIsSubmitting(false);
      toast.success('Track uploaded successfully!');
      onClose();
      
      // Reset form
      form.reset();
      clearAudio();
      clearArtwork();
      setCurrentTab('details');
    }, 2000);
  };

  return {
    form,
    audioFile,
    audioPreview,
    artworkFile,
    artworkPreview,
    isSubmitting,
    currentTab,
    handleAudioChange,
    handleArtworkChange,
    clearAudio,
    clearArtwork,
    navigateTo,
    onSubmit
  };
}
