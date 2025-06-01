import { Transaction, Budget, Goal, Investment, Category } from '../types/finance';

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Freelance', type: 'income' },
  { id: '3', name: 'Investments', type: 'income' },
  { id: '4', name: 'Other Income', type: 'income' },
  { id: '5', name: 'Groceries', type: 'expense' },
  { id: '6', name: 'Dining Out', type: 'expense' },
  { id: '7', name: 'Shopping', type: 'expense' },
  { id: '8', name: 'Entertainment', type: 'expense' },
  { id: '9', name: 'Utilities', type: 'expense' },
  { id: '10', name: 'Rent', type: 'expense' },
  { id: '11', name: 'Travel', type: 'expense' },
  { id: '12', name: 'Health', type: 'expense' },
  { id: '13', name: 'Education', type: 'expense' },
  { id: '14', name: 'Transportation', type: 'expense' },
  { id: '15', name: 'Subscriptions', type: 'expense' },
  { id: '16', name: 'Gifts', type: 'both' },
  { id: '17', name: 'Miscellaneous', type: 'both' }
];

// Mock Transactions
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: today.toISOString(),
    amount: 500,
    description: 'Lunch with colleagues',
    category: 'Dining Out',
    type: 'expense',
    paymentMethod: 'credit'
  },
  {
    id: '2',
    date: today.toISOString(),
    amount: 2000,
    description: 'Grocery shopping',
    category: 'Groceries',
    type: 'expense',
    paymentMethod: 'upi'
  },
  {
    id: '3',
    date: yesterday.toISOString(),
    amount: 200,
    description: 'Coffee shop',
    category: 'Dining Out',
    type: 'expense',
    paymentMethod: 'cash'
  },
  {
    id: '4',
    date: yesterday.toISOString(),
    amount: 1500,
    description: 'New headphones',
    category: 'Shopping',
    type: 'expense',
    paymentMethod: 'debit'
  },
  {
    id: '5',
    date: twoDaysAgo.toISOString(),
    amount: 3000,
    description: 'Electricity bill',
    category: 'Utilities',
    type: 'expense',
    paymentMethod: 'netbanking'
  },
  {
    id: '6',
    date: twoDaysAgo.toISOString(),
    amount: 800,
    description: 'Movie and dinner',
    category: 'Entertainment',
    type: 'expense',
    paymentMethod: 'credit'
  },
  {
    id: '7',
    date: lastWeek.toISOString(),
    amount: 70000,
    description: 'Monthly salary',
    category: 'Salary',
    type: 'income',
    paymentMethod: 'netbanking'
  },
  {
    id: '8',
    date: lastWeek.toISOString(),
    amount: 18000,
    description: 'Rent payment',
    category: 'Rent',
    type: 'expense',
    paymentMethod: 'netbanking'
  },
  {
    id: '9',
    date: lastMonth.toISOString(),
    amount: 5000,
    description: 'Freelance project',
    category: 'Freelance',
    type: 'income',
    paymentMethod: 'netbanking'
  }
];

// Mock Budgets
export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    limit: 8000,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'Dining Out',
    limit: 5000,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'Entertainment',
    limit: 3000,
    period: 'monthly'
  },
  {
    id: '4',
    category: 'Shopping',
    limit: 7000,
    period: 'monthly'
  },
  {
    id: '5',
    category: 'Transportation',
    limit: 4000,
    period: 'monthly'
  }
];

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 300000,
    currentAmount: 120000,
    targetDate: new Date(today.getFullYear(), today.getMonth() + 6, 1).toISOString(),
    description: 'Build a 3-month emergency fund for unexpected expenses',
    createdAt: lastMonth.toISOString()
  },
  {
    id: '2',
    name: 'Vacation Trip',
    targetAmount: 100000,
    currentAmount: 35000,
    targetDate: new Date(today.getFullYear(), today.getMonth() + 4, 1).toISOString(),
    description: 'Save for a vacation to Goa',
    createdAt: lastMonth.toISOString()
  },
  {
    id: '3',
    name: 'New Laptop',
    targetAmount: 80000,
    currentAmount: 15000,
    targetDate: new Date(today.getFullYear(), today.getMonth() + 8, 1).toISOString(),
    createdAt: lastMonth.toISOString()
  }
];

// Mock Investments
export const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'HDFC Bank Ltd.',
    type: 'stock',
    amount: 50000,
    currentValue: 63500,
    purchaseDate: new Date(today.getFullYear() - 1, today.getMonth(), 15).toISOString()
  },
  {
    id: '2',
    name: 'Axis Bluechip Fund',
    type: 'mutualFund',
    amount: 100000,
    currentValue: 112000,
    purchaseDate: new Date(today.getFullYear() - 1, today.getMonth() - 6, 10).toISOString()
  },
  {
    id: '3',
    name: 'SBI Fixed Deposit',
    type: 'fd',
    amount: 200000,
    currentValue: 214000,
    purchaseDate: new Date(today.getFullYear() - 1, today.getMonth() - 8, 5).toISOString(),
    notes: '7% interest rate, 2-year term'
  }
];