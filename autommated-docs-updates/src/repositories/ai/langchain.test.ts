import { LangChainAIRepository } from './langchain';

// Example usage of the LangChain AI repository
async function testLangChainRepository() {
  console.log('=== LangChain AI Repository Test ===');
  
  try {
    // Create LangChain AI repository
    console.log('\n🤖 Initializing LangChain AI repository...');
    const aiRepository = new LangChainAIRepository({
      temperature: 0.1
    });
    
    // Test with different commit hashes
    const testCommits = [
      'feat-add-new-api-endpoint',
      'fix-bug-in-authentication',
      'docs-update-readme',
      'chore-release-version-1.0.0',
      'refactor-improve-performance'
    ];
    
    console.log('\n🔍 Testing AI analysis with different commit types...');
    
    for (const commitHash of testCommits) {
      console.log(`\n📝 Analyzing commit: ${commitHash}`);
      
      try {
        const needsUpdate = await aiRepository.shouldUpdateDocs(commitHash);
        console.log(`   Result: ${needsUpdate ? '✅ Documentation updates needed' : '❌ No documentation updates required'}`);
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