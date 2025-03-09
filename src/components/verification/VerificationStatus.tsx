
import React from 'react';
import { Card, CardContent } from '@/components/ui-extensions/Card';
import { CircleCheck, CircleAlert, Clock, HelpCircle } from 'lucide-react';

interface VerificationStatusProps {
  user: {
    verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  } | null;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ user }) => {
  const getStatusDetails = () => {
    if (!user || !user.verificationStatus || user.verificationStatus === 'unverified') {
      return {
        icon: <HelpCircle className="h-8 w-8 text-gray-400" />,
        title: 'Unverified',
        description: 'Your identity has not been verified yet. Complete the form below to start the verification process.',
        color: 'bg-gray-50 border-gray-200',
        iconColor: 'text-gray-400',
        textColor: 'text-gray-700'
      };
    }

    switch (user.verificationStatus) {
      case 'pending':
        return {
          icon: <Clock className="h-8 w-8 text-yellow-500" />,
          title: 'Verification Pending',
          description: 'Your documents have been submitted and are currently under review. This usually takes 1-2 business days.',
          color: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-700'
        };
      case 'verified':
        return {
          icon: <CircleCheck className="h-8 w-8 text-green-500" />,
          title: 'Verified',
          description: 'Your identity has been successfully verified. You now have full access to all features.',
          color: 'bg-green-50 border-green-200',
          iconColor: 'text-green-500',
          textColor: 'text-green-700'
        };
      case 'rejected':
        return {
          icon: <CircleAlert className="h-8 w-8 text-red-500" />,
          title: 'Verification Rejected',
          description: 'Your verification was rejected. Please review the requirements and submit new documents.',
          color: 'bg-red-50 border-red-200',
          iconColor: 'text-red-500',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <HelpCircle className="h-8 w-8 text-gray-400" />,
          title: 'Unverified',
          description: 'Your identity has not been verified yet. Complete the form below to start the verification process.',
          color: 'bg-gray-50 border-gray-200',
          iconColor: 'text-gray-400',
          textColor: 'text-gray-700'
        };
    }
  };

  const status = getStatusDetails();

  return (
    <Card className={`mb-6 ${status.color}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-2 ${status.iconColor} bg-opacity-20`}>
            {status.icon}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${status.iconColor}`}>{status.title}</h3>
            <p className={`${status.textColor}`}>{status.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
