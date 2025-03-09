
import React from 'react';
import { Link } from 'react-router-dom';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {(title || description) && (
          <div className="mb-6">
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {description && <p className="text-gray-500 mt-2">{description}</p>}
          </div>
        )}
        {children}
        <div className="mt-6 text-center text-sm">
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="text-primary hover:underline">
              Sign In
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
