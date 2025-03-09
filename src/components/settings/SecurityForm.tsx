
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Two Factor Authentication schema
const twoFactorSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
});

// Phone number schema for account recovery
const phoneNumberSchema = z.object({
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }),
});

type TwoFactorValues = z.infer<typeof twoFactorSchema>;
type PhoneNumberValues = z.infer<typeof phoneNumberSchema>;

export function SecurityForm() {
  const { user, toggleTwoFactor, updatePhoneNumber } = useAuth();
  const [showQrCode, setShowQrCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  // Mock QR code data - in a real app, this would be generated from the backend
  const qrCodeData = "https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/MusicApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=MusicApp";

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
    if (data.twoFactorAuth && !showQrCode) {
      // When enabling 2FA, first show the QR code
      setShowQrCode(true);
    } else if (!data.twoFactorAuth) {
      // When disabling 2FA
      if (toggleTwoFactor) {
        toggleTwoFactor(false);
      }
      setShowQrCode(false);
    } else if (showQrCode && verificationCode) {
      // When verifying the QR code setup
      // In a real app, you would validate the verification code here
      if (verificationCode.length === 6) {
        if (toggleTwoFactor) {
          toggleTwoFactor(true);
        }
        setShowQrCode(false);
      }
    }
  };

  const onPhoneNumberSubmit = (data: PhoneNumberValues) => {
    if (updatePhoneNumber) {
      updatePhoneNumber(data.phoneNumber);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Phone Number Section */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Number</CardTitle>
          <CardDescription>
            Add your phone number for account recovery
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
            Add an extra layer of security to your account using Google Authenticator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...twoFactorForm}>
            <form onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)} className="space-y-6">
              <FormField
                control={twoFactorForm.control}
                name="twoFactorAuth"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Google Authenticator</FormLabel>
                      <FormDescription>
                        Use Google Authenticator app to generate verification codes when you sign in.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {showQrCode && (
                <div className="space-y-4">
                  <Alert>
                    <QrCode className="h-4 w-4" />
                    <AlertTitle>Set up Google Authenticator</AlertTitle>
                    <AlertDescription>
                      Scan this QR code with the Google Authenticator app to set up two-factor authentication.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <div className="mb-4">
                      <img src={qrCodeData} alt="QR Code for Google Authenticator" className="w-48 h-48" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Or enter this code manually: <span className="font-mono bg-muted p-1 rounded">JBSWY3DPEHPK3PXP</span>
                    </p>
                    
                    <div className="w-full max-w-xs space-y-4">
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter 6-digit code" 
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the code from Google Authenticator to verify setup
                        </FormDescription>
                      </FormItem>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowQrCode(false)}>Cancel</Button>
                        <Button type="submit">Verify & Enable</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!showQrCode && (
                <Button type="submit">
                  {twoFactorForm.getValues().twoFactorAuth ? "Disable" : "Enable"} Two-Factor Authentication
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
