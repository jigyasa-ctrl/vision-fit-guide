
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MacroProgressBarProps {
  macroName: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
}

const MacroProgressBar: React.FC<MacroProgressBarProps> = ({
  macroName,
  current,
  target,
  unit = 'g',
  color = 'bg-fit-blue'
}) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{macroName}</span>
        <span>
          {current}/{target} {unit}
        </span>
      </div>
      <Progress value={percentage} className={`h-2 ${color}`} />
    </div>
  );
};

export default MacroProgressBar;
