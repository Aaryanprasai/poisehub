
import { UploadFormLayout } from './upload/UploadFormLayout';
import { TrackDetailsForm } from './upload/TrackDetailsForm';
import { FileUploadForm } from './upload/FileUploadForm';
import { DistributionForm } from './upload/DistributionForm';
import { RightsForm } from './upload/RightsForm';
import { useUploadForm } from '@/hooks/useUploadForm';

interface UploadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadForm({ open, onOpenChange }: UploadFormProps) {
  const {
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
  } = useUploadForm(() => onOpenChange(false));

  return (
    <UploadFormLayout
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      isSubmitting={isSubmitting}
      currentTab={currentTab}
      onSubmit={onSubmit}
      onNavigate={navigateTo}
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
  );
}
