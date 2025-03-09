
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationStatus } from '@/components/verification/VerificationStatus';
import { VerificationForm } from '@/components/verification/VerificationForm';

const VerificationPage = () => {
  const { user, uploadVerificationDocuments } = useAuth();

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold">Identity Verification</h1>
          <p className="text-muted-foreground">
            Verify your identity to unlock all features and ensure secure transactions
          </p>
        </div>
        
        <VerificationStatus user={user} />
        
        {(!user?.verificationStatus || user?.verificationStatus === 'rejected') && (
          <VerificationForm 
            user={user} 
            uploadVerificationDocuments={uploadVerificationDocuments} 
          />
        )}
      </div>
    </AppLayout>
  );
};

export default VerificationPage;
