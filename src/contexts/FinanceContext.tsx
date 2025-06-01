import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, Goal, Investment, Category } from '../types/finance';
import { useAuth } from './AuthContext';
import { mockTransactions, mockBudgets, mockGoals, mockInvestments, mockCategories } from '../data/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  investments: Investment[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id' | 'purchaseDate'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  getAIRecommendations: () => string[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getBudgetStatus: (category: string) => { spent: number, limit: number, percentage: number };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [categories] = useState<Category[]>(mockCategories);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      // In a real app, we would fetch from an API
      // For now, we'll use mock data
      setTransactions(mockTransactions);
      setBudgets(mockBudgets);
      setGoals(mockGoals);
      setInvestments(mockInvestments);
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setBudgets([]);
      setGoals([]);
      setInvestments([]);
    }
  }, [user]);

  // Transactions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...transaction } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Budgets
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Math.random().toString(36).substring(2, 9)
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    setBudgets(prev => 
      prev.map(b => b.id === id ? { ...b, ...budget } : b)
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Goals
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, goal: Partial<Goal>) => {
    setGoals(prev => 
      prev.map(g => g.id === id ? { ...g, ...goal } : g)
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Investments
  const addInvestment = (investment: Omit<Investment, 'id' | 'purchaseDate'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: Math.random().toString(36).substring(2, 9),
      purchaseDate: new Date().toISOString()
    };
    setInvestments(prev => [...prev, newInvestment]);
  };

  const updateInvestment = (id: string, investment: Partial<Investment>) => {
    setInvestments(prev => 
      prev.map(i => i.id === id ? { ...i, ...investment } : i)
    );
  };

  const deleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  };

  // Analytics functions
  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getBudgetStatus = (category: string) => {
    const budget = budgets.find(b => b.category === category);
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const limit = budget?.limit || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return { spent, limit, percentage };
  };

  // AI Recommendations (mock)
  const getAIRecommendations = () => {
    // In a real app, this would call an AI service
    const recommendations = [
      "Based on your spending pattern, you could save ₹5,000 by reducing dining out expenses.",
      "You've spent 85% of your entertainment budget already. Consider planning free activities for the rest of the month.",
      "Your electricity bill is higher than average. Consider energy-saving measures to reduce costs.",
      "You have ₹50,000 in your savings account. Consider investing in a fixed deposit for better returns.",
      "Based on your income, you should aim to save at least ₹15,000 per month for your emergency fund."
    ];
    return recommendations;
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      goals,
      investments,
      categories,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      addInvestment,
      updateInvestment,
      deleteInvestment,
      getAIRecommendations,
      getTotalIncome,
      getTotalExpenses,
      getBalance,
      getBudgetStatus
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};