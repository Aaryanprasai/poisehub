import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui-extensions/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';
import { distributionPlatforms } from '@/lib/mock-data';

interface DistributionFormProps {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onNext: () => void;
}

export function DistributionForm({ form, onBack, onNext }: DistributionFormProps) {
  const selectedServices = form.watch('distributionServices');

  const toggleAllServices = () => {
    if (selectedServices.length === distributionPlatforms.length) {
      // If all are selected, deselect all
      form.setValue('distributionServices', []);
    } else {
      // Otherwise, select all
      form.setValue('distributionServices', distributionPlatforms.map(service => service.id));
    }
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="distributionServices"
        render={() => (
          <FormItem>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <FormLabel>Distribution Services</FormLabel>
                <FormDescription>
                  Select where you want to distribute your music
                </FormDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={toggleAllServices}
              >
                {selectedServices.length === distributionPlatforms.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {distributionPlatforms.map((service) => (
                <FormField
                  key={service.id}
                  control={form.control}
                  name="distributionServices"
                  render={({ field }) => {
                    const isSelected = field.value?.includes(service.id);
                    return (
                      <FormItem
                        key={service.id}
                        className={cn(
                          "flex flex-col items-center space-x-0 space-y-2 rounded-md border p-3 hover:bg-accent transition-colors cursor-pointer relative",
                          isSelected && "border-primary bg-accent"
                        )}
                        onClick={() => {
                          return isSelected
                            ? field.onChange(field.value?.filter(value => value !== service.id))
                            : field.onChange([...field.value, service.id]);
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <FormControl>
                          <div className="flex flex-col items-center space-y-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, service.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== service.id
                                      )
                                    )
                              }}
                              className="sr-only"
                            />
                            <div className="h-16 flex items-center justify-center">
                              <img
                                src={service.logo}
                                alt={service.name}
                                className="h-full max-w-[100px] object-contain"
                                title={service.name}
                              />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNext}
        >
          Next: Rights
        </Button>
      </div>
    </>
  );
}
