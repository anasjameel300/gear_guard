import React from 'react';
import { Wrench } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="mb-8 flex flex-col items-center">
        <div className="h-16 w-16 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
          <Wrench className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">GearGuard</h1>
        <p className="text-gray-500 font-medium mt-1">The Ultimate Maintenance Tracker</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">{title}</h2>
          <p className="text-gray-500 text-center mb-8">{subtitle}</p>
          {children}
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} GearGuard Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};