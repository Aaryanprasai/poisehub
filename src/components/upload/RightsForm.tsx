
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Upload, AlertCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';
import { validateIsrc, formatIsrcWithHyphens } from '@/utils/isrcUtils';
import { useState, useEffect } from 'react';

interface RightsFormProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  onBack: () => void;
}

export function RightsForm({ form, isSubmitting, onBack }: RightsFormProps) {
  const hasPublishingRights = form.watch('hasPublishingRights');
  const isrcCode = form.watch('isrcCode');
  const [isrcError, setIsrcError] = useState<string | null>(null);
  const [isrcDisplay, setIsrcDisplay] = useState<string | null>(null);

  // Validate ISRC if provided and show formatted display version
  useEffect(() => {
    if (isrcCode && isrcCode.trim() !== '') {
      if (!validateIsrc(isrcCode)) {
        setIsrcError('Invalid ISRC format. Example format: USABC2300001 or US-ABC-23-00001');
        setIsrcDisplay(null);
      } else {
        setIsrcError(null);
        // For display purposes only, show the formatted version with hyphens
        setIsrcDisplay(formatIsrcWithHyphens(isrcCode));
      }
    } else {
      setIsrcError(null);
      setIsrcDisplay(null);
    }
  }, [isrcCode]);

  // Handle ISRC input change to remove hyphens on blur
  const handleIsrcBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && value.trim() !== '') {
      // Normalize by removing hyphens
      const normalized = value.replace(/-/g, '').toUpperCase();
      form.setValue('isrcCode', normalized);
    }
  };

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
                <Input 
                  placeholder="Enter ISRC if you have one" 
                  {...field}
                  onBlur={(e) => {
                    handleIsrcBlur(e);
                    field.onBlur();
                  }}
                  className={isrcError ? "border-red-500" : ""}
                />
              </FormControl>
              {isrcError ? (
                <p className="text-sm font-medium text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {isrcError}
                </p>
              ) : isrcDisplay ? (
                <FormDescription>
                  Format reference: {isrcDisplay}
                </FormDescription>
              ) : (
                <FormDescription>
                  Leave blank if you don't have one. We'll assign one for you.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {!isrcCode && (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md mb-6">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-700 font-medium">
                Automatic ISRC Assignment
              </p>
              <p className="text-xs text-blue-600 mt-1">
                If you leave the ISRC field empty, we'll automatically assign a unique ISRC code to your track using our standardized format.
              </p>
            </div>
          </div>
        </div>
      )}
      
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
          disabled={!!isrcError && isrcCode !== ''}
        >
          Upload Track
        </Button>
      </div>
    </>
  );
}
