import React from 'react';
import { cn } from '../utils/cn';

export const Input = ({ className, icon: Icon, ...props }) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Icon size={18} />
        </div>
      )}
      <input
        className={cn(
          "block w-full rounded-lg border-white/20 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border px-4 py-2 bg-white/5 text-white placeholder:text-slate-400 outline-none transition-colors",
          Icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
};
