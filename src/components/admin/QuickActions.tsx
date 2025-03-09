
import { useNavigate } from 'react-router-dom';
import { Mail, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => {
              // In a real app, this would send invitations
              toast.success('Test invitations sent successfully');
            }}
            leftIcon={<Mail className="h-4 w-4" />}
          >
            Send Batch Invitations
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/admin/system-settings')}
            leftIcon={<Settings className="h-4 w-4" />}
          >
            System Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
