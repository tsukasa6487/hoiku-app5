'use client'

import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function DiaryPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      保育日誌作成
                    </h1>
                    <p className="text-gray-600">
                      日々の保育記録を効率的に作成・管理できます。
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Coming Soon Content */}
          <div className="mb-8">
            <Card variant="outlined" padding="lg">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  保育日誌作成機能
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  この機能は現在開発中です。Phase 2で実装予定の機能です。日々の保育記録や児童の成長記録を効率的に作成できます。
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500">
                    予定機能:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">日記テンプレート</div>
                      <div className="text-sm text-gray-600">よく使う記録形式を保存</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">写真添付</div>
                      <div className="text-sm text-gray-600">保育の様子を画像で記録</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">成長記録</div>
                      <div className="text-sm text-gray-600">児童の発達状況を記録</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">定型文利用</div>
                      <div className="text-sm text-gray-600">よく使う表現を自動入力</div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/dashboard">
                    <Button variant="outline">
                      ダッシュボードに戻る
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}