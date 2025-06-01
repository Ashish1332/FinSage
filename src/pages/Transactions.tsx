import React, { useState } from 'react';
import { Search, Filter, Download, Trash2, Edit2 } from 'lucide-react';
import { useFinance } from '../contexts/FinanceContext';
import { useToast } from '../contexts/ToastContext';
import { Transaction } from '../types/finance';
import TransactionList from '../components/transactions/TransactionList';
import AddTransactionModal from '../components/transactions/AddTransactionModal';

const Transactions: React.FC = () => {
  const { transactions, deleteTransaction } = useFinance();
  const { addToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))];
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Transaction type filter
    const matchesType = 
      filterType === 'all' || 
      transaction.type === filterType;
    
    // Category filter
    const matchesCategory = 
      filterCategory === '' || 
      transaction.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Handle delete transaction
  const handleDelete = (transaction: Transaction) => {
    if (confirm(`Are you sure you want to delete "${transaction.description}"?`)) {
      deleteTransaction(transaction.id);
      addToast('Transaction deleted successfully', 'success');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Actions and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {/* Transaction type filter */}
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="form-input pl-10 pr-8"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="form-input"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          
          {/* Export button */}
          <button className="btn btn-outline flex items-center">
            <Download size={18} className="mr-1" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          {/* Add transaction button */}
          <button 
            onClick={() => setIsAddModalOpen(true)} 
            className="btn btn-primary"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Transactions card */}
      <div className="card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-semibold">All Transactions</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {/* Transaction table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.paymentMethod}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(transaction.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    transaction.type === 'income' ? 'text-success' : 'text-error'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-gray-500 hover:text-primary">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="p-1 text-gray-500 hover:text-error"
                        onClick={() => handleDelete(transaction)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No transactions found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Transactions;