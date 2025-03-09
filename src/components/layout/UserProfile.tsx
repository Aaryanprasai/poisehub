
import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui-extensions/Button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationBadgeProps {
  status: "pending" | "verified" | "rejected" | "unverified" | undefined;
}

const VerificationBadge = ({ status }: VerificationBadgeProps) => {
  if (!status || status === 'unverified') return null;
  
  switch (status) {
    case 'pending':
      return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Verification Pending</span>;
    case 'verified':
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span>;
    case 'rejected':
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Verification Rejected</span>;
    default:
      return null;
  }
};

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          toast({
            title: "Profile updated",
            description: "Your profile picture has been updated.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <label className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary cursor-pointer overflow-hidden hover:opacity-90 transition-opacity">
            {profileImage || user?.avatar ? (
              <Avatar className="w-10 h-10">
                <AvatarImage src={profileImage || user?.avatar || ''} alt="Profile picture" />
                <AvatarFallback>{user?.name.substring(0, 2) || 'JD'}</AvatarFallback>
              </Avatar>
            ) : (
              <>
                <User className="h-5 w-5" />
                <span className="sr-only">Upload profile picture</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleProfileImageChange}
            />
          </label>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'John Doe'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'artist@example.com'}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          <VerificationBadge status={user?.verificationStatus} />
          {user?.deleteStatus === 'pending' && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Deletion Pending</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
