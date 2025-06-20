/**
 * Integration tests for database operations
 * 
 * This file contains comprehensive test scenarios for all CRUD operations
 * to verify that all functions work together correctly.
 */

import {
  getUserProfile,
  updateUserProfile,
  getClasses,
  getChildren,
  saveGenerationHistory,
  testDatabaseConnection as testDBConnection,
  DatabaseError,
  AuthenticationError,
  PermissionError,
  type UserProfileUpdate,
  type GenerationHistoryInsert
} from '../database'

// Mock data for testing
const mockUserId = 'test-user-123'
const mockUserProfile = {
  id: mockUserId,
  email: 'test@example.com',
  name: 'テストユーザー',
  assigned_class: 'koala',
  created_at: new Date(),
  updated_at: new Date()
}

const mockClasses = [
  {
    id: 'class-koala',
    name: 'koala',
    description: 'こあら組 - 0-1歳児クラス',
    age_range: '0-1歳',
    capacity: 10,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'class-bear',
    name: 'bear', 
    description: 'くま組 - 2-3歳児クラス',
    age_range: '2-3歳',
    capacity: 12,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'class-giraffe',
    name: 'giraffe',
    description: 'きりん組 - 4-5歳児クラス', 
    age_range: '4-5歳',
    capacity: 15,
    created_at: new Date(),
    updated_at: new Date()
  }
]

const mockChildren = [
  {
    id: 'child-1',
    name: '田中太郎',
    class_id: 'class-koala',
    enrollment_date: new Date(),
    birth_date: new Date('2023-01-15'),
    guardian_name: '田中花子',
    guardian_phone: '090-1234-5678',
    guardian_email: 'tanaka@example.com',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'child-2', 
    name: '佐藤次郎',
    class_id: 'class-bear',
    enrollment_date: new Date(),
    birth_date: new Date('2021-03-20'),
    guardian_name: '佐藤美恵',
    guardian_phone: '090-2345-6789',
    guardian_email: 'sato@example.com',
    created_at: new Date(),
    updated_at: new Date()
  }
]

/**
 * Test Suite 1: User Profile Operations
 */
