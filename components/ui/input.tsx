import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-lg border bg-white px-3 py-2.5 text-sm ring-offset-white text-gray-900
              placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600 animate-pulse">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';