
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankAccountForm, BankAccountFormValues } from './BankAccountForm';
import { PaypalForm, PaypalFormValues } from './PaypalForm';

interface PaymentMethodsProps {
  isSubmitting: boolean;
  onSubmitBankInfo: (values: BankAccountFormValues) => Promise<void>;
  onSubmitPaypal: (values: PaypalFormValues) => Promise<void>;
}

export function PaymentMethods({ 
  isSubmitting, 
  onSubmitBankInfo, 
  onSubmitPaypal 
}: PaymentMethodsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Add or update your payment information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank">
            <BankAccountForm 
              onSubmit={onSubmitBankInfo}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
          
          <TabsContent value="paypal">
            <PaypalForm 
              onSubmit={onSubmitPaypal}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
