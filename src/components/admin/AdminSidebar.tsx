
import { ThemeToggle } from '@/components/common/ThemeToggle';
import AdminNavigation from './AdminNavigation';

export default function AdminSidebar() {
  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Beat Echo Admin</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <AdminNavigation />
      </div>
      <div className="p-4 border-t dark:border-gray-800">
        <ThemeToggle />
      </div>
    </div>
  );
}
