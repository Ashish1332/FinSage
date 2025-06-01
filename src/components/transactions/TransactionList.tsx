import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction } from '../../types/finance';
import { formatDate } from '../../utils/dateUtils';

interface TransactionListProps {
  transactions: Transaction[];
  showDate?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  showDate = true
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No transactions found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {transactions.map(transaction => (
        <div 
          key={transaction.id} 
          className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {/* Transaction icon and details */}
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-full
              ${transaction.type === 'income' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}
            `}>
              {transaction.type === 'income' 
                ? <ArrowUpRight size={16} /> 
                : <ArrowDownRight size={16} />}
            </div>
            
            <div>
              <div className="font-medium">{transaction.description}</div>
              <div className="flex text-xs text-gray-500 dark:text-gray-400 space-x-2">
                <span>{transaction.category}</span>
                {showDate && (
                  <>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Amount */}
          <div className={`font-medium ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;