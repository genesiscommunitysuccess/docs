import { Services } from './services';
import { createGitService } from '../services/git-service';
import { createAIService } from '../services/ai-service';
import { Result } from './result';

// Example demonstrating the Services type and centralized service management
async function testServicesType() {
  console.log('=== Services Type Test ===');
  
  // Create services object with all initialized services
  console.log('\n🔧 Creating services object...');
  const services: Services = {
    git: createGitService({ useMock: true }),
    ai: createAIService({ useMock: true })
  };
  
  console.log('✅ Services object created successfully');
  console.log(`   - Git Service: ${services.git.constructor.name}`);
  console.log(`   - AI Service: ${services.ai.constructor.name}`);
  
  // Test git service through services object
  console.log('\n📁 Testing git service through services object...');
  const commitResult = await services.git.getCommitInfo('test-commit-123', 'docs');
  if (Result.isSuccess(commitResult)) {
    const commitInfo = commitResult.value;
    console.log(`✅ Git Service Test:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  }
  
  // Test AI service through services object
  console.log('\n🤖 Testing AI service through services object...');
  const needsUpdate = await services.ai.shouldUpdateDocs('test-commit-123');
  console.log(`✅ AI Service Test:`);
  console.log(`   Documentation updates needed: ${needsUpdate}`);
  
  // Test git service with different repository type
  console.log('\n🔧 Testing git service with foundation-ui repository...');
  const fuiCommitResult = await services.git.getCommitInfo('test-commit-456', 'foundation-ui');
  if (Result.isSuccess(fuiCommitResult)) {
    const commitInfo = fuiCommitResult.value;
    console.log(`✅ Foundation UI Git Service Test:`);
    console.log(`   Hash: ${commitInfo.hash}`);
    console.log(`   Author: ${commitInfo.author}`);
    console.log(`   Message: ${commitInfo.message}`);
    console.log(`   Repository Type: ${commitInfo.repositoryType}`);
  }
  
  console.log('\n🎯 Benefits of Services Type:');
  console.log('   ✅ Centralized service management');
  console.log('   ✅ Type-safe access to all services');
  console.log('   ✅ Easy to pass services to functions');
  console.log('   ✅ Clear dependency structure');
  console.log('   ✅ Simplified testing and mocking');
}

// Run the test
testServicesType().catch(console.error); 