
import React from 'react';

export const getProgressColor = (percent: number): string => {
  if (percent <= 40) return 'bg-stone-300'; 
  if (percent <= 75) return 'bg-stone-600'; 
  return 'bg-black'; 
};

interface ProgressBarProps {
  progress: number;
  showText?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  showText = true, 
  className = "",
  size = 'md' 
}) => {
  const colorClass = getProgressColor(progress);
  
  const height = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  return (
    <div className={`w-full ${className} font-normal`}>
      {showText && (
        <div className="flex justify-between items-center mb-1.5 text-[11px] text-stone-400 font-normal">
          <span className="font-normal">{progress}% completion</span>
          {progress >= 100 && <span className="text-black font-normal">Secure</span>}
        </div>
      )}
      <div className={`w-full bg-stone-100 dark:bg-stone-800 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`${height} ${colorClass} transition-all duration-700 ease-in-out rounded-full`} 
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
