
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UseFormReturn } from 'react-hook-form';
import { VerificationValues } from './VerificationForm';

interface AccountTypeSelectionProps {
  form: UseFormReturn<VerificationValues>;
}

export const AccountTypeSelection: React.FC<AccountTypeSelectionProps> = ({ form }) => {
  return (
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
  );
};
