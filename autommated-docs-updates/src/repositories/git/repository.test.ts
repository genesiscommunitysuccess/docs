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

    // Test branch existence checking
    console.log('\n🔍 Testing branch existence checking...');
    const branchExistsResult = await service.branchExists('main', RepositoryType.DOCS);
    
    if (Result.isSuccess(branchExistsResult)) {
      console.log(`✅ Branch existence check successful:`);
      console.log(`   Branch 'main' exists: ${branchExistsResult.value}`);
    } else {
      const error = branchExistsResult.message;
      console.log(`❌ Branch existence check failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }

    // Test invalid branch name validation
    console.log('\n🔍 Testing invalid branch name validation...');
    const invalidBranchResult = await service.branchExists('invalid/branch/name', RepositoryType.DOCS);
    
    if (Result.isError(invalidBranchResult)) {
      const error = invalidBranchResult.message;
      console.log(`❌ Expected error caught for invalid branch name:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Branch Name: ${error.branchName}`);
      console.log(`   Repository: ${error.repositoryType}`);
    } else {
      console.log('⚠️ Unexpected success with invalid branch name');
    }

    // Test current branch retrieval
    console.log('\n🔍 Testing current branch retrieval...');
    const currentBranchResult = await service.getCurrentBranch(RepositoryType.DOCS);
    
    if (Result.isSuccess(currentBranchResult)) {
      console.log(`✅ Current branch retrieved:`);
      console.log(`   Current branch: ${currentBranchResult.value}`);
    } else {
      const error = currentBranchResult.message;
      console.log(`❌ Current branch retrieval failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }

    // Test branch creation (with a unique branch name to avoid conflicts)
    const uniqueBranchName = `test-branch-${Date.now()}`;
    console.log(`\n🔍 Testing branch creation: '${uniqueBranchName}'...`);
    const createBranchResult = await service.createBranch(uniqueBranchName, 'main', RepositoryType.DOCS);
    
    if (Result.isSuccess(createBranchResult)) {
      console.log(`✅ Branch creation successful:`);
      console.log(`   Created branch: ${uniqueBranchName}`);
      console.log(`   From base branch: main`);
      
      // Verify the branch was actually created
      const verifyResult = await service.branchExists(uniqueBranchName, RepositoryType.DOCS);
      if (Result.isSuccess(verifyResult) && verifyResult.value) {
        console.log(`✅ Branch verification successful: branch exists`);
      } else {
        console.log(`⚠️ Branch verification failed: branch may not have been created properly`);
      }
    } else {
      const error = createBranchResult.message;
      console.log(`❌ Branch creation failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Branch Name: ${error.branchName}`);
      console.log(`   Repository: ${error.repositoryType}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }

    // Test branch creation with non-existent base branch
    console.log('\n🔍 Testing branch creation with non-existent base branch...');
    const nonExistentBaseResult = await service.createBranch('test-branch-2', 'non-existent-base', RepositoryType.DOCS);
    
    if (Result.isError(nonExistentBaseResult)) {
      const error = nonExistentBaseResult.message;
      console.log(`❌ Expected error caught for non-existent base branch:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Base Branch: ${error.branchName}`);
      console.log(`   Repository: ${error.repositoryType}`);
    } else {
      console.log('⚠️ Unexpected success with non-existent base branch');
    }
    
  } catch (error) {
    console.log('❌ Service initialization failed:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Run the test
testRepositoryService().catch(console.error); 