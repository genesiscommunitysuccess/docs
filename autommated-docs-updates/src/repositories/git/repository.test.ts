import { RealGitRepositoryService } from './repository';
import { RepositoryType } from './types';
import { Result } from '../../types/result';

// Example usage of the real repository service with Result types
async function testRepositoryService() {
  console.log('=== Real Git Repository Service Test ===');
  
  try {
    // Test with valid repositories (these should exist in the user's environment)
    const service = new RealGitRepositoryService(
      '/Users/matt.walker/genesis/docs',
      '/Users/matt.walker/genesis/foundation-ui'
    );
    
    console.log('✅ Repository service initialized successfully');
    
    // Test with invalid commit hash
    console.log('\n🔍 Testing invalid commit hash...');
    const invalidResult = await service.getCommitInfo('invalid', RepositoryType.DOCS);
    
    if (Result.isError(invalidResult)) {
      const error = invalidResult.message;
      console.log(`❌ Expected error caught:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Repository: ${error.repositoryType}`);
      if (error.commitHash) {
        console.log(`   Commit Hash: ${error.commitHash}`);
      }
    } else {
      console.log('⚠️ Unexpected success with invalid commit hash');
    }
    
    // Test with valid commit hash (if available)
    console.log('\n🔍 Testing valid commit hash...');
    const validResult = await service.getCommitInfo('7fa4045be', RepositoryType.DOCS);
    
    if (Result.isSuccess(validResult)) {
      const commitInfo = validResult.value;
      console.log(`✅ Valid commit info retrieved:`);
      console.log(`   Hash: ${commitInfo.hash}`);
      console.log(`   Author: ${commitInfo.author}`);
      console.log(`   Message: ${commitInfo.message}`);
      console.log(`   Files Changed: ${commitInfo.filesChanged.length}`);
    } else {
      const error = validResult.message;
      console.log(`❌ Error with valid commit hash:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Service initialization failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Run the test
testRepositoryService().catch(console.error); 