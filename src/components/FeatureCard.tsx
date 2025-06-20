'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';

// Feature card data interface
export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  disabled?: boolean;
}

// Feature card component props interface
export interface FeatureCardProps {
  feature: FeatureCardData;
  className?: string;
  onClick?: () => void;
}

// Feature card component
const FeatureCard: React.FC<FeatureCardProps> = ({ 
  feature, 
  className = '',
  onClick 
}) => {
  const cardContent = (
    <Card 
      variant="outlined" 
      padding="lg"
      className={`h-full transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        feature.disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:border-blue-300'
      } ${className}`}
    >
      <CardContent className="flex flex-col items-center text-center space-y-4 p-6">
        {/* Icon */}
        <div 
          className={`w-16 h-16 rounded-full flex items-center justify-center ${feature.color}`}
          aria-hidden="true"
        >
          <div className="w-8 h-8 text-white">
            {feature.icon}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Arrow indicator */}
        {!feature.disabled && (
          <div className="pt-2">
            <svg 
              className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (feature.disabled) {
    return (
      <div className={className} onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link 
      href={feature.href}
      className={`block group ${className}`}
      onClick={onClick}
      aria-label={`${feature.title}へ移動`}
    >
      {cardContent}
    </Link>
  );
};

// Feature cards container component
export interface FeatureCardsProps {
  features: FeatureCardData[];
  className?: string;
  onFeatureClick?: (featureId: string) => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({ 
  features, 
  className = '',
  onFeatureClick 
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          onClick={() => onFeatureClick?.(feature.id)}
        />
      ))}
    </div>
  );
};

// Predefined feature configurations
export const defaultFeatures: FeatureCardData[] = [
  {
    id: 'email',
    title: 'メール文作成',
    description: '保護者への連絡メールを簡単に作成できます。テンプレートを使って効率的に作業を進められます。',
    href: '/email',
    color: 'bg-blue-500',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'diary',
    title: '保育日誌作成',
    description: '日々の保育記録を効率的に作成・管理できます。写真の添付や定型文の利用で時間を短縮できます。',
    href: '/diary',
    color: 'bg-green-500',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'records',
    title: '児童票作成',
    description: '児童の成長記録や観察記録を整理して管理できます。データの整理と共有が簡単になります。',
    href: '/records',
    color: 'bg-purple-500',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
];

export default FeatureCard;