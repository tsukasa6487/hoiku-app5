'use client'

import React from 'react'
import { useAuth } from '@/lib/auth'
import Layout from '@/components/Layout'
import { FeatureCards, defaultFeatures } from '@/components/FeatureCard'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { Loading } from '@/components/ui'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loading size="lg" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Card variant="outlined" padding="lg">
            <CardContent className="text-center">
              <p className="text-gray-600">ログインしてください</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  // Get current time for greeting
  const currentHour = new Date().getHours()
  const getGreeting = () => {
    if (currentHour < 12) return 'おはようございます'
    if (currentHour < 18) return 'こんにちは'
    return 'お疲れ様です'
  }

  const handleFeatureClick = (featureId: string) => {
    // Analytics or tracking could be added here
    console.log(`Feature clicked: ${featureId}`)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {getGreeting()}、{user.name}さん
                  </h1>
                  <p className="text-gray-600">
                    今日も一日よろしくお願いします。
                  </p>
                </div>
                
                {/* User info badge */}
                <div className="flex-shrink-0">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-lg font-bold">
                            {user.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {user.name}
                        </p>
                        {user.assigned_class && (
                          <p className="text-xs text-blue-700">
                            {user.assigned_class}
                          </p>
                        )}
                        <p className="text-xs text-blue-600">
                          {user.role === 'teacher' ? '先生' : user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="outlined" padding="md" className="text-center">
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                  <div className="text-sm text-gray-600">今日の機能</div>
                </CardContent>
              </Card>
              
              <Card variant="outlined" padding="md" className="text-center">
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {user.assigned_class || '未設定'}
                  </div>
                  <div className="text-sm text-gray-600">担当クラス</div>
                </CardContent>
              </Card>
              
              <Card variant="outlined" padding="md" className="text-center">
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {new Date().getMonth() + 1}月
                  </div>
                  <div className="text-sm text-gray-600">今月</div>
                </CardContent>
              </Card>
              
              <Card variant="outlined" padding="md" className="text-center">
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {new Date().getDate()}日
                  </div>
                  <div className="text-sm text-gray-600">今日</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Features Section */}
          <div className="mb-8">
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  主な機能
                </h2>
                <p className="text-gray-600">
                  日々の保育業務を効率化するためのツールです。
                </p>
              </CardHeader>
              <CardContent>
                <FeatureCards 
                  features={defaultFeatures}
                  onFeatureClick={handleFeatureClick}
                  className="mt-6"
                />
              </CardContent>
            </Card>
          </div>

          {/* User Profile Section */}
          <div className="mb-8">
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  プロフィール情報
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">基本情報</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">お名前</span>
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">メールアドレス</span>
                        <span className="text-sm font-medium text-gray-900">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">役割</span>
                        <span className="text-sm font-medium text-gray-900">
                          {user.role === 'teacher' ? '先生' : user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">担当情報</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">担当クラス</span>
                        <span className="text-sm font-medium text-gray-900">
                          {user.assigned_class || '未設定'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">アカウント作成日</span>
                        <span className="text-sm font-medium text-gray-900">
                          {user.created_at.toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">認証状況</span>
                        <span className={`text-sm font-medium ${
                          user.email_verified ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {user.email_verified ? '確認済み' : '未確認'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Section */}
          <div className="mb-8">
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  クイックアクション
                </h2>
                <p className="text-gray-600">
                  よく使用する機能へのショートカットです。
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  <button className="p-4 text-left bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-900">新規メール作成</h3>
                        <p className="text-xs text-blue-700">保護者への連絡</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="p-4 text-left bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-green-900">今日の日誌</h3>
                        <p className="text-xs text-green-700">保育記録作成</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="p-4 text-left bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-purple-900">児童票確認</h3>
                        <p className="text-xs text-purple-700">記録管理</p>
                      </div>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}