
import { User } from '../types/auth';

export function useUserProfile(
  user: User | null,
  setUser: (user: User | null) => void
) {
  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      // Update local state only
      setUser({ ...user, ...userData });
    }
  };

  const toggleTwoFactor = async (enabled: boolean) => {
    if (user) {
      await updateUser({ twoFactorEnabled: enabled });
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (user) {
      await updateUser({ phoneNumber });
    }
  };

  const uploadVerificationDocuments = async (
    idType: 'personal' | 'business',
    idDocument: string,
    businessDocument: string,
    taxDocument: string
  ) => {
    if (user) {
      // Mock document upload
      await updateUser({
        idType,
        verificationStatus: 'pending'
      });
    }
  };

  const requestAccountDeletion = async () => {
    if (user) {
      // If user has releases, set delete status to pending for admin approval
      if (user.hasReleases) {
        await updateUser({
          deleteStatus: 'pending'
        });
      } else {
        // Immediately delete account for users without releases
        // In a real implementation, you'd call the logout function here
        setUser(null);
      }
    }
  };

  return {
    updateUser,
    toggleTwoFactor,
    updatePhoneNumber,
    uploadVerificationDocuments,
    requestAccountDeletion
  };
}
