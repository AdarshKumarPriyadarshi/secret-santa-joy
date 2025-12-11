import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Calendar, Bell, User, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Building2, label: 'Organizations', path: '/organizations' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="h-full bg-card border-r flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Snowflake className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-primary">Menu</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-primary/10 hover:text-primary",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🎄 Happy Holidays! 🎅
          </p>
        </div>
      </div>
    </aside>
  );
};
