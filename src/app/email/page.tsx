'use client'

import React from 'react'
import type { Metadata } from 'next'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader } from '@/components/ui'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function EmailPage() {
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
                      メール文作成
                    </h1>
                    <p className="text-gray-600">
                      保護者への連絡メールを効率的に作成できます。
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  メール作成機能
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  この機能は現在開発中です。Phase 2で実装予定の機能です。テンプレート機能や保護者情報との連携機能を提供します。
                </p>
                <div className="space-y-4">
                  <div className="text-sm text-gray-500">
                    予定機能:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">テンプレート機能</div>
                      <div className="text-sm text-gray-600">よく使う文例を保存・利用</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">保護者情報連携</div>
                      <div className="text-sm text-gray-600">児童情報に基づく自動入力</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">下書き保存</div>
                      <div className="text-sm text-gray-600">作成途中の保存・復元</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-700 mb-1">送信履歴</div>
                      <div className="text-sm text-gray-600">過去のメール履歴管理</div>
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