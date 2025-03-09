
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { VerificationForm } from '@/components/verification/VerificationForm';
import { VerificationStatus } from '@/components/verification/VerificationStatus';

export default function VerificationPage() {
  const { user, uploadVerificationDocuments } = useAuth();

  const handleDocumentsSubmit = (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument: string,
    taxDocument: string
  ) => {
    if (uploadVerificationDocuments) {
      uploadVerificationDocuments(
        idType,
        idDocument,
        businessDocument,
        taxDocument
      );
    }
  };

  return (
    <AppLayout>
      <div className="container py-6 md:py-10 space-y-10">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Verification</h2>
          <p className="text-muted-foreground">
            Complete your account verification to access all features
          </p>
        </div>

        <div className="grid gap-6">
          <VerificationStatus user={user} />
          <VerificationForm 
            user={user} 
            uploadVerificationDocuments={handleDocumentsSubmit}
          />
        </div>
      </div>
    </AppLayout>
  );
}
