import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { Moon, Sun, Bell, Shield, CreditCard, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    budgetAlerts: true,
    billReminders: true,
    goalProgress: true
  });
  
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false
  });
  
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
    addToast(`${checked ? 'Enabled' : 'Disabled'} ${formatSettingName(name)} notifications`, 'success');
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSecurity(prev => ({ ...prev, [name]: checked }));
    addToast(`${checked ? 'Enabled' : 'Disabled'} ${formatSettingName(name)}`, 'success');
  };
  
  const handleConnectBank = () => {
    // In a real app, this would open a bank connection flow
    const newBank = 'ICICI Bank';
    if (!connectedAccounts.includes(newBank)) {
      setConnectedAccounts(prev => [...prev, newBank]);
      addToast(`Connected to ${newBank}`, 'success');
    }
  };
  
  const handleDisconnectBank = (bank: string) => {
    setConnectedAccounts(prev => prev.filter(b => b !== bank));
    addToast(`Disconnected from ${bank}`, 'success');
  };
  
  const handleLogout = () => {
    logout();
    addToast('You have been logged out', 'info');
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      {user && (
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                </svg>
              </button>
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button className="btn btn-primary">Edit Profile</button>
                <button 
                  className="btn btn-outline text-error hover:bg-error/10"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">Appearance</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-amber-500" />
                ) : (
                  <Moon size={20} className="text-primary" />
                )}
              </button>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div>
              <p className="font-medium mb-2">Currency Format</p>
              <select className="form-input">
                <option>₹ - Indian Rupee (INR)</option>
                <option>$ - US Dollar (USD)</option>
                <option>€ - Euro (EUR)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <Bell size={18} className="mr-2 text-primary" />
            <h2 className="font-semibold">Notifications</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notification Channels</p>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="email"
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2">Email Notifications</span>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="push"
                    checked={notifications.push}
                    onChange={handleNotificationChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2">Push Notifications</span>
                </label>
              </div>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Notification Types</p>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="budgetAlerts"
                    checked={notifications.budgetAlerts}
                    onChange={handleNotificationChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2">Budget Alerts</span>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="billReminders"
                    checked={notifications.billReminders}
                    onChange={handleNotificationChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2">Bill Reminders</span>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="goalProgress"
                    checked={notifications.goalProgress}
                    onChange={handleNotificationChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2">Goal Progress Updates</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Security */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <Shield size={18} className="mr-2 text-primary" />
            <h2 className="font-semibold">Security</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
              </div>
              
              <button className="btn btn-outline text-sm py-1">
                Change
              </button>
            </div>
            
            <hr className="border-gray-200 dark:border-gray-700" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="twoFactor"
                  checked={security.twoFactor}
                  onChange={handleSecurityChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Biometric Login</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use fingerprint or face recognition</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox"
                  name="biometric"
                  checked={security.biometric}
                  onChange={handleSecurityChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Connected Accounts */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <CreditCard size={18} className="mr-2 text-primary" />
            <h2 className="font-semibold">Connected Accounts</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Connect your bank accounts for automatic transaction tracking
            </p>
            
            {connectedAccounts.length > 0 ? (
              <div className="space-y-3">
                {connectedAccounts.map((bank, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-lg mr-3">
                        <CreditCard size={18} className="text-primary" />
                      </div>
                      <span>{bank}</span>
                    </div>
                    <button 
                      onClick={() => handleDisconnectBank(bank)}
                      className="text-sm text-gray-500 hover:text-error"
                    >
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No accounts connected yet
              </div>
            )}
            
            <button 
              onClick={handleConnectBank}
              className="btn btn-outline w-full"
            >
              Connect Bank Account
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              We use bank-level security to keep your information safe.
              Your credentials are never stored on our servers.
            </p>
          </div>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="card border-error/30">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-error">Danger Zone</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            
            <button className="btn bg-error text-white hover:bg-error/90 sm:self-start">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format setting names
function formatSettingName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
}

export default Settings;