'use client';

import Link from 'next/link';
import { useOptionalAuth } from '@/lib/auth';
import { Button } from '@/components/ui';
import { FeatureCards, defaultFeatures } from '@/components/FeatureCard';
import Layout from '@/components/Layout';

export default function Home() {
  const { isAuthenticated } = useOptionalAuth();

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Hero Section */}
        <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Title */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
                <span className="text-white text-2xl font-bold">保</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                保育ワーカー支援アプリ
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                保育士の皆様の日々の業務を効率化し、
                <br className="hidden sm:inline" />
                より良い保育環境づくりをサポートします
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4">
                    ダッシュボードへ
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 py-4">
                      無料で始める
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4">
                      ログイン
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                主要機能
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                日々の保育業務に必要な機能を一つのアプリに集約。
                効率的な業務運営をサポートします。
              </p>
            </div>

            {/* Feature Cards */}
            <FeatureCards 
              features={defaultFeatures}
              className="mb-12"
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                アプリの特徴
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">作業時間短縮</h3>
                <p className="text-gray-600">
                  テンプレートや定型文を活用して、文書作成時間を大幅に短縮できます。
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">品質向上</h3>
                <p className="text-gray-600">
                  統一されたフォーマットで、一貫性のある高品質な文書を作成できます。
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">モバイル対応</h3>
                <p className="text-gray-600">
                  スマートフォンやタブレットから、いつでもどこでも利用できます。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                今すぐ始めましょう
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                保育業務の効率化を実現し、子どもたちとの時間をより大切にしませんか？
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 hover:bg-gray-50">
                    無料で始める
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto px-8 py-4 text-white border-white hover:bg-blue-700">
                    既にアカウントをお持ちの方
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
