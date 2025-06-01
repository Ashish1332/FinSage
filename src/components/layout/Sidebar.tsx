import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  TrendingUp, 
  Settings,
  LogOut,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <ArrowLeftRight size={20} /> },
    { path: '/budgets', label: 'Budgets', icon: <PieChart size={20} /> },
    { path: '/goals', label: 'Goals', icon: <Target size={20} /> },
    { path: '/investments', label: 'Investments', icon: <TrendingUp size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* App logo/name */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-2 text-white">
            <IndianRupee size={20} />
          </div>
          <span className="font-bold text-xl">FinSage</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          AI-Powered Finance
        </div>
      </div>

      {/* User profile */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150
                  ${isActive(item.path) 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary w-full px-3 py-2 rounded-lg transition-colors duration-150"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;