
import { useState, ReactNode } from 'react';
import { cn } from "@/lib/utils";
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Admin header */}
      <AdminHeader toggleSidebar={toggleSidebar} />
      
      {/* Admin sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
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

export default AdminLayout;
