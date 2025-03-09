
import { useState } from 'react';
import { toast } from 'sonner';
import { royaltyData } from '@/lib/mock-data';
import AppLayout from '@/components/AppLayout';
import { PaymentStatsCards } from '@/components/payments/PaymentStatsCards';
import { EarningsChart } from '@/components/payments/EarningsChart';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { PaymentMethods } from '@/components/payments/PaymentMethods';
import { BankAccountFormValues } from '@/components/payments/BankAccountForm';
import { PaypalFormValues } from '@/components/payments/PaypalForm';

const Payments = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock payment history
  const paymentHistory = [
    { id: '1', date: '2023-12-15', amount: 245.88, status: 'Paid' },
    { id: '2', date: '2023-11-15', amount: 178.52, status: 'Paid' },
    { id: '3', date: '2023-10-15', amount: 203.74, status: 'Paid' },
    { id: '4', date: '2023-09-15', amount: 156.30, status: 'Paid' },
  ];

  // Calculate total earnings
  const totalEarnings = royaltyData.reduce((sum, item) => sum + item.amount, 0);

  const onSubmitBankInfo = async (values: BankAccountFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Bank account info:', values);
      setIsSubmitting(false);
      toast.success('Bank account information saved successfully!');
    }, 1500);
  };

  const onSubmitPaypal = async (values: PaypalFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('PayPal info:', values);
      setIsSubmitting(false);
      toast.success('PayPal information saved successfully!');
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Royalty Payments</h1>
          <p className="text-muted-foreground">Manage your payment methods and view earnings</p>
        </div>
        
        <PaymentStatsCards totalEarnings={totalEarnings} />
        
        <EarningsChart royaltyData={royaltyData} />
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <PaymentHistory paymentHistory={paymentHistory} />
          
          <PaymentMethods 
            isSubmitting={isSubmitting}
            onSubmitBankInfo={onSubmitBankInfo}
            onSubmitPaypal={onSubmitPaypal}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Payments;
