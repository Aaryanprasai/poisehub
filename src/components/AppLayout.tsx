
import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Music, 
  Home, 
  Upload, 
  ChartLine, 
  Wallet, 
  MessageSquare, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui-extensions/Button';

interface AppLayoutProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => (
  <Link to={href} className="w-full">
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 font-normal",
        isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  </Link>
);

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Music, label: 'Tracks', href: '/tracks' },
    { icon: Upload, label: 'Upload', href: '/upload' },
    { icon: ChartLine, label: 'Insights', href: '/insights' },
    { icon: Wallet, label: 'Payments', href: '/payments' },
    { icon: MessageSquare, label: 'Support', href: '/support' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 flex items-center px-4 z-50 bg-background/80 backdrop-blur-md border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Beat Echo</h1>
        </div>
      </div>

      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-0",
          "flex flex-col"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Beat Echo</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="ml-auto lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
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
        
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">artist@example.com</p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 min-w-0",
        "flex flex-col",
        "lg:pl-0",
        "pt-16 lg:pt-0" // Add padding to top on mobile to account for header
      )}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
