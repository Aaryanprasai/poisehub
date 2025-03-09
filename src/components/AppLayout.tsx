
import { useState, ReactNode } from 'react';
import { cn } from "@/lib/utils";
import MobileHeader from './layout/MobileHeader';
import Sidebar from './layout/Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile header */}
      <MobileHeader toggleSidebar={toggleSidebar} />
      
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
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
