
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertCircle } from 'lucide-react';

interface UploadStatusAlertProps {
  uploadSuccess: boolean;
  selectedFile: File | null;
  reportType: string;
}

export function UploadStatusAlert({ uploadSuccess, selectedFile, reportType }: UploadStatusAlertProps) {
  if (!selectedFile) return null;

  return (
    <Alert className={uploadSuccess ? "bg-green-50 border-green-200" : ""}>
      <div className="flex items-center gap-2">
        {uploadSuccess ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
        <AlertTitle>
          {uploadSuccess
            ? "File processed successfully"
            : "Ready to upload"}
        </AlertTitle>
      </div>
      <AlertDescription>
        {uploadSuccess
          ? `The ${reportType} data has been updated.`
          : `Click the upload button to update ${reportType} data.`}
      </AlertDescription>
    </Alert>
  );
}
