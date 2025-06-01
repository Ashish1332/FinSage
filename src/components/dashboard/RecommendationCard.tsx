import React from 'react';
import { Lightbulb } from 'lucide-react';

interface RecommendationCardProps {
  text: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ text }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 relative">
      <div className="flex space-x-3">
        <div className="mt-0.5 flex-shrink-0">
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-1.5">
            <Lightbulb size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;