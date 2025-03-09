
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-extensions/Card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { User } from '@/contexts/AuthContext';

interface VerificationStatusProps {
  user: User | null;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ user }) => {
  if (!user) return null;
  
  const getStatusContent = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800">Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your account has been successfully verified. You now have full access to all features.
            </AlertDescription>
          </Alert>
        );
      case 'pending':
        return (
          <Alert className="bg-yellow-50 border-yellow-200">
            <Clock className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Verification in Progress</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your verification documents are being reviewed. This usually takes 1-3 business days.
            </AlertDescription>
          </Alert>
        );
      case 'rejected':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>
              Your verification was rejected. Please review the requirements and submit new documents.
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Verification Required</AlertTitle>
            <AlertDescription className="text-blue-700">
              Please submit your verification documents to access all platform features.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Status</CardTitle>
        <CardDescription>
          {user.idType ? `Account Type: ${user.idType.charAt(0).toUpperCase() + user.idType.slice(1)}` : 'Please select an account type below'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {getStatusContent()}
      </CardContent>
    </Card>
  );
};
