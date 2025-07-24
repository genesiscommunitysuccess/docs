import { config } from 'dotenv';
import { validateAndParseArgs } from './args';
import { createAIRepository } from './repositories/ai';
import { createGitService } from './services/git-service';
import { Result } from './types/result';
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';

// Load environment variables from .env file
config();

async function main() {
  // Validate and parse command line arguments
  const args = validateAndParseArgs();

  console.log("=== Automated Docs Updates Script ===");
  console.log(`Docs Repository: ${args.docsRepoPath}`);
  console.log(`Foundation UI Repository: ${args.foundationUiRepoPath}`);
  console.log(`Commit Hash: ${args.commitHash}`);

  // Handle docs repository
  if (args.needsDocsRepo) {
    console.log(`Creating docs repository directory and cloning from git...`);
    try {
      mkdirSync(path.dirname(args.docsRepoPath), { recursive: true });
      execSync(`git clone git@github.com:genesiscommunitysuccess/docs.git "${args.docsRepoPath}"`, { stdio: 'inherit' });
      console.log(`✅ Successfully cloned docs repository to: ${args.docsRepoPath}`);
    } catch (error) {
      console.error(`❌ Failed to clone docs repository:`, error);
      process.exit(1);
    }
  } else {
    console.log(`✅ Docs repository already exists at: ${args.docsRepoPath}`);
  }

  // Handle foundation-ui repository
  if (args.needsFoundationUiRepo) {
    console.log(`Creating foundation-ui repository directory and cloning from git...`);
    try {
      mkdirSync(path.dirname(args.foundationUiRepoPath), { recursive: true });
      execSync(`git clone git@github.com:genesislcap/foundation-ui.git "${args.foundationUiRepoPath}"`, { stdio: 'inherit' });
      console.log(`✅ Successfully cloned foundation-ui repository to: ${args.foundationUiRepoPath}`);
    } catch (error) {
      console.error(`❌ Failed to clone foundation-ui repository:`, error);
      process.exit(1);
    }
  } else {
    console.log(`✅ Foundation UI repository already exists at: ${args.foundationUiRepoPath}`);
  }

  // Determine whether to use mock services based on environment variable
  const useMockServices = process.env.USE_MOCK_SERVICES === 'true';
  
  // Initialize git service for docs repository
  console.log("\n📁 Getting commit information...");
  const gitService = createGitService({ 
    repositoryType: 'docs',
    useMock: useMockServices 
  });

  // Test git service
  try {
    console.log("\n🔍 Checking git repository...");
    const commitResult = await gitService.getCommitInfo(args.commitHash);
    
    if (Result.isSuccess(commitResult)) {
      const commitInfo = commitResult.value;
      console.log(`✅ Git Repository Commit Info:`);
      console.log(`   Hash: ${commitInfo.hash}`);
      console.log(`   Author: ${commitInfo.author} (${commitInfo.authorEmail})`);
      console.log(`   Date: ${commitInfo.date.toISOString()}`);
      console.log(`   Message: ${commitInfo.message}`);
      console.log(`   Files Changed: ${commitInfo.filesChanged.length}`);
      console.log(`   Diffs: ${commitInfo.diffs.length} file(s) with changes`);
      console.log(`   Repository Type: ${commitInfo.repositoryType}`);
    } else {
      const error = commitResult.message;
      console.log(`❌ Git Repository Error:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error getting commit info:", error);
    process.exit(1);
  }

  // Initialize AI service and analyze commit
  console.log("\n🔍 Analyzing commit with AI service...");
  
  // Initialize AI repository
  const aiRepository = createAIRepository({ useMock: useMockServices });

  try {
    const needsUpdate = await aiRepository.shouldUpdateDocs(args.commitHash);
    console.log(`AI Analysis Result: ${needsUpdate ? '📝 Documentation updates needed' : '✅ No documentation updates required'}`);
    
    if (needsUpdate) {
      console.log("🚀 Proceeding with documentation update process...");
      // TODO: Implement documentation update logic
    } else {
      console.log("✨ No action needed - documentation is up to date");
    }
  } catch (error) {
    console.error("❌ Error during AI analysis:", error);
    process.exit(1);
  }

  console.log("\nArguments validated and repositories ready!");
}

// Run the main function
main().catch(console.error); 