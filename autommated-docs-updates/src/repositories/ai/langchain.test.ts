import { LangChainAIRepository } from './langchain';
import { createGitService } from '../../services/git-service';
import { Services } from '../../types/services';
import { CommitInfo } from '../git/types';
import { Result } from '../../types/result';

// Create mock services for testing
function createMockServices(): Services {
  return {
    git: createGitService({ useMock: true }),
    ai: {} as any // Not used in this test
  };
}

// Create mock commit info for testing
function createMockCommitInfo(hash: string, message: string, author: string = 'test-author'): CommitInfo {
  return {
    hash,
    author,
    authorEmail: 'test@example.com',
    date: new Date(),
    message,
    filesChanged: ['src/test.ts'],
    diffs: [{
      filePath: 'src/test.ts',
      changeType: 'modified',
      diff: 'test diff',
      linesAdded: 1,
      linesDeleted: 1
    }],
    repositoryType: 'foundation-ui' as any
  };
}

// Example usage of the LangChain AI repository
async function testLangChainRepository() {
  console.log('=== LangChain AI Repository Test ===');
  
  try {
    // Create LangChain AI repository
    console.log('\n🤖 Initializing LangChain AI repository...');
    const aiRepository = new LangChainAIRepository({
      temperature: 0.1
    });
    
    // Create mock services
    const mockServices = createMockServices();
    
    // Test with different commit types
    const testCommits = [
      { hash: 'feat-add-new-api-endpoint', message: 'feat: add new API endpoint for user management' },
      { hash: 'fix-bug-in-authentication', message: 'fix: resolve authentication bug in login flow' },
      { hash: 'docs-update-readme', message: 'docs: update README with new installation instructions' },
      { hash: 'chore-release-version-1.0.0', message: 'chore: release version 1.0.0' },
      { hash: 'refactor-improve-performance', message: 'refactor: improve performance of data processing' }
    ];
    
    console.log('\n🔍 Testing AI analysis with different commit types...');
    
    for (const commit of testCommits) {
      console.log(`\n📝 Analyzing commit: ${commit.hash}`);
      console.log(`   Message: ${commit.message}`);
      
      try {
        const commitInfo = createMockCommitInfo(commit.hash, commit.message);
        const aiResult = await aiRepository.shouldUpdateDocs(mockServices, commitInfo);
        if (Result.isSuccess(aiResult)) {
          const needsUpdate = aiResult.value;
          console.log(`   Result: ${needsUpdate ? '✅ Documentation updates needed' : '❌ No documentation updates required'}`);
        } else {
          console.log(`   ❌ Error: ${aiResult.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.log('❌ Failed to initialize LangChain AI repository:');
    console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    if (error instanceof Error && error.message.includes('ANTHROPIC_API_KEY')) {
      console.log('\n💡 To fix this error:');
      console.log('   1. Set the ANTHROPIC_API_KEY environment variable');
      console.log('   2. Or pass the apiKey in the constructor');
    }
  }
}

// Run the test
testLangChainRepository().catch(console.error); 