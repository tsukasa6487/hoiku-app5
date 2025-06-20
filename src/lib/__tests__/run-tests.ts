/**
 * Test runner for database operations
 * 
 * This script can be used to manually run the database integration tests
 * and verify that all CRUD operations work correctly.
 */

import { runAllTests } from './database.test'

/**
 * Main test runner function
 */
async function main() {
  try {
    console.log('🚀 Starting database integration tests...\n')
    
    const testResults = await runAllTests()
    
    console.log('\n📝 Detailed Test Results:\n')
    
    // Print detailed results for each test suite
    Object.entries(testResults.results).forEach(([testName, result]) => {
      console.log(`${testName.toUpperCase()} TEST RESULTS:`)
      result.details.forEach(detail => console.log(`  ${detail}`))
      console.log('')
    })
    
    // Summary
    console.log('=' .repeat(50))
    console.log(`🎯 FINAL RESULT: ${testResults.success ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`)
    console.log('=' .repeat(50))
    
    // Exit with appropriate code
    process.exit(testResults.success ? 0 : 1)
    
  } catch (error) {
    console.error('❌ Test runner failed:', error)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  main()
}

export { main as runTests }