import React from 'react';
import { Bell, Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useFinance } from '../../contexts/FinanceContext';
import AddTransactionModal from '../transactions/AddTransactionModal';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { getBalance } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Balance pill */}
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
            <span className="mr-1.5 text-gray-500 dark:text-gray-400">Balance:</span>
            <span className={`font-medium ${getBalance() >= 0 ? 'text-success' : 'text-error'}`}>
              ₹{getBalance().toLocaleString('en-IN')}
            </span>
          </div>
          
          {/* Quick add button */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
          
          {/* Notifications */}
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </header>
  );
};

export default Header;