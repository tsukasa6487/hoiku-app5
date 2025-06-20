'use client';

import React from 'react';
import { useOptionalAuth } from '@/lib/auth';
import Header from './Header';
import Navigation from './Navigation';

// Layout component props interface
export interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  className?: string;
}

// Main application layout component
const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavigation = true,
  className = '' 
}) => {
  const { isAuthenticated } = useOptionalAuth();

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* Header */}
      <Header />
      
      {/* Main content area with navigation */}
      <div className="flex flex-1">
        {/* Navigation - only show if authenticated and showNavigation is true */}
        {isAuthenticated && showNavigation && (
          <Navigation />
        )}
        
        {/* Main content */}
        <main 
          className={`flex-1 ${
            isAuthenticated && showNavigation 
              ? 'lg:ml-0' // Navigation handles its own spacing on larger screens
              : ''
          }`}
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <footer 
        className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8"
        role="contentinfo"
        aria-label="Footer"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-2 sm:mb-0">
              <span>保育ワーカー支援アプリ</span>
            </div>
            <div className="flex space-x-4">
              <span>© 2024 Childcare Support App</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;