import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useToast } from '../contexts/ToastContext';
import DonutChart from '../components/charts/DonutChart';

const Investments: React.FC = () => {
  const { investments, addInvestment, deleteInvestment } = useFinance();
  const { addToast } = useToast();
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    type: 'stock',
    amount: '',
    currentValue: '',
    notes: ''
  });

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInvestment.name || !newInvestment.amount) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    addInvestment({
      name: newInvestment.name,
      type: newInvestment.type as 'stock' | 'mutualFund' | 'fd' | 'other',
      amount: parseFloat(newInvestment.amount),
      currentValue: newInvestment.currentValue ? parseFloat(newInvestment.currentValue) : parseFloat(newInvestment.amount),
      notes: newInvestment.notes
    });

    addToast('Investment added successfully', 'success');
    
    // Reset form
    setNewInvestment({
      name: '',
      type: 'stock',
      amount: '',
      currentValue: '',
      notes: ''
    });
    setIsAddFormVisible(false);
  };

  const handleDeleteInvestment = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from your investments?`)) {
      deleteInvestment(id);
      addToast('Investment deleted successfully', 'success');
    }
  };

  // Calculate investment statistics
  const totalInvested = investments.reduce((total, inv) => total + inv.amount, 0);
  const totalValue = investments.reduce((total, inv) => total + inv.currentValue, 0);
  const totalReturn = totalValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  // Group investments by type for the chart
  const investmentsByType: Record<string, number> = {};
  investments.forEach(inv => {
    if (investmentsByType[inv.type]) {
      investmentsByType[inv.type] += inv.currentValue;
    } else {
      investmentsByType[inv.type] = inv.currentValue;
    }
  });

  const chartData = Object.entries(investmentsByType).map(([type, value]) => ({
    label: formatInvestmentType(type),
    value,
    color: getColorForType(type)
  }));

  return (
    <div className="space-y-6">
      {/* Header with add button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Investments</h1>
          <p className="text-gray-500 dark:text-gray-400">Track and manage your investment portfolio</p>
        </div>
        
        {!isAddFormVisible && (
          <button 
            onClick={() => setIsAddFormVisible(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Investment
          </button>
        )}
      </div>
      
      {/* Add investment form */}
      {isAddFormVisible && (
        <div className="card p-4 border-2 border-primary/30 animate-fade-in">
          <h2 className="font-medium mb-4">Add New Investment</h2>
          
          <form onSubmit={handleAddInvestment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Investment name */}
              <div>
                <label className="block text-sm font-medium mb-1">Investment Name</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Reliance Industries"
                  className="form-input"
                  required
                />
              </div>
              
              {/* Investment type */}
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, type: e.target.value }))}
                  className="form-input"
                >
                  <option value="stock">Stocks</option>
                  <option value="mutualFund">Mutual Funds</option>
                  <option value="fd">Fixed Deposit</option>
                  <option value="pf">Provident Fund</option>
                  <option value="gold">Gold</option>
                  <option value="realEstate">Real Estate</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Investment amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Investment Amount (₹)</label>
                <input
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="10000"
                  className="form-input"
                  required
                />
              </div>
              
              {/* Current value */}
              <div>
                <label className="block text-sm font-medium mb-1">Current Value (₹)</label>
                <input
                  type="number"
                  value={newInvestment.currentValue}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, currentValue: e.target.value }))}
                  placeholder="Leave empty if same as investment amount"
                  className="form-input"
                />
              </div>
              
              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  value={newInvestment.notes}
                  onChange={(e) => setNewInvestment(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional details about this investment..."
                  className="form-input h-20"
                />
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setIsAddFormVisible(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
              >
                Add Investment
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Investment summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Invested */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</span>
              <BarChart3 className="text-gray-400" size={18} />
            </div>
            <div className="text-2xl font-bold">
              ₹{totalInvested.toLocaleString('en-IN')}
            </div>
          </div>
          
          {/* Current Value */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Value</span>
              <PieChart className="text-gray-400" size={18} />
            </div>
            <div className="text-2xl font-bold">
              ₹{totalValue.toLocaleString('en-IN')}
            </div>
          </div>
          
          {/* Total Returns */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Returns</span>
              <TrendingUp className={totalReturn >= 0 ? "text-success" : "text-error"} size={18} />
            </div>
            <div className={`text-2xl font-bold ${totalReturn >= 0 ? "text-success" : "text-error"}`}>
              {totalReturn >= 0 ? '+' : ''}₹{totalReturn.toLocaleString('en-IN')}
            </div>
            <div className="mt-1 text-xs flex items-center">
              {totalReturn >= 0 ? (
                <ArrowUpRight size={14} className="text-success mr-1" />
              ) : (
                <ArrowDownRight size={14} className="text-error mr-1" />
              )}
              <span className={totalReturn >= 0 ? "text-success" : "text-error"}>
                {returnPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Portfolio distribution */}
        <div className="card p-4">
          <h3 className="font-medium mb-4">Portfolio Distribution</h3>
          
          {investments.length > 0 ? (
            <DonutChart data={chartData} size={180} thickness={40} />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No investments to display
            </div>
          )}
        </div>
      </div>
      
      {/* Investments table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold">Your Investments</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {investments.length} investment{investments.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-right">Invested</th>
                <th className="px-4 py-3 text-right">Current Value</th>
                <th className="px-4 py-3 text-right">Returns</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {investments.map(investment => {
                const returns = investment.currentValue - investment.amount;
                const returnsPercentage = (returns / investment.amount) * 100;
                
                return (
                  <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="font-medium">{investment.name}</div>
                      {investment.notes && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {investment.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {formatInvestmentType(investment.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      ₹{investment.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{investment.currentValue.toLocaleString('en-IN')}
                    </td>
                    <td className={`px-4 py-3 text-right ${returns >= 0 ? 'text-success' : 'text-error'}`}>
                      <div className="font-medium">
                        {returns >= 0 ? '+' : ''}₹{returns.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs flex items-center justify-end">
                        {returns >= 0 ? (
                          <ArrowUpRight size={12} className="mr-1" />
                        ) : (
                          <ArrowDownRight size={12} className="mr-1" />
                        )}
                        {returnsPercentage.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteInvestment(investment.id, investment.name)}
                        className="text-sm text-gray-500 hover:text-error"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {investments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    You haven't added any investments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to format investment type
function formatInvestmentType(type: string): string {
  switch (type) {
    case 'stock': return 'Stocks';
    case 'mutualFund': return 'Mutual Funds';
    case 'fd': return 'Fixed Deposit';
    case 'pf': return 'Provident Fund';
    case 'gold': return 'Gold';
    case 'realEstate': return 'Real Estate';
    case 'crypto': return 'Cryptocurrency';
    default: return 'Other';
  }
}

// Helper function to get color for investment type
function getColorForType(type: string): string {
  switch (type) {
    case 'stock': return 'bg-blue-500';
    case 'mutualFund': return 'bg-emerald-500';
    case 'fd': return 'bg-amber-500';
    case 'pf': return 'bg-purple-500';
    case 'gold': return 'bg-rose-500';
    case 'realEstate': return 'bg-cyan-500';
    case 'crypto': return 'bg-indigo-500';
    default: return 'bg-gray-500';
  }
}

export default Investments;