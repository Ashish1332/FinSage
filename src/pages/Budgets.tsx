import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useToast } from '../contexts/ToastContext';
import ProgressBar from '../components/shared/ProgressBar';

const Budgets: React.FC = () => {
  const { budgets, categories, addBudget, deleteBudget, getBudgetStatus } = useFinance();
  const { addToast } = useToast();
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly'
  });

  // Filter categories to only show expense categories
  const expenseCategories = categories.filter(
    cat => cat.type === 'expense' || cat.type === 'both'
  );

  // Find categories that don't have a budget yet
  const categoriesWithoutBudget = expenseCategories.filter(
    cat => !budgets.some(budget => budget.category === cat.name)
  );

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBudget.category || !newBudget.limit) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const limit = parseFloat(newBudget.limit);
    
    addBudget({
      category: newBudget.category,
      limit,
      period: newBudget.period as 'monthly' | 'weekly'
    });

    addToast('Budget added successfully', 'success');
    
    // Reset form
    setNewBudget({
      category: '',
      limit: '',
      period: 'monthly'
    });
    setIsAddFormVisible(false);
  };

  const handleDeleteBudget = (id: string, category: string) => {
    if (confirm(`Are you sure you want to delete the budget for ${category}?`)) {
      deleteBudget(id);
      addToast('Budget deleted successfully', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with add button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Budget Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Set and track spending limits for different categories</p>
        </div>
        
        {!isAddFormVisible && categoriesWithoutBudget.length > 0 && (
          <button 
            onClick={() => setIsAddFormVisible(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Budget
          </button>
        )}
      </div>
      
      {/* Add budget form */}
      {isAddFormVisible && (
        <div className="card p-4 border-2 border-primary/30 animate-fade-in">
          <h2 className="font-medium mb-4">Create New Budget</h2>
          
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category select */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                  className="form-input"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesWithoutBudget.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Budget limit */}
              <div>
                <label className="block text-sm font-medium mb-1">Budget Limit (₹)</label>
                <input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                  placeholder="5000"
                  className="form-input"
                  required
                />
              </div>
              
              {/* Period */}
              <div>
                <label className="block text-sm font-medium mb-1">Period</label>
                <select
                  value={newBudget.period}
                  onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value }))}
                  className="form-input"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setIsAddFormVisible(false)}
                className="btn btn-outline flex items-center"
              >
                <X size={18} className="mr-1" />
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary flex items-center"
              >
                <Check size={18} className="mr-1" />
                Save Budget
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Budgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map(budget => {
          const { spent, limit, percentage } = getBudgetStatus(budget.category);
          
          // Determine status color
          let statusColor = 'bg-success';
          if (percentage > 90) statusColor = 'bg-error';
          else if (percentage > 75) statusColor = 'bg-warning';
          
          return (
            <div key={budget.id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{budget.category}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {budget.period === 'monthly' ? 'Monthly' : 'Weekly'} Budget
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteBudget(budget.id, budget.category)}
                  className="text-gray-400 hover:text-error"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    ₹{spent.toLocaleString('en-IN')} spent
                  </span>
                  <span className="text-sm font-medium">
                    of ₹{limit.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <ProgressBar 
                  percentage={percentage} 
                  color={statusColor} 
                />
                
                <div className="flex justify-between text-xs">
                  <span className={`
                    ${percentage > 90 ? 'text-error' : 
                      percentage > 75 ? 'text-warning' : 'text-success'}
                  `}>
                    {Math.min(100, Math.round(percentage))}% used
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ₹{Math.max(0, limit - spent).toLocaleString('en-IN')} remaining
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty state */}
        {budgets.length === 0 && !isAddFormVisible && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Plus size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="font-medium mb-1">No budgets yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Create your first budget to track your spending
            </p>
            <button 
              onClick={() => setIsAddFormVisible(true)}
              className="btn btn-primary"
            >
              Create Budget
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;