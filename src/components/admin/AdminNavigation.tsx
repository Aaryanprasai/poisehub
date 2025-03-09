
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Music, 
  Gauge, 
  Settings, 
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ElementType;
  superAdminOnly?: boolean;
}

export default function AdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin } = useAuth();

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: Gauge,
    },
    {
      label: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Tracks',
      href: '/admin/tracks',
      icon: Music,
    },
    {
      label: 'Admin Management',
      href: '/admin/admins',
      icon: UserCog,
      superAdminOnly: true,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const filteredItems = navigationItems.filter(
    item => !item.superAdminOnly || (item.superAdminOnly && isSuperAdmin())
  );

  return (
    <nav className="flex space-x-1 lg:flex-col lg:space-x-0 lg:space-y-1 p-2 lg:p-4">
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <button
            key={item.href}
            onClick={() => navigate(item.href)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
              isActive ? "bg-muted" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden lg:block">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
