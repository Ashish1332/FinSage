import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { useToast } from '../../contexts/ToastContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, categories } = useFinance();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'cash',
    type: 'expense'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    // Convert amount to number
    const amount = parseFloat(formData.amount);
    
    addTransaction({
      amount,
      description: formData.description,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      type: formData.type as 'income' | 'expense'
    });

    addToast(`${formData.type === 'income' ? 'Income' : 'Expense'} added successfully`, 'success');
    
    // Reset form and close modal
    setFormData({
      amount: '',
      description: '',
      category: '',
      paymentMethod: 'cash',
      type: 'expense'
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  // Filter categories based on transaction type
  const filteredCategories = categories
    .filter(category => category.type === formData.type || category.type === 'both');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-4 overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {/* Transaction Type */}
          <div className="mb-4">
            <div className="flex rounded-md overflow-hidden">
              <label className={`flex-1 text-center py-2 cursor-pointer transition-colors ${formData.type === 'expense' ? 'bg-error text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                  className="sr-only"
                />
                Expense
              </label>
              <label className={`flex-1 text-center py-2 cursor-pointer transition-colors ${formData.type === 'income' ? 'bg-success text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                  className="sr-only"
                />
                Income
              </label>
            </div>
          </div>
          
          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              placeholder="0.00"
              required
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              placeholder="What was this for?"
              required
            />
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="form-input"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full btn btn-primary py-2.5"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;