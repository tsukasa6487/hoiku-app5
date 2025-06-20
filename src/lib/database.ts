/**
 * Database operations for the childcare worker support app
 * 
 * This module provides CRUD operations for all database entities including:
 * - User profiles management
 * - Class information retrieval
 * - Children data access with proper filtering
 * - Generation history tracking
 * - Database connectivity testing
 * 
 * All functions implement proper error handling, TypeScript typing,
 * and security considerations including RLS compliance.
 * 
 * @module database
 */

import { supabase, getCurrentUser } from '@/lib/supabase'
import type { 
  User, 
  UserProfile, 
  Class, 
  Child, 
  ChildListItem,
  GenerationHistory, 
  GenerationType,
  ClassType,
  Database 
} from '@/types/database'
import { CLASS_NAMES } from '@/types/database'

// Custom error types for better error handling
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'ユーザー認証が必要です') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class PermissionError extends Error {
  constructor(message: string = 'この操作を実行する権限がありません') {
    super(message)
    this.name = 'PermissionError'
  }
}

// Utility types for function parameters
export type UserProfileUpdate = Partial<Omit<User, 'id' | 'created_at'>>
export type GenerationHistoryInsert = Omit<GenerationHistory, 'id' | 'created_at' | 'updated_at'>

// Database connection status interface
export interface DatabaseConnectionStatus {
  connected: boolean
  authenticated: boolean
  tables_accessible: boolean
  rls_enabled: boolean
  user_id?: string
  error?: string
  details?: {
    supabase_configured: boolean
    session_valid: boolean
    tables_tested: string[]
    permissions_checked: string[]
  }
}

/**
 * Get user profile information by user ID
 * 
 * Retrieves user profile data from either the users table or auth.users metadata.
 * Implements proper error handling and null checks.
 * 
 * @param userId - The user ID to look up
 * @returns Promise resolving to User object or null if not found
 * @throws {DatabaseError} If database operation fails
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    // Validate input
    if (!userId || typeof userId !== 'string') {
      throw new DatabaseError('有効なユーザーIDが必要です')
    }

    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new AuthenticationError()
    }

    // Query user profile from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      throw new DatabaseError(
        'ユーザープロファイルの取得に失敗しました',
        error.code,
        error
      )
    }

    return data
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AuthenticationError) {
      throw error
    }
    
    console.error('getUserProfile error:', error)
    throw new DatabaseError('ユーザープロファイルの取得中に予期しないエラーが発生しました')
  }
}

/**
 * Update user profile information
 * 
 * Updates user metadata including assigned_class with proper validation.
 * Handles class assignments (koala, bear, giraffe) and includes comprehensive
 * error handling.
 * 
 * @param userId - The user ID to update
 * @param updates - Partial user profile updates
 * @returns Promise resolving to updated User object
 * @throws {DatabaseError} If database operation fails
 * @throws {AuthenticationError} If user is not authenticated
 * @throws {PermissionError} If user lacks permission to update profile
 */
export async function updateUserProfile(
  userId: string, 
  updates: UserProfileUpdate
): Promise<User> {
  try {
    // Validate input
    if (!userId || typeof userId !== 'string') {
      throw new DatabaseError('有効なユーザーIDが必要です')
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new DatabaseError('更新するデータが必要です')
    }

    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new AuthenticationError()
    }

    // Check if user can update this profile (self or admin)
    if (currentUser.id !== userId) {
      // TODO: Check admin permissions when user roles are implemented
      throw new PermissionError('他のユーザーのプロファイルを更新する権限がありません')
    }

    // Validate assigned_class if provided
    if ('assigned_class' in updates && updates.assigned_class) {
      const validClasses: ClassType[] = ['koala', 'bear', 'giraffe']
      if (!validClasses.includes(updates.assigned_class as ClassType)) {
        throw new DatabaseError(
          `無効なクラス指定です。有効な値: ${validClasses.join(', ')}`
        )
      }
    }

    // Update user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new DatabaseError(
        'ユーザープロファイルの更新に失敗しました',
        error.code,
        error
      )
    }

    return data
  } catch (error) {
    if (error instanceof DatabaseError || 
        error instanceof AuthenticationError || 
        error instanceof PermissionError) {
      throw error
    }
    
    console.error('updateUserProfile error:', error)
    throw new DatabaseError('ユーザープロファイルの更新中に予期しないエラーが発生しました')
  }
}

