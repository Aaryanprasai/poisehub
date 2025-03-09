
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { AccountTypeSelection } from './AccountTypeSelection';
import { PersonalIdUpload } from './PersonalIdUpload';
import { BusinessDocumentsUpload } from './BusinessDocumentsUpload';
import { toast } from 'sonner';

export const verificationSchema = z.object({
  idType: z.enum(['personal', 'business'], {
    required_error: 'You need to select an ID type',
  }),
  personalId: z.instanceof(File).optional(),
  businessDocument: z.instanceof(File).optional(),
  taxDocument: z.instanceof(File).optional(),
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
  
  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      idType: user?.idType || 'personal',
    },
  });
  
  const watchIdType = form.watch('idType');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
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
      const idDocument = data.personalId ? URL.createObjectURL(data.personalId) : '';
      const businessDocument = data.businessDocument ? URL.createObjectURL(data.businessDocument) : '';
      const taxDocument = data.taxDocument ? URL.createObjectURL(data.taxDocument) : '';
      
      uploadVerificationDocuments(
        data.idType,
        idDocument,
        businessDocument,
        taxDocument
      );
      
      form.reset();
      setPersonalIdFile(null);
      setBusinessDocFile(null);
      setTaxDocFile(null);
    } catch (error) {
      toast.error('Error uploading verification documents');
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
              disabled={user?.verificationStatus === 'pending'}
            >
              Submit for Verification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
