import { createGitService } from './index';
import { Result } from '../../types/result';

// Example demonstrating the flexibility of the refactored git service
async function testGitServiceFlexibility() {
  console.log('=== Git Service Flexibility Test ===');
  
  // Create a single git service instance that can work with both repositories
  console.log('\n🔧 Creating flexible git service...');
    const gitService = createGitService({
    useMock: true,
    docsRepositoryPath: '/mock/docs',
    foundationUiRepositoryPath: '/mock/foundation-ui'
  });
  
  console.log('\n📖 Testing docs repository operations...');
  
  // Test docs repository operations
  const docsCommitResult = await gitService.getCommitInfo('docs-commit-123', 'docs');
  if (Result.isSuccess(docsCommitResult)) {
    const commitInfo = docsCommitResult.value;
    console.log(`✅ Docs Repository Commit:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  }
  
  const docsPullResult = await gitService.pullLatest('docs');
  if (Result.isSuccess(docsPullResult)) {
    console.log(`✅ Docs repository pull successful`);
  }
  
  console.log('\n🔧 Testing foundation-ui repository operations...');
  
  // Test foundation-ui repository operations with the same service instance
  const fuiCommitResult = await gitService.getCommitInfo('fui-commit-456', 'foundation-ui');
  if (Result.isSuccess(fuiCommitResult)) {
    const commitInfo = fuiCommitResult.value;
    console.log(`✅ Foundation UI Repository Commit:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  }
  
  const fuiPullResult = await gitService.pullLatest('foundation-ui');
  if (Result.isSuccess(fuiPullResult)) {
    console.log(`✅ Foundation UI repository pull successful`);
  }
  
  console.log('\n🎯 Key Benefits of the Refactored Service:');
  console.log('   ✅ Single service instance can work with both repositories');
  console.log('   ✅ Repository type determined on each function call');
  console.log('   ✅ More flexible and reusable');
  console.log('   ✅ Cleaner API design');
  console.log('   ✅ Easier to test and maintain');
}

// Run the test
testGitServiceFlexibility().catch(console.error); 