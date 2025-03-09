
import { Button } from '@/components/ui-extensions/Button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SaveIcon } from 'lucide-react';

const paypalSchema = z.object({
  paypalEmail: z.string().email('Valid PayPal email is required'),
});

export type PaypalFormValues = z.infer<typeof paypalSchema>;

interface PaypalFormProps {
  onSubmit: (values: PaypalFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function PaypalForm({ onSubmit, isSubmitting }: PaypalFormProps) {
  const form = useForm<PaypalFormValues>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      paypalEmail: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="paypalEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PayPal Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your PayPal email address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          leftIcon={<SaveIcon className="h-4 w-4" />}
        >
          Save PayPal Details
        </Button>
      </form>
    </Form>
  );
}
