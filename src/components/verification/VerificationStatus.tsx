
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { User } from '@/lib/types';

interface VerificationStatusProps {
  user: User | null;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ user }) => {
  if (!user) return null;
  
  switch (user.verificationStatus) {
    case 'pending':
      return (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Verification in progress</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your verification documents are being reviewed. This process usually takes 24-48 hours.
          </AlertDescription>
        </Alert>
      );
    case 'verified':
      return (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Verification completed</AlertTitle>
          <AlertDescription className="text-green-700">
            Your account has been verified. You now have full access to all features.
          </AlertDescription>
        </Alert>
      );
    case 'rejected':
      return (
        <Alert className="mb-6 bg-red-50 border-red-200" variant="destructive">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800">Verification rejected</AlertTitle>
          <AlertDescription className="text-red-700">
            Your verification was rejected. Please review our requirements and submit new documents.
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};
