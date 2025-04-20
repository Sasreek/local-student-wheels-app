
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className, onClick }) => {
  return (
    <div 
      className={cn("app-logo text-2xl font-bold flex items-center", className)}
      onClick={onClick}
    >
      <span className="text-primary">Go</span>
      <span className="text-accent ml-1">Local</span>
    </div>
  );
};

export default Logo;
