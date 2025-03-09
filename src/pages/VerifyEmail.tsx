
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui-extensions/Button';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Simulate email verification
      const timer = setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
        toast.success('Email verified successfully');
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsVerifying(false);
      toast.error('Invalid verification link');
    }
  }, [token]);

  return (
    <AuthLayout>
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Email Verification</h1>
          <p className="text-muted-foreground mt-2">
            {isVerifying 
              ? 'Verifying your email address...' 
              : isVerified 
                ? 'Your email has been verified successfully!' 
                : 'Verification failed. The link may be invalid or expired.'}
          </p>
        </div>
        
        {isVerifying && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        
        {isVerified && (
          <Button 
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Continue to Login
          </Button>
        )}
        
        {!isVerifying && !isVerified && (
          <Button 
            onClick={() => navigate('/login')}
            variant="outline" 
            className="w-full"
          >
            Return to Login
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
