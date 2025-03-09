
import { Users, Music, Ticket, DollarSign, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui-extensions/Card';
import { Button } from '@/components/ui-extensions/Button';

interface AdminCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  link: string;
}

interface AdminOverviewCardsProps {
  pendingUsers: number;
  pendingTracks: number;
  openTickets: number;
  pendingPayouts: number;
  accountDeletionRequests: number;
}

export function AdminOverviewCards({
  pendingUsers,
  pendingTracks,
  openTickets,
  pendingPayouts,
  accountDeletionRequests
}: AdminOverviewCardsProps) {
  const navigate = useNavigate();

  const adminCards: AdminCard[] = [
    {
      title: 'Pending Verifications',
      value: pendingUsers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Content for Review',
      value: pendingTracks,
      icon: Music,
      color: 'bg-purple-500',
      link: '/admin/tracks'
    },
    {
      title: 'Open Support Tickets',
      value: openTickets,
      icon: Ticket,
      color: 'bg-amber-500',
      link: '/admin/tickets'
    },
    {
      title: 'Pending Payouts',
      value: pendingPayouts,
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/admin/royalties'
    },
    {
      title: 'Deletion Requests',
      value: accountDeletionRequests,
      icon: ShieldAlert,
      color: 'bg-red-500',
      link: '/admin/deletion-requests'
    }
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
      {adminCards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-2 rounded-full text-white`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4" 
              onClick={() => navigate(card.link)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
