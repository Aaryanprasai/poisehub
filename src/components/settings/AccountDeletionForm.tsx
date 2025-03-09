
import { useState } from 'react';
import { Button } from '@/components/ui-extensions/Button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const AccountDeletionForm = () => {
  const [confirmInput, setConfirmInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, requestAccountDeletion } = useAuth();
  const { toast } = useToast();

  // Check if the user already has a deletion request pending
  const hasPendingDeletion = user?.deleteStatus === 'pending';

  const handleDeleteAccount = async () => {
    if (confirmInput !== 'DELETE') {
      toast({
        title: 'Error',
        description: 'Please type DELETE to confirm account deletion',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      await requestAccountDeletion();
      toast({
        title: 'Account deletion requested',
        description: user?.hasReleases 
          ? 'Your request has been submitted and is pending review.' 
          : 'Your account will be deleted shortly.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request account deletion. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setConfirmInput('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPendingDeletion ? (
          <Alert className="bg-yellow-50 border-yellow-300">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Deletion Request Pending</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your account deletion request is being processed. This may take some time if you have active releases.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="bg-red-50 border-red-300">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Warning: This action cannot be undone</AlertTitle>
              <AlertDescription className="text-red-700">
                {user?.hasReleases 
                  ? "Since you have active releases, your deletion request will need to be reviewed. Your account will remain accessible until the request is approved."
                  : "Your account will be permanently deleted along with all your data, including tracks, royalty information, and personal details."}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <p className="text-sm font-medium">Type DELETE to confirm:</p>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE"
                className="max-w-md"
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!hasPendingDeletion && (
          <Button
            variant="destructive"
            disabled={confirmInput !== 'DELETE' || isLoading}
            onClick={handleDeleteAccount}
          >
            {isLoading ? "Processing..." : "Delete My Account"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
