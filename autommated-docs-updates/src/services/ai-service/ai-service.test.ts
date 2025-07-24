import { createAIService } from './index';
import { createGitService } from '../git-service';
import { createFilesystemService } from '../filesystem-service';
import { Services } from '../../types/services';
import { Result } from '../../types/result';

// Create mock services for testing
function createMockServices(): Services {
  return {
    git: createGitService({ useMock: true }),
    ai: createAIService({ useMock: true }),
    filesystem: createFilesystemService({
      useMock: true,
      docsRepositoryPath: '/mock/docs/path',
      foundationUiRepositoryPath: '/mock/foundation-ui/path'
    })
  };
}

// Example usage of the AI service
async function testAIService() {
  console.log('=== AI Service Test ===');
  
  // Create mock services
  const mockServices = createMockServices();
  
  // Test with mock AI service
  console.log('\n🤖 Testing mock AI service...');
  const mockAIService = createAIService({ useMock: true });
  
  const mockResult1 = await mockAIService.shouldUpdateDocs(mockServices, 'docs-update-123');
  if (Result.isSuccess(mockResult1)) {
    console.log(`📝 Mock AI analysis for 'docs-update-123': ${mockResult1.value ? 'Updates needed' : 'No updates needed'}`);
  } else {
    console.log(`❌ Mock AI analysis error: ${mockResult1.message}`);
  }
  
  const mockResult2 = await mockAIService.shouldUpdateDocs(mockServices, 'bug-fix-456');
  if (Result.isSuccess(mockResult2)) {
    console.log(`📝 Mock AI analysis for 'bug-fix-456': ${mockResult2.value ? 'Updates needed' : 'No updates needed'}`);
  } else {
    console.log(`❌ Mock AI analysis error: ${mockResult2.message}`);
  }
  
  // Test with real AI service (if available)
  console.log('\n🤖 Testing real AI service...');
  const realAIService = createAIService({ useMock: false });
  
  try {
    const realResult = await realAIService.shouldUpdateDocs(mockServices, '7fa4045be');
    if (Result.isSuccess(realResult)) {
      console.log(`📝 Real AI analysis for '7fa4045be': ${realResult.value ? 'Updates needed' : 'No updates needed'}`);
    } else {
      console.log(`❌ Real AI analysis error: ${realResult.message}`);
    }
  } catch (error) {
    console.log(`❌ Real AI service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  // Test service behavior consistency
  console.log('\n🔄 Testing service consistency...');
  const service1 = createAIService({ useMock: true });
  const service2 = createAIService({ useMock: true });
  
  const result1 = await service1.shouldUpdateDocs(mockServices, 'same-commit-hash');
  const result2 = await service2.shouldUpdateDocs(mockServices, 'same-commit-hash');
  
  if (Result.isSuccess(result1) && Result.isSuccess(result2)) {
    console.log(`📊 Consistency check: ${result1.value === result2.value ? '✅ Consistent' : '❌ Inconsistent'}`);
    console.log(`   Service 1 result: ${result1.value}`);
    console.log(`   Service 2 result: ${result2.value}`);
  } else {
    console.log('❌ Consistency check failed due to errors');
    if (Result.isError(result1)) console.log(`   Service 1 error: ${result1.message}`);
    if (Result.isError(result2)) console.log(`   Service 2 error: ${result2.message}`);
  }
}

// Run the test
testAIService().catch(console.error); 