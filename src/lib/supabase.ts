import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Custom storage for Supabase client that syncs with cookies
const customStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    
    // Try localStorage first
    try {
      const item = window.localStorage.getItem(key)
      if (item) return item
    } catch (error) {
      console.warn('Failed to access localStorage:', error)
    }
    
    // Fallback to cookies for session tokens
    if (key.includes('auth-token')) {
      const cookies = document.cookie.split(';')
      const cookieName = key.includes('access') ? 'sb-access-token' : 'sb-refresh-token'
      const cookie = cookies.find(c => c.trim().startsWith(`${cookieName}=`))
      return cookie ? decodeURIComponent(cookie.split('=')[1]) : null
    }
    
    return null
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    
    // Store in localStorage
    try {
      window.localStorage.setItem(key, value)
    } catch (error) {
      console.warn('Failed to set localStorage:', error)
    }
    
    // Also store session tokens in cookies for middleware access
    if (key.includes('auth-token')) {
      const cookieName = key.includes('access') ? 'sb-access-token' : 'sb-refresh-token'
      const maxAge = key.includes('access') ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 30 // 7 days for access, 30 for refresh
      document.cookie = `${cookieName}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return
    
    // Remove from localStorage
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
    
    // Also remove from cookies
    if (key.includes('auth-token')) {
      const cookieName = key.includes('access') ? 'sb-access-token' : 'sb-refresh-token'
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
    }
  }
}

// Create Supabase client with TypeScript support
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? customStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Export the client type for use in other files
export type SupabaseClient = typeof supabase

// Helper function to check if the client is properly initialized
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to get the current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Failed to get current session:', error)
    return null
  }
}

// Helper function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}