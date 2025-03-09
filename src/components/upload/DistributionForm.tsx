
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui-extensions/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';
import { distributionServices } from '@/lib/mock-data';

interface DistributionFormProps {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onNext: () => void;
}

export function DistributionForm({ form, onBack, onNext }: DistributionFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="distributionServices"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Distribution Services</FormLabel>
              <FormDescription>
                Select where you want to distribute your music
              </FormDescription>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {distributionServices.map((service) => (
                <FormField
                  key={service.id}
                  control={form.control}
                  name="distributionServices"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={service.id}
                        className={cn(
                          "flex flex-col items-center space-x-0 space-y-2 rounded-md border p-3 hover:bg-accent transition-colors",
                          field.value?.includes(service.id) && "border-primary bg-accent"
                        )}
                      >
                        <FormControl>
                          <div className="flex flex-col items-center space-y-2">
                            <Checkbox
                              checked={field.value?.includes(service.id)}
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
                            <div className="h-12 flex items-center justify-center">
                              <img
                                src={service.logo}
                                alt={service.name}
                                className="h-full max-w-[100px] object-contain"
                              />
                            </div>
                            <div className="text-center">
                              <FormLabel className="text-sm font-normal">
                                {service.name}
                              </FormLabel>
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
