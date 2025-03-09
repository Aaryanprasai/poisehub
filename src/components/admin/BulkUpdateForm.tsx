
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { FileSpreadsheet, Upload, AlertCircle, FileX, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ReportType = 'royalties' | 'sales' | 'streams';

export function BulkUpdateForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('royalties');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if file is CSV or XLSX
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt !== 'csv' && fileExt !== 'xlsx') {
        toast.error('Invalid file format. Please upload a CSV or XLSX file.');
        return;
      }
      
      setSelectedFile(file);
      setUploadSuccess(false);
    }
  };

  const handleReportTypeChange = (type: ReportType) => {
    setSelectedReportType(type);
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

  const reportTypeOptions: {id: ReportType, label: string}[] = [
    { id: 'royalties', label: 'Royalty Reports' },
    { id: 'sales', label: 'Sales Reports' },
    { id: 'streams', label: 'Streaming Data' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Update Reports</CardTitle>
        <CardDescription>
          Upload CSV or XLSX files to update royalties, sales, or streaming data in bulk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {reportTypeOptions.map((option) => (
            <Button
              key={option.id}
              variant={selectedReportType === option.id ? "default" : "outline"}
              className="justify-start h-auto py-4"
              onClick={() => handleReportTypeChange(option.id)}
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              {option.label}
            </Button>
          ))}
        </div>

        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center space-y-4">
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="font-medium">Upload {selectedReportType} file</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your .CSV or .XLSX file, or click to browse
              </p>
            </div>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>
          {selectedFile && (
            <div className="mt-4 p-3 bg-muted rounded-md w-full flex justify-between items-center">
              <div className="flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <FileX className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {selectedFile && (
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
                ? `The ${selectedReportType} data has been updated.`
                : `Click the upload button to update ${selectedReportType} data.`}
            </AlertDescription>
          </Alert>
        )}

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
