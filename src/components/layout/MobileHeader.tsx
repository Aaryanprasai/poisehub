
import { Button } from '@/components/ui-extensions/Button';
import { Menu, Music } from 'lucide-react';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader = ({ toggleSidebar }: MobileHeaderProps) => {
  return (
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
  );
};

export default MobileHeader;
