
import { cn } from "@/lib/utils";
import SidebarHeader from './SidebarHeader';
import SidebarNavigation from './SidebarNavigation';
import UserProfile from './UserProfile';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
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
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-0",
          "flex flex-col"
        )}
      >
        <SidebarHeader toggleSidebar={toggleSidebar} />
        <SidebarNavigation />
        <UserProfile />
      </div>
    </>
  );
};

export default Sidebar;
