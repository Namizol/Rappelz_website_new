import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

export function LoadingSpinner({ 
  size = 24, 
  className = '',
  color = 'text-yellow-500'
}: LoadingSpinnerProps) {
  return (
    <div role="status" className="flex items-center justify-center">
      <Loader2 
        className={`animate-spin ${color} ${className}`}
        size={size}
        aria-hidden="true"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}