
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Music, 
  BarChart3,
  Share2, 
  LifeBuoy, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { Button } from '@/components/ui-extensions/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { currentUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { path: '/tracks', label: 'Tracks', icon: <Music className="w-5 h-5" /> },
  { path: '/distribution', label: 'Distribution', icon: <Share2 className="w-5 h-5" /> },
  { path: '/royalties', label: 'Royalties', icon: <BarChart3 className="w-5 h-5" /> },
  { path: '/support', label: 'Support', icon: <LifeBuoy className="w-5 h-5" /> },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0e7944a1-7691-4813-a45b-831d6f5e1e44.png" 
              alt="Poise Logo" 
              className="h-6 w-auto"
            />
            <h1 className="text-xl font-bold tracking-tight">
              Poise
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                cn("nav-link", isActive ? "nav-link-active" : "nav-link-inactive")
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between text-sidebar-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{currentUser.name}</span>
                </div>
                <ChevronUp className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile navbar */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0e7944a1-7691-4813-a45b-831d6f5e1e44.png" 
              alt="Poise Logo" 
              className="h-6 w-auto"
            />
            <h1 className="text-xl font-bold">Poise</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile menu dropdown */}
        <div className={cn(
          "fixed inset-x-0 top-[64px] bg-background shadow-lg z-40 transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}>
          <nav className="flex flex-col px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  cn("flex items-center gap-2 px-3 py-2 rounded-md text-foreground text-sm font-medium", 
                    isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5")
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            <div className="pt-2 mt-2 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-sm"
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Log out
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
