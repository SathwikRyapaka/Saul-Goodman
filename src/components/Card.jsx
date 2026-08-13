import React from 'react';
import { cn } from '../utils/cn';

export const Card = ({ children, className, ...props }) => {
  return (
    <div className={cn("glass-card rounded-xl shadow-lg border border-white/10 overflow-hidden p-6 text-white", className)} {...props}>
      {children}
    </div>
  );
};
