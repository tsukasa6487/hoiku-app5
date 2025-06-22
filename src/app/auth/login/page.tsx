import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'ログイン | 保育支援アプリ',
  description: '保育支援アプリにログインしてください',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ホームに戻る
          </Link>
        </div>

        {/* App Logo/Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            保育支援アプリ
          </h1>
          <p className="text-sm text-gray-600">
            保育士の皆さまを支援するアプリケーションです
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              ログイン
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              アカウントにログインしてください
            </p>
          </div>

          <LoginForm />

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              アカウントをお持ちでない方は{' '}
              <Link 
                href="/register" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2024 保育支援アプリ. All rights reserved.
        </p>
      </div>
    </div>
  )
}