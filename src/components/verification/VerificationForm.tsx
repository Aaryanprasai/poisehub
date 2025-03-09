
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountTypeSelection } from './AccountTypeSelection';
import { PersonalIdUpload } from './PersonalIdUpload';
import { BusinessDocumentsUpload } from './BusinessDocumentsUpload';
import { toast } from 'sonner';

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

const fileSchema = z.instanceof(File)
  .refine(file => file.size <= MAX_FILE_SIZE, {
    message: `File size must be less than 5MB`,
  })
  .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: `File must be one of the following types: JPEG, PNG, or PDF`,
  });

export const verificationSchema = z.object({
  idType: z.enum(['personal', 'business'], {
    required_error: 'You need to select an ID type',
  }),
  personalId: fileSchema.optional(),
  businessDocument: fileSchema.optional(),
  taxDocument: fileSchema.optional(),
})
.refine(data => {
  if (data.idType === 'personal') {
    return !!data.personalId;
  }
  return true;
}, {
  message: 'Personal ID is required',
  path: ['personalId'],
})
.refine(data => {
  if (data.idType === 'business') {
    return !!data.businessDocument;
  }
  return true;
}, {
  message: 'Business document is required',
  path: ['businessDocument'],
})
.refine(data => {
  if (data.idType === 'business') {
    return !!data.taxDocument;
  }
  return true;
}, {
  message: 'Tax document is required',
  path: ['taxDocument'],
});

export type VerificationValues = z.infer<typeof verificationSchema>;

interface VerificationFormProps {
  user: {
    idType?: 'personal' | 'business' | null;
    verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  } | null;
  uploadVerificationDocuments: (
    idType: 'personal' | 'business',
    idDocument: string, 
    businessDocument: string, 
    taxDocument: string
  ) => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ 
  user, 
  uploadVerificationDocuments 
}) => {
  const [personalIdFile, setPersonalIdFile] = useState<File | null>(null);
  const [businessDocFile, setBusinessDocFile] = useState<File | null>(null);
  const [taxDocFile, setTaxDocFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      idType: user?.idType || 'personal',
    },
  });
  
  const watchIdType = form.watch('idType');

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File ${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }
    
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError(`File ${file.name} has an invalid format. Accepted formats are JPEG, PNG, and PDF.`);
      return false;
    }
    
    setFileError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!validateFile(file)) {
        e.target.value = '';
        return;
      }
      
      if (fieldName === 'personalId') {
        setPersonalIdFile(file);
        form.setValue('personalId', file);
      } else if (fieldName === 'businessDocument') {
        setBusinessDocFile(file);
        form.setValue('businessDocument', file);
      } else if (fieldName === 'taxDocument') {
        setTaxDocFile(file);
        form.setValue('taxDocument', file);
      }
    }
  };

  const onSubmit = (data: VerificationValues) => {
    try {
      // Additional validation before submission
      if (data.idType === 'personal' && !data.personalId) {
        toast.error('Personal ID is required');
        return;
      }
      
      if (data.idType === 'business') {
        if (!data.businessDocument) {
          toast.error('Business document is required');
          return;
        }
        
        if (!data.taxDocument) {
          toast.error('Tax document is required');
          return;
        }
        
        if (!data.personalId) {
          toast.error('Representative ID is required');
          return;
        }
      }
      
      const idDocument = data.personalId ? URL.createObjectURL(data.personalId) : '';
      const businessDocument = data.businessDocument ? URL.createObjectURL(data.businessDocument) : '';
      const taxDocument = data.taxDocument ? URL.createObjectURL(data.taxDocument) : '';
      
      uploadVerificationDocuments(
        data.idType,
        idDocument,
        businessDocument,
        taxDocument
      );
      
      toast.success('Documents submitted successfully');
      form.reset();
      setPersonalIdFile(null);
      setBusinessDocFile(null);
      setTaxDocFile(null);
    } catch (error) {
      toast.error('Error uploading verification documents');
      console.error('Upload error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Verification Documents</CardTitle>
        <CardDescription>
          Please provide the required documents to verify your identity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AccountTypeSelection form={form} />
            
            {fileError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            
            {watchIdType === 'personal' && (
              <PersonalIdUpload 
                form={form} 
                personalIdFile={personalIdFile} 
                handleFileChange={handleFileChange} 
              />
            )}
            
            {watchIdType === 'business' && (
              <BusinessDocumentsUpload 
                form={form} 
                businessDocFile={businessDocFile}
                taxDocFile={taxDocFile}
                personalIdFile={personalIdFile}
                handleFileChange={handleFileChange} 
              />
            )}
            
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-blue-800">Important</AlertTitle>
              <AlertDescription className="text-blue-700">
                Your documents are securely stored and only used for verification purposes.
                They will not be shared with third parties.
              </AlertDescription>
            </Alert>
            
            <Button 
              type="submit" 
              disabled={user?.verificationStatus === 'pending' || !!fileError}
            >
              Submit for Verification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
