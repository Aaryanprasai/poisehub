
import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui-extensions/Button';
import { Upload } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { FormTabs } from './FormTabs';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface UploadFormLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  currentTab: string;
  onSubmit: (values: FormValues) => void;
  onNavigate: (tab: string) => void;
  detailsContent: ReactNode;
  filesContent: ReactNode;
  distributionContent: ReactNode;
  rightsContent: ReactNode;
}

export function UploadFormLayout({
  open,
  onOpenChange,
  form,
  isSubmitting,
  currentTab,
  onSubmit,
  onNavigate,
  detailsContent,
  filesContent,
  distributionContent,
  rightsContent
}: UploadFormLayoutProps) {
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
              setCurrentTab={onNavigate}
              detailsContent={detailsContent}
              filesContent={filesContent}
              distributionContent={distributionContent}
              rightsContent={rightsContent}
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
