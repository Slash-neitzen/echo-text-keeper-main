
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Search, BarChart4, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/notes', icon: FileText, label: 'Notes' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/analytics', icon: BarChart4, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="py-4 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-lg font-bold text-electric-blue flex items-center gap-2">
            <span>Voice Notes</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 py-2 text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-electric-blue border-b-2 border-electric-blue'
                    : 'text-gray-600 hover:text-electric-blue'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Mobile navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 md:hidden z-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 text-xs ${
                  isActive(item.path)
                    ? 'text-electric-blue'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
