
import React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui-extensions/Button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password reset instructions sent to your email');
      setIsSubmitting(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email and we'll send you instructions to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Send Reset Instructions
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
