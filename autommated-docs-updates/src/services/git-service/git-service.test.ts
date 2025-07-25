import { createGitService } from './index';
import { Result } from '../../types/result';

// Example usage of the git service with different repository types
async function testGitService() {
  console.log('=== Git Service Test ===');
  
  // Test with docs repository
  console.log('\n📖 Testing docs repository...');
  const docsGitService = createGitService({ 
    useMock: true 
  });
  
  const docsResult = await docsGitService.getCommitInfo('abc12345', 'docs');
  if (Result.isSuccess(docsResult)) {
    const commitInfo = docsResult.value;
    console.log(`✅ Docs Repository:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  } else {
    console.log(`❌ Docs Repository Error: ${docsResult.message.message}`);
  }
  
  // Test with foundation-ui repository
  console.log('\n🔧 Testing foundation-ui repository...');
  const fuiGitService = createGitService({ 
    useMock: true 
  });
  
  const fuiResult = await fuiGitService.getCommitInfo('abc12345', 'foundation-ui');
  if (Result.isSuccess(fuiResult)) {
    const commitInfo = fuiResult.value;
    console.log(`✅ Foundation UI Repository:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  } else {
    console.log(`❌ Foundation UI Repository Error: ${fuiResult.message.message}`);
  }
  
  // Test with real services (if available)
  console.log('\n🔍 Testing real services...');
  const realGitService = createGitService({ 
    useMock: false 
  });
  
  const realResult = await realGitService.getCommitInfo('7fa4045be', 'docs');
  if (Result.isSuccess(realResult)) {
    const commitInfo = realResult.value;
    console.log(`✅ Real Docs Repository:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  } else {
    const error = realResult.message;
    console.log(`❌ Real Repository Error:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }

  // Test git pull functionality
  console.log('\n📥 Testing git pull functionality...');
  
  // Test docs repository pull
  console.log('\n📖 Testing docs repository pull...');
  const docsPullResult = await docsGitService.pullLatest('docs');
  if (Result.isSuccess(docsPullResult)) {
    console.log(`✅ Docs repository pull successful`);
  } else {
    const error = docsPullResult.message;
    console.log(`❌ Docs repository pull failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }
  
  // Test foundation-ui repository pull
  console.log('\n🔧 Testing foundation-ui repository pull...');
  const fuiPullResult = await fuiGitService.pullLatest('foundation-ui');
  if (Result.isSuccess(fuiPullResult)) {
    console.log(`✅ Foundation UI repository pull successful`);
  } else {
    const error = fuiPullResult.message;
    console.log(`❌ Foundation UI repository pull failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }

  // Test branch creation functionality
  console.log('\n🌿 Testing branch creation functionality...');
  
  // Test current branch retrieval
  console.log('\n📖 Testing current branch retrieval for docs...');
  const docsCurrentBranchResult = await docsGitService.getCurrentBranch('docs');
  if (Result.isSuccess(docsCurrentBranchResult)) {
    console.log(`✅ Docs current branch: ${docsCurrentBranchResult.value}`);
  } else {
    const error = docsCurrentBranchResult.message;
    console.log(`❌ Docs current branch retrieval failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }

  console.log('\n🔧 Testing current branch retrieval for foundation-ui...');
  const fuiCurrentBranchResult = await fuiGitService.getCurrentBranch('foundation-ui');
  if (Result.isSuccess(fuiCurrentBranchResult)) {
    console.log(`✅ Foundation UI current branch: ${fuiCurrentBranchResult.value}`);
  } else {
    const error = fuiCurrentBranchResult.message;
    console.log(`❌ Foundation UI current branch retrieval failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }

  // Test branch existence checking
  console.log('\n🔍 Testing branch existence checking...');
  const branchExistsResult = await docsGitService.branchExists('main', 'docs');
  if (Result.isSuccess(branchExistsResult)) {
    console.log(`✅ Branch existence check: 'main' exists = ${branchExistsResult.value}`);
  } else {
    const error = branchExistsResult.message;
    console.log(`❌ Branch existence check failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }

  // Test invalid branch name validation
  console.log('\n🔍 Testing invalid branch name validation...');
  const invalidBranchResult = await docsGitService.branchExists('invalid/branch/name', 'docs');
  if (Result.isError(invalidBranchResult)) {
    const error = invalidBranchResult.message;
    console.log(`❌ Expected error for invalid branch name:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Branch Name: ${error.branchName}`);
  } else {
    console.log('⚠️ Unexpected success with invalid branch name');
  }

  // Test branch creation
  console.log('\n🌿 Testing branch creation...');
  const uniqueBranchName = `test-branch-${Date.now()}`;
  const createBranchResult = await docsGitService.createBranch(uniqueBranchName, 'main', 'docs');
  if (Result.isSuccess(createBranchResult)) {
    console.log(`✅ Branch creation successful: '${uniqueBranchName}'`);
    
    // Verify the branch was created
    const verifyResult = await docsGitService.branchExists(uniqueBranchName, 'docs');
    if (Result.isSuccess(verifyResult) && verifyResult.value) {
      console.log(`✅ Branch verification successful: '${uniqueBranchName}' exists`);
    } else {
      console.log(`⚠️ Branch verification failed: '${uniqueBranchName}' may not exist`);
    }
  } else {
    const error = createBranchResult.message;
    console.log(`❌ Branch creation failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Branch Name: ${error.branchName}`);
  }

  // Test branch creation with existing branch name
  console.log('\n🌿 Testing branch creation with existing branch name...');
  const existingBranchResult = await docsGitService.createBranch('existing-branch', 'main', 'docs');
  if (Result.isError(existingBranchResult)) {
    const error = existingBranchResult.message;
    console.log(`❌ Expected error for existing branch:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Branch Name: ${error.branchName}`);
  } else {
    console.log('⚠️ Unexpected success with existing branch name');
  }

  // Test branch creation with non-existent base branch
  console.log('\n🌿 Testing branch creation with non-existent base branch...');
  const nonExistentBaseResult = await docsGitService.createBranch('test-branch-2', 'non-existent-base', 'docs');
  if (Result.isError(nonExistentBaseResult)) {
    const error = nonExistentBaseResult.message;
    console.log(`❌ Expected error for non-existent base branch:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Base Branch: ${error.branchName}`);
  } else {
    console.log('⚠️ Unexpected success with non-existent base branch');
  }
}

// Run the test
testGitService().catch(console.error); 