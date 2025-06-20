import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  className?: string;
  centered?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  text,
  className = '',
  centered = true,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };
  
  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };
  
  const containerClass = centered 
    ? 'flex flex-col items-center justify-center space-y-2' 
    : 'inline-flex items-center space-x-2';
    
  const renderSpinner = () => (
    <svg 
      className={`animate-spin ${sizeStyles[size]} text-blue-600`}
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-blue-600 rounded-full animate-pulse`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
  
  const renderPulse = () => (
    <div className={`${sizeStyles[size]} bg-blue-600 rounded-full animate-pulse`} />
  );
  
  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };
  
  return (
    <div className={`${containerClass} ${className}`}>
      {renderLoadingIndicator()}
      {text && (
        <span className={`text-gray-600 ${textSizeStyles[size]} ${centered ? 'text-center' : ''}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Overlay loading component for full-screen loading states
export interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  backdrop?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Loading...',
  backdrop = true,
}) => {
  if (!isVisible) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-black bg-opacity-50' : ''}`}>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <Loading size="lg" text={text} />
      </div>
    </div>
  );
};

export default Loading;