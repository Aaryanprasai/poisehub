
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface RightsFormProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  onBack: () => void;
}

export function RightsForm({ form, isSubmitting, onBack }: RightsFormProps) {
  const hasPublishingRights = form.watch('hasPublishingRights');

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="upcCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UPC Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter UPC if you have one" {...field} />
              </FormControl>
              <FormDescription>
                Leave blank if you don't have one. We'll assign one for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isrcCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISRC Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter ISRC if you have one" {...field} />
              </FormControl>
              <FormDescription>
                Leave blank if you don't have one. We'll assign one for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="hasPublishingRights"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">
                I own the publishing rights for this track
              </FormLabel>
              <FormDescription>
                Check this box if you own all publishing rights to this track
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {hasPublishingRights && (
        <div className="space-y-4 border rounded-md p-4">
          <h3 className="font-medium">Publishing Information</h3>
          
          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter publisher name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="publisherInfo.pro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PRO (Performance Rights Organization)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ASCAP, BMI, SESAC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="publisherInfo.ipi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IPI/CAE Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IPI or CAE number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="publisherInfo.publishingShare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publishing Share (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="publisherInfo.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about publishing" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          leftIcon={<Upload className="h-4 w-4" />}
        >
          Upload Track
        </Button>
      </div>
    </>
  );
}
