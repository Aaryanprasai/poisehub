
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VerificationValues } from './VerificationForm';

interface BusinessDocumentsUploadProps {
  form: UseFormReturn<VerificationValues>;
  businessDocFile: File | null;
  taxDocFile: File | null;
  personalIdFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

export const BusinessDocumentsUpload: React.FC<BusinessDocumentsUploadProps> = ({ 
  form, 
  businessDocFile, 
  taxDocFile, 
  personalIdFile, 
  handleFileChange 
}) => {
  return (
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
  );
};
