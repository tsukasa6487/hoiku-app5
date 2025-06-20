'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOptionalAuth, useAuth } from '@/lib/auth';
import { Button } from '@/components/ui';

// Header component props interface
export interface HeaderProps {
  className?: string;
}

// Header component
const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, isAuthenticated } = useOptionalAuth();
  const { signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        setIsUserMenuOpen(false);
        // Redirect to home page after logout
        window.location.href = '/';
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header 
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}
      role="banner"
      aria-label="Main header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              aria-label="Go to home page"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">保</span>
              </div>
              <span className="hidden sm:inline">保育ワーカー支援</span>
              <span className="sm:hidden">保育支援</span>
            </Link>
          </div>

          {/* Right side - Auth section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              /* Authenticated user menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-2 hover:bg-gray-50 transition-colors"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  {/* User avatar or initial */}
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  {/* User name - hidden on mobile */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-gray-900 font-medium">{user.name}</span>
                    {user.assigned_class && (
                      <span className="text-gray-500 text-xs">{user.assigned_class}</span>
                    )}
                  </div>
                  
                  {/* Dropdown arrow */}
                  <svg 
                    className="w-4 h-4 text-gray-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-1">
                      {/* User info - mobile only */}
                      <div className="md:hidden px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.assigned_class && (
                          <p className="text-xs text-gray-500">{user.assigned_class}</p>
                        )}
                      </div>
                      
                      {/* Profile link */}
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        プロフィール設定
                      </Link>
                      
                      {/* Settings link */}
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        設定
                      </Link>
                      
                      {/* Divider */}
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      {/* Logout button */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not authenticated - show login/register buttons */
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    ログイン
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    variant="primary" 
                    size="sm"
                  >
                    新規登録
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
          aria-label="Close user menu"
        ></div>
      )}
    </header>
  );
};

export default Header;