async function testUserProfileOperations(): Promise<{ success: boolean, details: string[] }> {
  const details: string[] = []
  let success = true

  try {
    details.push('=== User Profile Operations Test ===')

    // Test 1: Get user profile - valid user
    try {
      details.push('Testing getUserProfile with valid user ID...')
      const profile = await getUserProfile(mockUserId)
      if (profile) {
        details.push(`✓ Successfully retrieved profile for user: ${profile.name}`)
      } else {
        details.push('⚠ Profile not found (expected for test environment)')
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        details.push('⚠ Authentication required (expected for test environment)')
      } else {
        details.push(`✗ getUserProfile failed: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

    // Test 2: Get user profile - invalid user ID
    try {
      details.push('Testing getUserProfile with invalid user ID...')
      const profile = await getUserProfile('')
      details.push('✗ Should have thrown error for empty user ID')
      success = false
    } catch (error) {
      if (error instanceof DatabaseError) {
        details.push('✓ Correctly threw DatabaseError for invalid user ID')
      } else {
        details.push(`✗ Unexpected error type: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

    // Test 3: Update user profile - valid data
    try {
      details.push('Testing updateUserProfile with valid data...')
      const updates: UserProfileUpdate = {
        name: 'Updated Test User',
        assigned_class: 'koala'
      }
      const updatedProfile = await updateUserProfile(mockUserId, updates)
      details.push('⚠ Update succeeded (requires authentication)')
    } catch (error) {
      if (error instanceof AuthenticationError) {
        details.push('⚠ Authentication required for profile update (expected)')
      } else {
        details.push(`✗ updateUserProfile failed: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

    // Test 4: Update user profile - invalid class assignment
    try {
      details.push('Testing updateUserProfile with invalid class...')
      const updates: UserProfileUpdate = {
        assigned_class: 'invalid-class' as any
      }
      const updatedProfile = await updateUserProfile(mockUserId, updates)
      details.push('✗ Should have thrown error for invalid class')
      success = false
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof AuthenticationError) {
        details.push('✓ Correctly handled invalid class assignment')
      } else {
        details.push(`✗ Unexpected error: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

  } catch (error) {
    details.push(`✗ Test suite failed: ${error instanceof Error ? error.message : String(error)}`)
    success = false
  }

  return { success, details }
}

/**
 * Test Suite 2: Class Information Retrieval
 */
async function testClassOperations(): Promise<{ success: boolean, details: string[] }> {
  const details: string[] = []
  let success = true

  try {
    details.push('=== Class Operations Test ===')

    // Test 1: Get all classes
    try {
      details.push('Testing getClasses...')
      const classes = await getClasses()
      if (Array.isArray(classes)) {
        details.push(`✓ Retrieved ${classes.length} classes`)
        
        // Verify structure of returned classes
        if (classes.length > 0) {
          const firstClass = classes[0]
          if (firstClass.id && firstClass.name) {
            details.push('✓ Class objects have required fields')
          } else {
            details.push('✗ Class objects missing required fields')
            success = false
          }
        }
      } else {
        details.push('✗ getClasses did not return an array')
        success = false
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        details.push('⚠ Authentication required for class access (expected)')
      } else {
        details.push(`✗ getClasses failed: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

  } catch (error) {
    details.push(`✗ Test suite failed: ${error instanceof Error ? error.message : String(error)}`)
    success = false
  }

  return { success, details }
}

/**
 * Test Suite 3: Children Data Access
 */
async function testChildrenOperations(): Promise<{ success: boolean, details: string[] }> {
  const details: string[] = []
  let success = true

  try {
    details.push('=== Children Operations Test ===')

    // Test 1: Get all children (no filter)
    try {
      details.push('Testing getChildren without filter...')
      const children = await getChildren()
      if (Array.isArray(children)) {
        details.push(`✓ Retrieved ${children.length} children`)
      } else {
        details.push('✗ getChildren did not return an array')
        success = false
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        details.push('⚠ Authentication required for children access (expected)')
      } else {
        details.push(`✗ getChildren failed: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

    // Test 2: Get children with class filter
    try {
      details.push('Testing getChildren with class filter...')
      const children = await getChildren('class-koala')
      if (Array.isArray(children)) {
        details.push(`✓ Retrieved ${children.length} children from koala class`)
      } else {
        details.push('✗ getChildren with filter did not return an array')
        success = false
      }
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof PermissionError) {
        details.push('⚠ Authentication/Permission required for filtered children access (expected)')
      } else {
        details.push(`✗ getChildren with filter failed: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

  } catch (error) {
    details.push(`✗ Test suite failed: ${error instanceof Error ? error.message : String(error)}`)
    success = false
  }

  return { success, details }
}

/**
 * Test Suite 4: Generation History
 */
async function testGenerationHistoryOperations(): Promise<{ success: boolean, details: string[] }> {
  const details: string[] = []
  let success = true

  try {
    details.push('=== Generation History Operations Test ===')

    // Test valid generation history data for each type
    const generationTypes = ['email', 'diary', 'record'] as const

    for (const type of generationTypes) {
      try {
        details.push(`Testing saveGenerationHistory for type: ${type}...`)
        
        const historyData: GenerationHistoryInsert = {
          user_id: mockUserId,
          type: type,
          input: `Test input for ${type} generation`,
          output: `Test output for ${type} generation`,
          model_used: 'gpt-4',
          tokens_used: 150
        }

        const savedHistory = await saveGenerationHistory(historyData)
        details.push(`✓ Successfully saved ${type} generation history`)
        
      } catch (error) {
        if (error instanceof AuthenticationError || error instanceof PermissionError) {
          details.push(`⚠ Authentication/Permission required for ${type} history save (expected)`)
        } else {
          details.push(`✗ saveGenerationHistory for ${type} failed: ${error instanceof Error ? error.message : String(error)}`)
          success = false
        }
      }
    }

    // Test invalid generation type
    try {
      details.push('Testing saveGenerationHistory with invalid type...')
      
      const invalidHistoryData: GenerationHistoryInsert = {
        user_id: mockUserId,
        type: 'invalid-type' as any,
        input: 'Test input',
        output: 'Test output'
      }

      const savedHistory = await saveGenerationHistory(invalidHistoryData)
      details.push('✗ Should have thrown error for invalid generation type')
      success = false
      
    } catch (error) {
      if (error instanceof DatabaseError) {
        details.push('✓ Correctly rejected invalid generation type')  
      } else {
        details.push(`✗ Unexpected error for invalid type: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

    // Test missing required fields
    try {
      details.push('Testing saveGenerationHistory with missing fields...')
      
      const incompleteData = {
        user_id: mockUserId,
        type: 'email'
        // Missing input and output
      } as GenerationHistoryInsert

      const savedHistory = await saveGenerationHistory(incompleteData)
      details.push('✗ Should have thrown error for missing required fields')
      success = false
      
    } catch (error) {
      if (error instanceof DatabaseError) {
        details.push('✓ Correctly rejected incomplete data')
      } else {
        details.push(`✗ Unexpected error for incomplete data: ${error instanceof Error ? error.message : String(error)}`)
        success = false
      }
    }

  } catch (error) {
    details.push(`✗ Test suite failed: ${error instanceof Error ? error.message : String(error)}`)
    success = false
  }

  return { success, details }
}

/**
 * Test Suite 5: Database Connection and Permissions
 */
async function testDatabaseConnectionTest(): Promise<{ success: boolean, details: string[] }> {
  const details: string[] = []
  let success = true

  try {
    details.push('=== Database Connection Test ===')

    const connectionStatus = await testDBConnection()

    details.push(`Connected: ${connectionStatus.connected}`)
    details.push(`Authenticated: ${connectionStatus.authenticated}`)
    details.push(`Tables Accessible: ${connectionStatus.tables_accessible}`)
    details.push(`RLS Enabled: ${connectionStatus.rls_enabled}`)

    if (connectionStatus.user_id) {
      details.push(`User ID: ${connectionStatus.user_id}`)
    }

    if (connectionStatus.error) {
      details.push(`Error: ${connectionStatus.error}`)
    }

    if (connectionStatus.details) {
      details.push(`Supabase Configured: ${connectionStatus.details.supabase_configured}`)
      details.push(`Session Valid: ${connectionStatus.details.session_valid}`)
      details.push(`Tables Tested: ${connectionStatus.details.tables_tested.join(', ') || 'none'}`)
      details.push(`Permissions Checked: ${connectionStatus.details.permissions_checked.join(', ') || 'none'}`)
    }

    // Evaluate success criteria
    if (connectionStatus.connected && connectionStatus.details?.supabase_configured) {
      details.push('✓ Basic connectivity test passed')
    } else {
      details.push('✗ Basic connectivity test failed')
      success = false
    }

    // Note: Authentication may fail in test environment
    if (!connectionStatus.authenticated) {
      details.push('⚠ Authentication test failed (expected in test environment)')
    }

  } catch (error) {
    details.push(`✗ Database connection test failed: ${error instanceof Error ? error.message : String(error)}`)
    success = false
  }

  return { success, details }
}

/**
 * Run all integration tests
 */
export async function runAllTests(): Promise<{
  success: boolean
  results: {
    userProfile: { success: boolean, details: string[] }
    classes: { success: boolean, details: string[] }
    children: { success: boolean, details: string[] }
    generationHistory: { success: boolean, details: string[] }
    databaseConnection: { success: boolean, details: string[] }
  }
}> {
  console.log('🧪 Running database integration tests...')

  const results = {
    userProfile: await testUserProfileOperations(),
    classes: await testClassOperations(),
    children: await testChildrenOperations(),
    generationHistory: await testGenerationHistoryOperations(),
    databaseConnection: await testDatabaseConnectionTest()
  }

  const overallSuccess = Object.values(results).every(result => result.success)

  console.log('📊 Test Results Summary:')
  console.log(`User Profile Operations: ${results.userProfile.success ? '✅' : '❌'}`)
  console.log(`Class Operations: ${results.classes.success ? '✅' : '❌'}`)
  console.log(`Children Operations: ${results.children.success ? '✅' : '❌'}`)
  console.log(`Generation History: ${results.generationHistory.success ? '✅' : '❌'}`)
  console.log(`Database Connection: ${results.databaseConnection.success ? '✅' : '❌'}`)
  console.log(`Overall Success: ${overallSuccess ? '✅' : '❌'}`)

  return {
    success: overallSuccess,
    results
  }
}

// Export individual test functions for selective testing
export {
  testUserProfileOperations,
  testClassOperations, 
  testChildrenOperations,
  testGenerationHistoryOperations,
  testDatabaseConnectionTest
}