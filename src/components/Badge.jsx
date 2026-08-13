import React from 'react';
import { cn } from '../utils/cn';

export const Badge = ({ children, status = 'default', className }) => {
  const statuses = {
    default: "bg-white/5 text-slate-200",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    primary: "bg-amber-500/20 text-amber-400"
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statuses[status], className)}>
      {children}
    </span>
  );
};
