
import React from 'react';

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

const CalorieRing: React.FC<CalorieRingProps> = ({ 
  consumed, 
  target, 
  size = 200,
  strokeWidth = 12 
}) => {
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((consumed / target) * 100, 100);
  const dashoffset = circumference - (percentage / 100) * circumference;
  
  // Determine color based on percentage
  let progressColor;
  if (percentage <= 50) {
    progressColor = 'stroke-fit-green';
  } else if (percentage <= 80) {
    progressColor = 'stroke-amber-500';
  } else if (percentage <= 100) {
    progressColor = 'stroke-fit-blue';
  } else {
    progressColor = 'stroke-red-500';
  }
  
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className={progressColor}
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      
      {/* Text in center */}
      <div className="absolute flex flex-col items-center justify-center">
        <p className="text-lg font-bold">{consumed} / {target}</p>
        <p className="text-xs text-muted-foreground">calories</p>
      </div>
    </div>
  );
};

export default CalorieRing;
