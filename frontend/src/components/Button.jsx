import React from 'react';
import { cn } from '../utils/cn';

export const Button = ({ children, variant = 'primary', size = 'default', className, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 shadow-lg shadow-black/50',
    secondary: 'bg-white/10 border border-white/15 text-white hover:bg-white/20',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    ghost: 'text-white/70 hover:bg-white/10 hover:text-white',
    danger: 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
  };

  return (
    <button 
      className={cn(base, sizes[size] || sizes.default, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
