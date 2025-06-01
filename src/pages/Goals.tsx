import React, { useState } from 'react';
import { Target, Plus, Check, X, ArrowRight, TrendingUp } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useToast } from '../contexts/ToastContext';
import ProgressBar from '../components/shared/ProgressBar';

const Goals: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const { addToast } = useToast();
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    description: ''
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.targetDate) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    addGoal({
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: newGoal.currentAmount ? parseFloat(newGoal.currentAmount) : 0,
      targetDate: newGoal.targetDate,
      description: newGoal.description
    });

    addToast('Goal added successfully', 'success');
    
    // Reset form
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      description: ''
    });
    setIsAddFormVisible(false);
  };

  const handleContribution = (id: string, currentAmount: number, amount: number) => {
    updateGoal(id, { currentAmount: currentAmount + amount });
    addToast('Contribution added successfully', 'success');
  };

  const handleDeleteGoal = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the goal "${name}"?`)) {
      deleteGoal(id);
      addToast('Goal deleted successfully', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with add button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Financial Goals</h1>
          <p className="text-gray-500 dark:text-gray-400">Set and track your financial aspirations</p>
        </div>
        
        {!isAddFormVisible && (
          <button 
            onClick={() => setIsAddFormVisible(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Goal
          </button>
        )}
      </div>
      
      {/* Add goal form */}
      {isAddFormVisible && (
        <div className="card p-4 border-2 border-primary/30 animate-fade-in">
          <h2 className="font-medium mb-4">Create New Financial Goal</h2>
          
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Goal name */}
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Emergency Fund"
                  className="form-input"
                  required
                />
              </div>
              
              {/* Target amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  placeholder="100000"
                  className="form-input"
                  required
                />
              </div>
              
              {/* Current amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Current Amount (₹)</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                  placeholder="0"
                  className="form-input"
                />
              </div>
              
              {/* Target date */}
              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="form-input"
                  required
                />
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your goal..."
                  className="form-input h-20"
                />
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
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;
          
          // Calculate days remaining until target date
          const targetDate = new Date(goal.targetDate);
          const today = new Date();
          const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Calculate required monthly contribution
          const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30));
          const monthlyRequired = remaining / monthsRemaining;
          
          return (
            <div key={goal.id} className="card overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-lg mr-3">
                    <Target size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Target: {new Date(goal.targetDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteGoal(goal.id, goal.name)}
                  className="text-gray-400 hover:text-error"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-4">
                {/* Progress */}
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      ₹{goal.currentAmount.toLocaleString('en-IN')} saved
                    </span>
                    <span className="text-sm font-medium">
                      of ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <ProgressBar 
                    percentage={progress} 
                    color="bg-primary" 
                  />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-primary">
                      {Math.min(100, Math.round(progress))}% complete
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ₹{remaining.toLocaleString('en-IN')} to go
                    </span>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {goal.description}
                  </p>
                )}
                
                {/* Target info */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex items-start space-x-2">
                    <TrendingUp size={16} className="text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Monthly contribution needed</p>
                      <p className="text-sm">
                        ₹{monthlyRequired.toLocaleString('en-IN')} for {monthsRemaining} months
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 5000, 10000].map((amount, index) => (
                    <button
                      key={index}
                      onClick={() => handleContribution(goal.id, goal.currentAmount, amount)}
                      className="btn btn-outline py-1 text-sm"
                    >
                      + ₹{amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty state */}
        {goals.length === 0 && !isAddFormVisible && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
              <Target size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="font-medium mb-1">No financial goals yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Set clear goals to achieve your financial aspirations
            </p>
            <button 
              onClick={() => setIsAddFormVisible(true)}
              className="btn btn-primary"
            >
              Create Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;