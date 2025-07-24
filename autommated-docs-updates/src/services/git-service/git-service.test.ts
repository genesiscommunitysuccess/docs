import { createGitService } from './index';
import { Result } from '../../types/result';

// Example usage of the git service with different repository types
async function testGitService() {
  console.log('=== Git Service Test ===');
  
  // Test with docs repository
  console.log('\n📖 Testing docs repository...');
  const docsGitService = createGitService({ 
    repositoryType: 'docs',
    useMock: true 
  });
  
  const docsResult = await docsGitService.getCommitInfo('abc12345');
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
    repositoryType: 'foundation-ui',
    useMock: true 
  });
  
  const fuiResult = await fuiGitService.getCommitInfo('abc12345');
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
    repositoryType: 'docs',
    useMock: false 
  });
  
  const realResult = await realGitService.getCommitInfo('7fa4045be');
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
  const docsPullResult = await docsGitService.pullLatest();
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
  const fuiPullResult = await fuiGitService.pullLatest();
  if (Result.isSuccess(fuiPullResult)) {
    console.log(`✅ Foundation UI repository pull successful`);
  } else {
    const error = fuiPullResult.message;
    console.log(`❌ Foundation UI repository pull failed:`);
    console.log(`   Type: ${error.type}`);
    console.log(`   Message: ${error.message}`);
  }
}

// Run the test
testGitService().catch(console.error); 