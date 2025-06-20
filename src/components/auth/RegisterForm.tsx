'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button, Input } from '@/components/ui'
import type { RegisterForm as RegisterFormType } from '@/types/auth'
import type { ClassType } from '@/types/database'
import { CLASS_NAMES } from '@/types/database'

// Zod validation schema for registration form
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは英大文字、英小文字、数字を含む必要があります'
    ),
  confirm_password: z
    .string()
    .min(1, 'パスワード確認を入力してください'),
  name: z
    .string()
    .min(1, 'お名前を入力してください')
    .min(2, 'お名前は2文字以上で入力してください')
    .max(50, 'お名前は50文字以内で入力してください'),
  assigned_class: z
    .string()
    .min(1, '担当クラスを選択してください')
    .refine((val) => Object.keys(CLASS_NAMES).includes(val), {
      message: '有効なクラスを選択してください'
    })
}).refine((data) => data.password === data.confirm_password, {
  message: 'パスワードが一致しません',
  path: ['confirm_password']
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      name: '',
      assigned_class: ''
    }
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const registerData: RegisterFormType = {
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        name: data.name,
        assigned_class: data.assigned_class
      }

      const result = await signUp(registerData)

      if (result.success && result.data) {
        setIsRegistered(true)
        
        // If email verification is needed, show success message
        if (result.data.needsVerification) {
          // Stay on the page to show verification message
          reset()
        } else {
          // User was automatically signed in, redirect to dashboard
          router.push('/dashboard')
        }
      } else {
        setSubmitError(result.error?.message || 'ユーザー登録に失敗しました')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setSubmitError('予期しないエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success message for email verification
  if (isRegistered) {
    return (
      <div className="text-center">
        <div className="rounded-md bg-green-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                ユーザー登録が完了しました！
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  メールアドレス宛に確認メールを送信しました。
                  メール内のリンクをクリックして、アカウントを有効化してください。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => {
              setIsRegistered(false)
              reset()
            }}
            variant="outline"
            className="w-full"
          >
            別のアカウントを登録
          </Button>
          
          <p className="text-sm text-gray-600">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              ログインページに戻る
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Message */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                登録エラー
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          お名前 <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="お名前を入力してください"
          {...register('name')}
          className={errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          {...register('email')}
          className={errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Assigned Class Field */}
      <div>
        <label htmlFor="assigned_class" className="block text-sm font-medium text-gray-700 mb-1">
          担当クラス <span className="text-red-500">*</span>
        </label>
        <select
          id="assigned_class"
          {...register('assigned_class')}
          className={`w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 transition-colors ${
            errors.assigned_class 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
          disabled={isSubmitting}
        >
          <option value="">クラスを選択してください</option>
          {Object.entries(CLASS_NAMES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        {errors.assigned_class && (
          <p className="mt-1 text-sm text-red-600">{errors.assigned_class.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          パスワード <span className="text-red-500">*</span>
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワードを入力してください"
          {...register('password')}
          className={errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          パスワードは8文字以上で、英大文字・英小文字・数字を含む必要があります
        </p>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
          パスワード確認 <span className="text-red-500">*</span>
        </label>
        <Input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワードをもう一度入力してください"
          {...register('confirm_password')}
          className={errors.confirm_password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
        />
        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting || !isValid}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              登録中...
            </>
          ) : (
            'ユーザー登録'
          )}
        </Button>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちですか？{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            ログイン
          </Link>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm