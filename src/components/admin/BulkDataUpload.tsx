
import { useState } from 'react';
import { Upload, Download, Check, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function BulkDataUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { isSuperAdmin } = useAuth();

  // Function to download template CSV files
  const downloadTemplate = (type: 'streams' | 'royalties') => {
    let csvContent: string;
    let fileName: string;

    if (type === 'streams') {
      // Define streams template CSV headers and sample data
      csvContent = 'track_id,service_name,stream_count,stream_date\n';
      csvContent += 'track_123,Spotify,1000,2023-10-01\n';
      csvContent += 'track_456,Apple Music,750,2023-10-01\n';
      fileName = 'streams_template.csv';
    } else {
      // Define royalties template CSV headers and sample data
      csvContent = 'artist_id,track_id,service_name,amount,period,payment_date,status\n';
      csvContent += 'artist_123,track_123,Spotify,235.50,October 2023,2023-10-15,pending\n';
      csvContent += 'artist_456,track_456,Apple Music,189.75,October 2023,2023-10-20,paid\n';
      fileName = 'royalties_template.csv';
    }

    // Create a download link and trigger the download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to parse CSV data
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',');
      const entry: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index]?.trim() || '';
      });
      
      return entry;
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'streams' | 'royalties') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);
    setErrorMessage(null);

    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        
        if (parsedData.length === 0) {
          throw new Error('No data found in the file or invalid format');
        }

        if (type === 'streams') {
          // Insert into streams table
          const { error } = await supabase.from('track_streams').insert(
            parsedData.map(row => ({
              track_id: row.track_id,
              service_name: row.service_name,
              stream_count: parseInt(row.stream_count, 10),
              stream_date: row.stream_date
            }))
          );
          
          if (error) throw error;
        } else {
          // Insert into royalties table
          const { error } = await supabase.from('royalty_payments').insert(
            parsedData.map(row => ({
              artist_id: row.artist_id,
              track_id: row.track_id,
              service_name: row.service_name,
              amount: parseFloat(row.amount),
              period: row.period,
              payment_date: row.payment_date,
              status: row.status
            }))
          );
          
          if (error) throw error;
        }

        setUploadSuccess(true);
        toast({
          title: "Upload Successful",
          description: `${parsedData.length} records have been uploaded.`,
          duration: 5000,
        });
      } catch (error) {
        console.error("Upload error:", error);
        setUploadSuccess(false);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
        toast({
          title: "Upload Failed",
          description: error instanceof Error ? error.message : 'Unknown error occurred',
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setUploading(false);
        // Clear the file input
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      setUploading(false);
      setUploadSuccess(false);
      setErrorMessage('Error reading file');
      toast({
        title: "Upload Failed",
        description: "Error reading file",
        variant: "destructive",
        duration: 5000,
      });
    };

    reader.readAsText(file);
  };

  // Check if user has super admin privileges
  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bulk Data Upload</CardTitle>
          <CardDescription>
            This feature is only available to super administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You need super administrator privileges to access the bulk upload functionality.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Data Upload</CardTitle>
        <CardDescription>
          Upload stream data and royalty information in bulk using CSV files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="streams" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="streams">Stream Data</TabsTrigger>
            <TabsTrigger value="royalties">Royalty Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="streams">
            <div className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate('streams')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Download the CSV template for stream data uploads. Fill in your data following the format in the template.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="streams-file">Upload Stream Data CSV</Label>
                <Input
                  id="streams-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'streams')}
                  disabled={uploading}
                />
              </div>
              
              {uploadSuccess === true && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Check className="h-5 w-5" />
                  <span>Upload successful!</span>
                </div>
              )}
              
              {uploadSuccess === false && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errorMessage || 'Upload failed. Please try again.'}</span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="royalties">
            <div className="space-y-4">
              <div>
                <Button
                  variant="outline"
                  onClick={() => downloadTemplate('royalties')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Download the CSV template for royalty data uploads. Fill in your data following the format in the template.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="royalties-file">Upload Royalty Data CSV</Label>
                <Input
                  id="royalties-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, 'royalties')}
                  disabled={uploading}
                />
              </div>
              
              {uploadSuccess === true && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <Check className="h-5 w-5" />
                  <span>Upload successful!</span>
                </div>
              )}
              
              {uploadSuccess === false && (
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <AlertCircle className="h-5 w-5" />
                  <span>{errorMessage || 'Upload failed. Please try again.'}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
