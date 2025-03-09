
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface SidebarHeaderProps {
  toggleSidebar: () => void;
}

const SidebarHeader = ({ toggleSidebar }: SidebarHeaderProps) => {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/0e7944a1-7691-4813-a45b-831d6f5e1e44.png" 
          alt="Logo" 
          className="h-8 w-auto"
        />
        <h1 className="text-xl font-bold tracking-tight">Sound</h1>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SidebarHeader;
