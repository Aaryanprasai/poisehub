
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui-extensions/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const deleteSchema = z.object({
  confirmText: z.string().refine(val => val === 'DELETE', {
    message: 'Please type DELETE to confirm'
  })
});

type DeleteFormValues = z.infer<typeof deleteSchema>;

export function AccountDeletionForm() {
  const { user, requestAccountDeletion } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmText: '',
    },
  });

  const onSubmit = (data: DeleteFormValues) => {
    setIsProcessing(true);
    
    try {
      requestAccountDeletion();
      
      if (user?.hasReleases) {
        toast.success('Account deletion request submitted successfully. An admin will review your request.');
      } else {
        toast.success('Account deleted successfully.');
      }
      
      form.reset();
    } catch (error) {
      toast.error('Failed to process your request. Please try again.');
      console.error('Delete account error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (user?.deleteStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account Deletion</CardTitle>
          <CardDescription>
            Your account deletion request is being processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-yellow-50 border-yellow-200">
            <CheckCircle className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Deletion Request Pending</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your account deletion request has been submitted and is pending review by an administrator.
              This is because your account has active releases. Once all releases are processed, your account will be deleted.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Warning: This action cannot be undone</AlertTitle>
          <AlertDescription>
            {user?.hasReleases
              ? "Since your account has active releases, your deletion request will be pending until an administrator reviews it."
              : "Your account will be immediately deleted. All your data will be permanently removed."}
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="confirmText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm deletion by typing DELETE</FormLabel>
                  <FormControl>
                    <Input placeholder="DELETE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              variant="destructive"
              isLoading={isProcessing}
            >
              Delete Account
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