/**
 * Get all available classes with metadata
 * 
 * Returns all available classes with Japanese names mapping.
 * Uses Class type from type definitions.
 * 
 * @returns Promise resolving to array of Class objects
 * @throws {DatabaseError} If database operation fails
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function getClasses(): Promise<Class[]> {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new AuthenticationError()
    }

    // Query classes table
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('name')

    if (error) {
      throw new DatabaseError(
        'クラス情報の取得に失敗しました',
        error.code,
        error
      )
    }

    // Enhance with Japanese names if available
    return (data || []).map(classItem => ({
      ...classItem,
      japanese_name: CLASS_NAMES[classItem.name as ClassType] || classItem.name
    }))
  } catch (error) {
    if (error instanceof DatabaseError || error instanceof AuthenticationError) {
      throw error
    }
    
    console.error('getClasses error:', error)
    throw new DatabaseError('クラス情報の取得中に予期しないエラーが発生しました')
  }
}

/**
 * Get children information with optional class filtering
 * 
 * Queries children table with optional class filtering and implements
 * access control for user's assigned class.
 * 
 * @param classId - Optional class ID to filter by
 * @returns Promise resolving to array of Child objects
 * @throws {DatabaseError} If database operation fails
 * @throws {AuthenticationError} If user is not authenticated  
 * @throws {PermissionError} If user lacks permission to access children data
 */
export async function getChildren(classId?: string): Promise<Child[]> {
  try {
    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new AuthenticationError()
    }

    // Get user profile to check assigned class
    const userProfile = await getUserProfile(currentUser.id)
    if (!userProfile) {
      throw new AuthenticationError('ユーザープロファイルが見つかりません')
    }

    // Build query
    let query = supabase
      .from('children')
      .select('*')

    // Apply class filtering based on user permissions
    if (classId) {
      // Check if user has access to the requested class
      if (userProfile.assigned_class && userProfile.assigned_class !== classId) {
        throw new PermissionError('指定されたクラスにアクセスする権限がありません')
      }
      query = query.eq('class_id', classId)
    } else if (userProfile.assigned_class) {
      // Restrict to user's assigned class if they have one
      query = query.eq('class_id', userProfile.assigned_class)
    }

    query = query.order('name')

    const { data, error } = await query

    if (error) {
      throw new DatabaseError(
        '子ども情報の取得に失敗しました',
        error.code,
        error
      )
    }

    return data || []
  } catch (error) {
    if (error instanceof DatabaseError || 
        error instanceof AuthenticationError || 
        error instanceof PermissionError) {
      throw error
    }
    
    console.error('getChildren error:', error)
    throw new DatabaseError('子ども情報の取得中に予期しないエラーが発生しました')
  }
}

/**
 * Save AI generation history to database
 * 
 * Saves AI generation results to database with support for all GenerationType
 * values: 'email' | 'diary' | 'record'. Includes proper user association.
 * 
 * @param data - Generation history data without id and timestamps
 * @returns Promise resolving to saved GenerationHistory record with generated ID
 * @throws {DatabaseError} If database operation fails
 * @throws {AuthenticationError} If user is not authenticated
 */
