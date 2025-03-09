
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui-extensions/Button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();
  
  const handleResendVerification = () => {
    toast.success('Verification email resent');
  };
  
  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Verify your email"
      description="We've sent a verification link to your email address"
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          Please check your inbox and click the verification link to complete your registration.
          If you don't see the email, please check your spam folder.
        </p>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleResendVerification}
          >
            Resend verification email
          </Button>
          <Button 
            className="w-full" 
            onClick={handleContinue}
          >
            I've verified my email
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
