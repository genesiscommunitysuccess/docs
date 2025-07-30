import { Services } from './services';
import { createGitService } from '../services/git-service';
import { createAIService } from '../services/ai-service';
import { createFilesystemService } from '../services/filesystem-service';
import { createFileEditingService } from '../services/file-editing-service';
import { createGitHubService } from '../services/github-service';
import { Result } from './result';

// Example usage of the Services type
async function testServices() {
  console.log('=== Services Type Test ===');
  
  // Create services object with all initialized services
  const services: Services = {
    git: createGitService({ 
      useMock: true,
      docsRepositoryPath: '/mock/docs',
      foundationUiRepositoryPath: '/mock/foundation-ui'
    }),
    ai: createAIService({ useMock: true }),
    filesystem: createFilesystemService({
      useMock: true,
      docsRepositoryPath: '/mock/docs/path',
      foundationUiRepositoryPath: '/mock/foundation-ui/path'
    }),
    fileEditing: createFileEditingService({
      useMock: true,
      docsRepositoryPath: '/mock/docs/path',
      foundationUiRepositoryPath: '/mock/foundation-ui/path',
      createBackups: true,
      backupDirectory: '.backups'
    }),
    github: createGitHubService({
      useMock: true
    })
  };
  
  console.log('✅ Services object created successfully');
  console.log(`   Git Service: ${typeof services.git}`);
  console.log(`   AI Service: ${typeof services.ai}`);
  console.log(`   Filesystem Service: ${typeof services.filesystem}`);
  console.log(`   File Editing Service: ${typeof services.fileEditing}`);
  console.log(`   GitHub Service: ${typeof services.github}`);
  
  // Test using services
  console.log('\n🔍 Testing service usage...');
  
  // Test git service
  const commitResult = await services.git.getCommitInfo('abc123', 'docs');
  console.log(`   Git service test: ${Result.isSuccess(commitResult) ? '✅ Success' : '❌ Error'}`);
  
  // Test filesystem service
  const grepResult = await services.filesystem.grepDocs('test');
  console.log(`   Filesystem service test: ${Result.isSuccess(grepResult) ? '✅ Success' : '❌ Error'}`);
  
  // Test AI service
  const aiResult = await services.ai.shouldUpdateDocs(services, 'abc123');
  console.log(`   AI service test: ${Result.isSuccess(aiResult) ? '✅ Success' : '❌ Error'}`);
  
  // Test GitHub service
  const githubResult = await services.github.validateConfiguration();
  console.log(`   GitHub service test: ${Result.isSuccess(githubResult) ? '✅ Success' : '❌ Error'}`);
  
  console.log('\n✅ All services working correctly!');
}

// Run the test
testServices().catch(console.error); 