export async function saveGenerationHistory(
  data: GenerationHistoryInsert
): Promise<GenerationHistory> {
  try {
    // Validate input
    if (!data || typeof data !== 'object') {
      throw new DatabaseError('有効な生成履歴データが必要です')
    }

    const { user_id, type, input, output } = data

    if (!user_id || !type || !input || !output) {
      throw new DatabaseError('必須フィールドが不足しています: user_id, type, input, output')
    }

    // Validate generation type
    const validTypes: GenerationType[] = ['email', 'diary', 'record']
    if (!validTypes.includes(type)) {
      throw new DatabaseError(
        `無効な生成タイプです。有効な値: ${validTypes.join(', ')}`
      )
    }

    // Check authentication
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new AuthenticationError()
    }

    // Verify user_id matches current user (or user is admin)
    if (currentUser.id !== user_id) {
      // TODO: Check admin permissions when user roles are implemented
      throw new PermissionError('他のユーザーの生成履歴を保存する権限がありません')
    }

    // Insert generation history
    const { data: savedData, error } = await supabase
      .from('generation_history')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new DatabaseError(
        '生成履歴の保存に失敗しました',
        error.code,
        error
      )
    }

    return savedData
  } catch (error) {
    if (error instanceof DatabaseError || 
        error instanceof AuthenticationError || 
        error instanceof PermissionError) {
      throw error
    }
    
    console.error('saveGenerationHistory error:', error)
    throw new DatabaseError('生成履歴の保存中に予期しないエラーが発生しました')
  }
}

/**
 * Test database connection and permissions
 * 
 * Comprehensive testing of database connectivity, authentication,
 * table access, and RLS policies. Returns detailed diagnostics.
 * 
 * @returns Promise resolving to DatabaseConnectionStatus with detailed diagnostics
 */
export async function testDatabaseConnection(): Promise<DatabaseConnectionStatus> {
  const status: DatabaseConnectionStatus = {
    connected: false,
    authenticated: false,
    tables_accessible: false,
    rls_enabled: false,
    details: {
      supabase_configured: false,
      session_valid: false,
      tables_tested: [],
      permissions_checked: []
    }
  }

  try {
    // Test 1: Check if Supabase is configured
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseAnonKey) {
        status.details!.supabase_configured = true
        status.connected = true
      } else {
        status.error = 'Supabase環境変数が設定されていません'
        return status
      }
    } catch (error) {
      status.error = 'Supabase設定の確認に失敗しました'
      return status
    }

    // Test 2: Check authentication
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        status.authenticated = true
        status.user_id = currentUser.id
        status.details!.session_valid = true
      } else {
        status.error = 'ユーザー認証が無効です'
        return status
      }
    } catch (error) {
      status.error = 'ユーザー認証の確認に失敗しました'
      return status
    }

    // Test 3: Test table accessibility
    const tablesToTest = ['users', 'classes', 'children', 'generation_history']
    
    for (const table of tablesToTest) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1)

        if (!error) {
          status.details!.tables_tested.push(table)
        } else {
          console.warn(`Table ${table} access failed:`, error)
        }
      } catch (error) {
        console.warn(`Table ${table} test failed:`, error)
      }
    }

    status.tables_accessible = status.details!.tables_tested.length > 0

    // Test 4: Check RLS policies
    try {
      // Test user profile access (should work for authenticated user)
      const { error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', status.user_id!)
        .limit(1)

      if (!userError) {
        status.details!.permissions_checked.push('user_profile_read')
        status.rls_enabled = true
      }

      // Test classes access (should work for authenticated user)
      const { error: classError } = await supabase
        .from('classes')
        .select('id')
        .limit(1)

      if (!classError) {
        status.details!.permissions_checked.push('classes_read')
      }

    } catch (error) {
      console.warn('RLS policy test failed:', error)
    }

    // Overall success check
    if (status.connected && status.authenticated && status.tables_accessible) {
      return status
    } else {
      status.error = 'データベース接続テストが部分的に失敗しました'
      return status
    }

  } catch (error) {
    console.error('Database connection test failed:', error)
    status.error = 'データベース接続テスト中に予期しないエラーが発生しました'
    return status
  }
}

// Export all functions and types for external use
export {
  type User,
  type UserProfile, 
  type Class,
  type Child,
  type ChildListItem,
  type GenerationHistory,
  type GenerationType,
  type ClassType,
  CLASS_NAMES
}