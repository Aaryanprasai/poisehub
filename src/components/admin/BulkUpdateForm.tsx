
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ReportTypeSelector, ReportType } from './ReportTypeSelector';
import { FileUploader } from './FileUploader';
import { UploadStatusAlert } from './UploadStatusAlert';

export function BulkUpdateForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('royalties');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleReportTypeChange = (type: ReportType) => {
    setSelectedReportType(type);
    setUploadSuccess(false);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, we would actually upload and process the file here
      // For demo purposes, we're simulating a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Uploading ${selectedReportType} report: ${selectedFile.name}`);
      
      setUploadSuccess(true);
      toast.success(`${selectedReportType.charAt(0).toUpperCase() + selectedReportType.slice(1)} report updated successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload the file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Update Reports</CardTitle>
        <CardDescription>
          Upload CSV or XLSX files to update royalties, sales, or streaming data in bulk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReportTypeSelector 
          selectedReportType={selectedReportType} 
          onChange={handleReportTypeChange} 
        />

        <FileUploader
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          reportType={selectedReportType}
        />

        <UploadStatusAlert
          uploadSuccess={uploadSuccess}
          selectedFile={selectedFile}
          reportType={selectedReportType}
        />

        <Button
          className="w-full"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || uploadSuccess}
          isLoading={isUploading}
          leftIcon={<Upload className="h-4 w-4" />}
        >
          {isUploading ? "Processing..." : "Upload and Process"}
        </Button>
      </CardContent>
    </Card>
  );
}
