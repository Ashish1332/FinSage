import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  Target,
  BellRing,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import TransactionList from '../components/transactions/TransactionList';
import DonutChart from '../components/charts/DonutChart';
import ProgressBar from '../components/shared/ProgressBar';
import RecommendationCard from '../components/dashboard/RecommendationCard';

const Dashboard: React.FC = () => {
  const { 
    transactions, 
    goals, 
    budgets,
    getTotalIncome, 
    getTotalExpenses, 
    getBalance,
    getAIRecommendations,
    getBudgetStatus
  } = useFinance();

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);
  
  // Get top expense categories for the month
  const getTopExpenseCategories = () => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        if (expensesByCategory[transaction.category]) {
          expensesByCategory[transaction.category] += transaction.amount;
        } else {
          expensesByCategory[transaction.category] = transaction.amount;
        }
      });
    
    // Convert to array and sort
    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  };

  const topExpenses = getTopExpenseCategories();
  
  // Get AI recommendations
  const recommendations = getAIRecommendations();

  // Get upcoming bill
  const upcomingBill = {
    name: 'Electricity Bill',
    amount: 2500,
    dueDate: '2025-05-15'
  };

  // Calculate days remaining
  const dueDate = new Date(upcomingBill.dueDate);
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content - 2/3 width on large screens */}
      <div className="lg:col-span-2 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Balance Card */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Balance</span>
              <Wallet className="text-primary" size={18} />
            </div>
            <div className={`text-2xl font-bold ${getBalance() >= 0 ? 'text-success' : 'text-error'}`}>
              ₹{getBalance().toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-xs">
              {getBalance() >= 0 ? (
                <span className="text-success">Healthy balance</span>
              ) : (
                <span className="text-error">Deficit balance</span>
              )}
            </div>
          </div>
          
          {/* Income Card */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Income</span>
              <TrendingUp className="text-success" size={18} />
            </div>
            <div className="text-2xl font-bold">
              ₹{getTotalIncome().toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-xs text-success flex items-center">
              <ArrowUpRight size={14} className="mr-1" />
              <span>7.2% vs last month</span>
            </div>
          </div>
          
          {/* Expenses Card */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</span>
              <TrendingDown className="text-error" size={18} />
            </div>
            <div className="text-2xl font-bold">
              ₹{getTotalExpenses().toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-xs text-error flex items-center">
              <ArrowDownRight size={14} className="mr-1" />
              <span>3.1% vs last month</span>
            </div>
          </div>
        </div>
        
        {/* Expenses Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">Expense Breakdown</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">This Month</span>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Donut Chart */}
            <div className="flex justify-center items-center">
              <DonutChart data={topExpenses.map(expense => ({ 
                label: expense.category, 
                value: expense.amount,
                color: getRandomColor(expense.category)
              }))} />
            </div>
            
            {/* Top Expense Categories */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Categories</h3>
              
              {topExpenses.map((expense, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{expense.category}</span>
                    <span className="text-sm font-medium">₹{expense.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <ProgressBar 
                    percentage={(expense.amount / getTotalExpenses()) * 100} 
                    color={getRandomColor(expense.category)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">Recent Transactions</h2>
            <a href="/transactions" className="text-primary text-sm">View All</a>
          </div>
          
          <div className="p-2">
            <TransactionList transactions={recentTransactions} />
          </div>
        </div>
      </div>
      
      {/* Sidebar - 1/3 width on large screens */}
      <div className="space-y-6">
        {/* AI Insights */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold flex items-center">
              <span className="bg-primary/10 text-primary p-1 rounded-md mr-2">AI</span>
              Financial Insights
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard key={index} text={recommendation} />
            ))}
          </div>
        </div>
        
        {/* Upcoming Bill */}
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BellRing size={18} className="text-warning" />
            <h3 className="font-medium">Upcoming Bill</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{upcomingBill.name}</span>
              <span className="font-medium">₹{upcomingBill.amount}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Due in {daysRemaining} days</span>
              <span className="text-xs px-2 py-0.5 bg-warning/20 text-warning rounded-full">
                {daysRemaining <= 3 ? 'Pay soon' : 'Upcoming'}
              </span>
            </div>
            
            <button className="w-full btn btn-outline mt-2 py-1.5">Pay Now</button>
          </div>
        </div>
        
        {/* Budget Alerts */}
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle size={18} className="text-error" />
            <h3 className="font-medium">Budget Alerts</h3>
          </div>
          
          <div className="space-y-3">
            {budgets
              .filter(budget => {
                const { percentage } = getBudgetStatus(budget.category);
                return percentage > 80;
              })
              .slice(0, 2)
              .map((budget, index) => {
                const { spent, limit, percentage } = getBudgetStatus(budget.category);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{budget.category}</span>
                      <span className="font-medium">
                        ₹{spent.toLocaleString('en-IN')} / ₹{limit.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ProgressBar 
                      percentage={percentage} 
                      color={percentage > 90 ? 'bg-error' : 'bg-warning'} 
                    />
                    <p className="text-xs text-error">
                      {percentage > 90 
                        ? 'Budget exceeded!' 
                        : `${100 - Math.floor(percentage)}% of budget remaining`}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        
        {/* Goal Progress */}
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target size={18} className="text-primary" />
            <h3 className="font-medium">Goal Progress</h3>
          </div>
          
          {goals.slice(0, 2).map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={index} className="mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{goal.name}</span>
                  <span className="font-medium">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <ProgressBar 
                  percentage={progress} 
                  color="bg-primary" 
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                  <span>₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
          
          <button className="w-full btn btn-outline mt-3 py-1.5">View All Goals</button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get consistent random colors for categories
const getRandomColor = (category: string) => {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500'
  ];
  
  // Use the hash of the category name to get a consistent index
  const hash = category.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + acc;
  }, 0);
  
  return colors[hash % colors.length];
};

export default Dashboard;