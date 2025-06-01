import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  color = 'bg-primary', 
  height = 'h-2'
}) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
      <div 
        className={`${color} ${height} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${safePercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;