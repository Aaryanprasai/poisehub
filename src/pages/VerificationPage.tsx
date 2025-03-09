
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const verificationSchema = z.object({
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

type VerificationValues = z.infer<typeof verificationSchema>;

const VerificationPage = () => {
  const { user, uploadVerificationDocuments } = useAuth();
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

  const getVerificationStatusContent = () => {
    if (!user) return null;
    
    switch (user.verificationStatus) {
      case 'pending':
        return (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <Clock className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Verification in progress</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your verification documents are being reviewed. This process usually takes 24-48 hours.
            </AlertDescription>
          </Alert>
        );
      case 'verified':
        return (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Verification completed</AlertTitle>
            <AlertDescription className="text-green-700">
              Your account has been verified. You now have full access to all features.
            </AlertDescription>
          </Alert>
        );
      case 'rejected':
        return (
          <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800">Verification rejected</AlertTitle>
            <AlertDescription className="text-red-700">
              Your verification was rejected. Please review our requirements and submit new documents.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

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

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Identity Verification</h1>
          <p className="text-muted-foreground">
            Verify your identity to unlock all features and ensure secure transactions
          </p>
        </div>
        
        {getVerificationStatusContent()}
        
        {(!user?.verificationStatus || user?.verificationStatus === 'rejected') && (
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
                  <FormField
                    control={form.control}
                    name="idType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Account Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="personal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Individual Artist
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="business" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Business or Label
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Select whether you're an individual artist or a business entity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {watchIdType === 'personal' && (
                    <FormField
                      control={form.control}
                      name="personalId"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Personal ID</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              {...field}
                              onChange={(e) => handleFileChange(e, 'personalId')}
                            />
                          </FormControl>
                          <FormDescription>
                            Upload a photo of your government-issued ID (passport, driver's license, etc.)
                          </FormDescription>
                          {personalIdFile && (
                            <p className="text-sm text-green-600">
                              File selected: {personalIdFile.name}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {watchIdType === 'business' && (
                    <>
                      <FormField
                        control={form.control}
                        name="businessDocument"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Business Document</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                {...field}
                                onChange={(e) => handleFileChange(e, 'businessDocument')}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload business registration, incorporation document, or license
                            </FormDescription>
                            {businessDocFile && (
                              <p className="text-sm text-green-600">
                                File selected: {businessDocFile.name}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="taxDocument"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Tax Document</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                {...field}
                                onChange={(e) => handleFileChange(e, 'taxDocument')}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload tax identification document (e.g., EIN verification letter)
                            </FormDescription>
                            {taxDocFile && (
                              <p className="text-sm text-green-600">
                                File selected: {taxDocFile.name}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="personalId"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Representative ID</FormLabel>
                            <FormControl>
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                {...field}
                                onChange={(e) => handleFileChange(e, 'personalId')}
                              />
                            </FormControl>
                            <FormDescription>
                              Upload ID of the person managing the business account
                            </FormDescription>
                            {personalIdFile && (
                              <p className="text-sm text-green-600">
                                File selected: {personalIdFile.name}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
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
        )}
      </div>
    </AppLayout>
  );
};

export default VerificationPage;
