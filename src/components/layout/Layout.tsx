import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={pageTitle} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Mobile navigation - visible only on mobile */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

// Helper function to get page title based on current route
const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/transactions':
      return 'Transactions';
    case '/budgets':
      return 'Budget Management';
    case '/goals':
      return 'Financial Goals';
    case '/investments':
      return 'Investments';
    case '/settings':
      return 'Settings';
    default:
      return 'Finance Tracker';
  }
};

export default Layout;