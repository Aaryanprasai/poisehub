
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Two Factor Authentication schema
const twoFactorSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
});

// Phone number schema
const phoneNumberSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
});

type TwoFactorValues = z.infer<typeof twoFactorSchema>;
type PhoneNumberValues = z.infer<typeof phoneNumberSchema>;

export function SecurityForm() {
  const { user, toggleTwoFactor, updatePhoneNumber } = useAuth();

  // Two Factor Authentication form
  const twoFactorForm = useForm<TwoFactorValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      twoFactorAuth: user?.twoFactorEnabled || false,
    },
  });

  // Phone number form
  const phoneNumberForm = useForm<PhoneNumberValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const onTwoFactorSubmit = (data: TwoFactorValues) => {
    toggleTwoFactor(data.twoFactorAuth);
  };

  const onPhoneNumberSubmit = (data: PhoneNumberValues) => {
    updatePhoneNumber(data.phoneNumber);
  };

  return (
    <div className="grid gap-6">
      {/* Phone Number Section */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Number</CardTitle>
          <CardDescription>
            Add your phone number for account recovery and two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...phoneNumberForm}>
            <form onSubmit={phoneNumberForm.handleSubmit(onPhoneNumberSubmit)} className="space-y-6">
              <FormField
                control={phoneNumberForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+1 (555) 000-0000" />
                    </FormControl>
                    <FormDescription>
                      Your phone number will be used for security purposes only.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Number</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Two-Factor Authentication Section */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user?.phoneNumber && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Phone Number Required</AlertTitle>
              <AlertDescription>
                You need to add a phone number before enabling two-factor authentication.
              </AlertDescription>
            </Alert>
          )}
          <Form {...twoFactorForm}>
            <form onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)} className="space-y-6">
              <FormField
                control={twoFactorForm.control}
                name="twoFactorAuth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Two-factor Authentication</FormLabel>
                      <FormDescription>
                        Receive a code on your phone each time you sign in.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!user?.phoneNumber}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!user?.phoneNumber}>Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
