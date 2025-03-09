import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui-extensions/Button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  Music, 
  Ticket, 
  DollarSign, 
  ShieldAlert, 
  Settings,
  UserPlus,
  X,
  PanelLeft,
  Package
} from "lucide-react";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar = ({ sidebarOpen, toggleSidebar }: AdminSidebarProps) => {
  const location = useLocation();
  const { isSuperAdmin } = useAuth();
  
  const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Music, label: "Tracks", href: "/admin/tracks" },
    { icon: Ticket, label: "Support Tickets", href: "/admin/tickets" },
    { icon: DollarSign, label: "Royalties", href: "/admin/royalties" },
    { icon: ShieldAlert, label: "Deletion Requests", href: "/admin/deletion-requests" },
    { icon: Package, label: "Platforms & Codes", href: "/admin/platforms-settings" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  // Super admin exclusive items
  const superAdminItems = [
    { icon: UserPlus, label: "Create Admin", href: "/admin/create-admin" },
  ];

  // Add superadmin items if user is superadmin
  const navItems = isSuperAdmin() 
    ? [...adminNavItems, ...superAdminItems] 
    : adminNavItems;

  return (
    <>
      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => toggleSidebar()}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-0",
          "flex flex-col"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/0e7944a1-7691-4813-a45b-831d6f5e1e44.png" 
              alt="Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-slate-800"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link to={item.href} key={item.href} className="w-full">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 font-normal text-white hover:bg-slate-800",
                    location.pathname === item.href 
                      ? "bg-slate-800 font-medium" 
                      : ""
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Go to user dashboard */}
        <div className="border-t border-slate-800 p-4">
          <Link to="/dashboard" className="w-full">
            <Button
              variant="outline"
              className="w-full justify-start text-white border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              User Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
