
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { UploadForm } from '@/components/UploadForm';

const Upload = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Automatically open the upload form when the page loads
  useEffect(() => {
    setUploadDialogOpen(true);
  }, []);

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Upload Music</h1>
            <p className="text-muted-foreground">Add your new tracks for distribution</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/20 rounded-lg border border-dashed p-8">
          <h2 className="text-xl font-medium mb-2">Ready to upload a new track?</h2>
          <p className="text-muted-foreground text-center mb-4">
            Start the upload process to distribute your music worldwide
          </p>
          <button 
            onClick={() => setUploadDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Open Upload Form
          </button>
        </div>
      </div>

      <UploadForm open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </AppLayout>
  );
};

export default Upload;
