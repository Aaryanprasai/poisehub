
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import { 
  Music, 
  Home, 
  Upload, 
  ChartLine, 
  Wallet, 
  MessageSquare, 
  Settings, 
  ShieldCheck,
  BarChart,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SidebarNavigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Base navigation items for all users
  const baseNavigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Music, label: 'Tracks', href: '/tracks' },
    { icon: Upload, label: 'Upload', href: '/upload' },
    { icon: ChartLine, label: 'Insights', href: '/insights' },
    { icon: Wallet, label: 'Payments', href: '/payments' },
    { icon: MessageSquare, label: 'Support', href: '/support' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: ShieldCheck, label: 'Verification', href: '/verification' },
  ];
  
  // Admin-only navigation items
  const adminNavigationItems = isAdmin() ? [
    { icon: BarChart, label: 'Admin Dashboard', href: '/admin' },
    { icon: DollarSign, label: 'Royalty Management', href: '/admin/royalties' },
  ] : [];
  
  // Combine the navigation items
  const navigationItems = [...baseNavigationItems, ...adminNavigationItems];
  
  return (
    <div className="flex-1 overflow-auto py-6 px-4">
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>
    </div>
  );
};

export default SidebarNavigation;
