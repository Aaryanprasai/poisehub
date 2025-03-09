
import { Music, X } from 'lucide-react';
import { Button } from '@/components/ui-extensions/Button';

interface SidebarHeaderProps {
  toggleSidebar: () => void;
}

const SidebarHeader = ({ toggleSidebar }: SidebarHeaderProps) => {
  return (
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
  );
};

export default SidebarHeader;
