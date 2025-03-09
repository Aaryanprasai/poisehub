
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { VerificationValues } from './VerificationForm';

interface PersonalIdUploadProps {
  form: UseFormReturn<VerificationValues>;
  personalIdFile: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

export const PersonalIdUpload: React.FC<PersonalIdUploadProps> = ({ 
  form, 
  personalIdFile, 
  handleFileChange 
}) => {
  return (
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
  );
};
