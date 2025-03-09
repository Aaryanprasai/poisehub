
import React, { useState } from 'react';
import { Button } from '@/components/ui-extensions/Button';
import { FileSpreadsheet, FileX } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  reportType: string;
}

export function FileUploader({ selectedFile, onFileChange, reportType }: FileUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if file is CSV or XLSX
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt !== 'csv' && fileExt !== 'xlsx') {
        toast.error('Invalid file format. Please upload a CSV or XLSX file.');
        return;
      }
      
      onFileChange(file);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-4">
        <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-medium">Upload {reportType} file</h3>
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
            onClick={() => onFileChange(null)}
          >
            <FileX className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
