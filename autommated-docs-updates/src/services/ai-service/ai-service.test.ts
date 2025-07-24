import { createAIService } from './index';

// Example usage of the AI service
async function testAIService() {
  console.log('=== AI Service Test ===');
  
  // Test with mock AI service
  console.log('\n🤖 Testing mock AI service...');
  const mockAIService = createAIService({ useMock: true });
  
  const mockResult1 = await mockAIService.shouldUpdateDocs('docs-update-123');
  console.log(`📝 Mock AI analysis for 'docs-update-123': ${mockResult1 ? 'Updates needed' : 'No updates needed'}`);
  
  const mockResult2 = await mockAIService.shouldUpdateDocs('bug-fix-456');
  console.log(`📝 Mock AI analysis for 'bug-fix-456': ${mockResult2 ? 'Updates needed' : 'No updates needed'}`);
  
  // Test with real AI service (if available)
  console.log('\n🤖 Testing real AI service...');
  const realAIService = createAIService({ useMock: false });
  
  try {
    const realResult = await realAIService.shouldUpdateDocs('7fa4045be');
    console.log(`📝 Real AI analysis for '7fa4045be': ${realResult ? 'Updates needed' : 'No updates needed'}`);
  } catch (error) {
    console.log(`❌ Real AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Test service behavior consistency
  console.log('\n🔄 Testing service consistency...');
  const service1 = createAIService({ useMock: true });
  const service2 = createAIService({ useMock: true });
  
  const result1 = await service1.shouldUpdateDocs('same-commit-hash');
  const result2 = await service2.shouldUpdateDocs('same-commit-hash');
  
  console.log(`📊 Consistency check: ${result1 === result2 ? '✅ Consistent' : '❌ Inconsistent'}`);
  console.log(`   Service 1 result: ${result1}`);
  console.log(`   Service 2 result: ${result2}`);
}

// Run the test
testAIService().catch(console.error); 