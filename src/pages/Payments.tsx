
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { SaveIcon, Wallet } from 'lucide-react';
import { RoyaltyChart } from '@/components/RoyaltyChart';
import { royaltyData } from '@/lib/mock-data';
import AppLayout from '@/components/AppLayout';

const paymentMethodSchema = z.object({
  accountHolder: z.string().min(2, 'Account holder name is required'),
  accountType: z.string().min(1, 'Account type is required'),
  accountNumber: z.string().min(8, 'Valid account number is required'),
  routingNumber: z.string().min(9, 'Valid routing number is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  country: z.string().min(2, 'Country is required'),
});

const paypalSchema = z.object({
  paypalEmail: z.string().email('Valid PayPal email is required'),
});

const Payments = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const bankForm = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      accountHolder: '',
      accountType: '',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      country: '',
    },
  });

  const paypalForm = useForm<z.infer<typeof paypalSchema>>({
    resolver: zodResolver(paypalSchema),
    defaultValues: {
      paypalEmail: '',
    },
  });

  const onSubmitBankInfo = async (values: z.infer<typeof paymentMethodSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Bank account info:', values);
      setIsSubmitting(false);
      toast.success('Bank account information saved successfully!');
    }, 1500);
  };

  const onSubmitPaypal = async (values: z.infer<typeof paypalSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('PayPal info:', values);
      setIsSubmitting(false);
      toast.success('PayPal information saved successfully!');
    }, 1500);
  };

  // Mock payment history
  const paymentHistory = [
    { id: '1', date: '2023-12-15', amount: 245.88, status: 'Paid' },
    { id: '2', date: '2023-11-15', amount: 178.52, status: 'Paid' },
    { id: '3', date: '2023-10-15', amount: 203.74, status: 'Paid' },
    { id: '4', date: '2023-09-15', amount: 156.30, status: 'Paid' },
  ];

  // Calculate total earnings
  const totalEarnings = royaltyData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppLayout>
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Royalty Payments</h1>
          <p className="text-muted-foreground">Manage your payment methods and view earnings</p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalEarnings * 0.2).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Will be transferred on the 15th
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                All time earnings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Dec 15, 2023</div>
              <p className="text-xs text-muted-foreground">
                Estimated amount: ${(totalEarnings * 0.2).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your royalty earnings across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <RoyaltyChart data={royaltyData} />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent royalty payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="px-4 py-3">{payment.date}</td>
                        <td className="px-4 py-3">${payment.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
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
                  <Form {...bankForm}>
                    <form onSubmit={bankForm.handleSubmit(onSubmitBankInfo)} className="space-y-4">
                      <FormField
                        control={bankForm.control}
                        name="accountHolder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Holder Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name on account" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={bankForm.control}
                          name="accountType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="checking">Checking</SelectItem>
                                  <SelectItem value="savings">Savings</SelectItem>
                                  <SelectItem value="business">Business</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={bankForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="us">United States</SelectItem>
                                  <SelectItem value="ca">Canada</SelectItem>
                                  <SelectItem value="uk">United Kingdom</SelectItem>
                                  <SelectItem value="au">Australia</SelectItem>
                                  <SelectItem value="eu">European Union</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={bankForm.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your bank name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={bankForm.control}
                          name="routingNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Routing Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter routing number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={bankForm.control}
                          name="accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        isLoading={isSubmitting}
                        leftIcon={<SaveIcon className="h-4 w-4" />}
                      >
                        Save Bank Details
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="paypal">
                  <Form {...paypalForm}>
                    <form onSubmit={paypalForm.handleSubmit(onSubmitPaypal)} className="space-y-4">
                      <FormField
                        control={paypalForm.control}
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Payments;
