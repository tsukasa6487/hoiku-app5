'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import type { 
  AuthUser, 
  AuthSession, 
  LoginForm, 
  RegisterForm, 
  ResetPasswordForm, 
  ChangePasswordForm,
  AuthResponse 
} from '@/types/auth'

// Auth Context Interface
interface AuthContextType {
  // State
  user: AuthUser | null
  session: AuthSession | null
  loading: boolean
  
  // Authentication methods
  signIn: (credentials: LoginForm) => Promise<AuthResponse<AuthSession>>
  signUp: (credentials: RegisterForm) => Promise<AuthResponse<{ user: AuthUser; needsVerification: boolean }>>
  signOut: () => Promise<AuthResponse<void>>
  resetPassword: (data: ResetPasswordForm) => Promise<AuthResponse<void>>
  changePassword: (data: ChangePasswordForm) => Promise<AuthResponse<void>>
  
  // Session management
  refreshSession: () => Promise<void>
  clearAuth: () => void
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to convert Supabase User to AuthUser
const convertToAuthUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email || '',
  name: user.user_metadata?.name || user.email?.split('@')[0] || '',
  avatar_url: user.user_metadata?.avatar_url,
  assigned_class: user.user_metadata?.assigned_class,
  role: user.user_metadata?.role || 'teacher',
  email_verified: user.email_confirmed_at ? true : false,
  created_at: new Date(user.created_at),
  updated_at: new Date(user.updated_at || user.created_at),
})

// Helper function to convert Supabase Session to AuthSession
const convertToAuthSession = (session: Session): AuthSession => ({
  user: convertToAuthUser(session.user),
  access_token: session.access_token,
  refresh_token: session.refresh_token,
  expires_at: new Date(session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000),
  session_id: session.access_token, // Using access_token as session identifier
})

// Helper function to handle auth errors
const handleAuthError = (error: AuthError | Error): AuthResponse<never> => {
  console.error('Auth error:', error)
  
  let message = 'An unexpected error occurred'
  let code = 'unknown_error'
  
  if ('message' in error) {
    message = error.message
  }
  
  if ('status' in error) {
    code = error.status?.toString() || code
  }
  
  // Handle common Supabase auth errors
  if (message.includes('Invalid login credentials')) {
    message = 'Invalid email or password'
    code = 'invalid_credentials'
  } else if (message.includes('User already registered')) {
    message = 'An account with this email already exists'
    code = 'user_exists'
  } else if (message.includes('Password should be')) {
    message = 'Password must be at least 6 characters long'
    code = 'weak_password'
  } else if (message.includes('Email not confirmed')) {
    message = 'Please check your email and click the confirmation link'
    code = 'email_not_confirmed'
  }
  
  return {
    success: false,
    error: { message, code }
  }
}

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession) {
          const authSession = convertToAuthSession(currentSession)
          setSession(authSession)
          setUser(authSession.user)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeAuth()
  }, [])
  
  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event)
        
        if (currentSession) {
          const authSession = convertToAuthSession(currentSession)
          setSession(authSession)
          setUser(authSession.user)
        } else {
          setSession(null)
          setUser(null)
        }
        
        setLoading(false)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  // Sign in function
  const signIn = useCallback(async (credentials: LoginForm): Promise<AuthResponse<AuthSession>> => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      
      if (error) {
        return handleAuthError(error)
      }
      
      if (!data.session) {
        return {
          success: false,
          error: { message: 'No session returned from sign in', code: 'no_session' }
        }
      }
      
      const authSession = convertToAuthSession(data.session)
      
      return {
        success: true,
        data: authSession
      }
    } catch (error) {
      return handleAuthError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Sign up function
  const signUp = useCallback(async (credentials: RegisterForm): Promise<AuthResponse<{ user: AuthUser; needsVerification: boolean }>> => {
    try {
      setLoading(true)
      
      if (credentials.password !== credentials.confirm_password) {
        return {
          success: false,
          error: { message: 'Passwords do not match', code: 'password_mismatch', field: 'confirm_password' }
        }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            assigned_class: credentials.assigned_class,
            role: 'teacher'
          }
        }
      })
      
      if (error) {
        return handleAuthError(error)
      }
      
      if (!data.user) {
        return {
          success: false,
          error: { message: 'No user returned from sign up', code: 'no_user' }
        }
      }
      
      const authUser = convertToAuthUser(data.user)
      const needsVerification = !data.session // If no session, email verification is required
      
      return {
        success: true,
        data: { user: authUser, needsVerification }
      }
    } catch (error) {
      return handleAuthError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Sign out function
  const signOut = useCallback(async (): Promise<AuthResponse<void>> => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return handleAuthError(error)
      }
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      // Clear authentication cookies
      if (typeof window !== 'undefined') {
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      }
      
      return { success: true }
    } catch (error) {
      return handleAuthError(error as Error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Reset password function
  const resetPassword = useCallback(async (data: ResetPasswordForm): Promise<AuthResponse<void>> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) {
        return handleAuthError(error)
      }
      
      return { success: true }
    } catch (error) {
      return handleAuthError(error as Error)
    }
  }, [])
  
  // Change password function
  const changePassword = useCallback(async (data: ChangePasswordForm): Promise<AuthResponse<void>> => {
    try {
      if (data.new_password !== data.confirm_password) {
        return {
          success: false,
          error: { message: 'New passwords do not match', code: 'password_mismatch', field: 'confirm_password' }
        }
      }
      
      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      })
      
      if (error) {
        return handleAuthError(error)
      }
      
      return { success: true }
    } catch (error) {
      return handleAuthError(error as Error)
    }
  }, [])
  
  // Refresh session function
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        return
      }
      
      if (data.session) {
        const authSession = convertToAuthSession(data.session)
        setSession(authSession)
        setUser(authSession.user)
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
    }
  }, [])
  
  // Clear auth function
  const clearAuth = useCallback((): void => {
    setUser(null)
    setSession(null)
    setLoading(false)
  }, [])
  
  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    changePassword,
    refreshSession,
    clearAuth,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for checking if user is authenticated
export const useRequireAuth = (): AuthUser => {
  const { user, loading } = useAuth()
  
  if (loading) {
    throw new Error('Authentication is still loading')
  }
  
  if (!user) {
    throw new Error('User must be authenticated to access this resource')
  }
  
  return user
}

// Hook for conditional authentication
export const useOptionalAuth = (): { user: AuthUser | null; isAuthenticated: boolean } => {
  const { user } = useAuth()
  
  return {
    user,
    isAuthenticated: !!user
  }
}