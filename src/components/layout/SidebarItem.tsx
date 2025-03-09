
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui-extensions/Button';

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

export default SidebarItem;
