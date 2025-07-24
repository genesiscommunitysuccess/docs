import { config } from 'dotenv';
import { validateAndParseArgs } from './args';
import { createAIService } from './services/ai-service';
import { createGitService } from './services/git-service';
import { Result } from './types/result';
import { Services } from './types/services';
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
  
  // Initialize all services
  console.log("\n🔧 Initializing services...");
  const services: Services = {
    git: createGitService({ useMock: useMockServices }),
    ai: createAIService({ useMock: useMockServices })
  };
  
  console.log("✅ All services initialized successfully");

  // Test git service
  try {
    console.log("\n🔍 Checking git repository...");
    const commitResult = await services.git.getCommitInfo(args.commitHash, 'foundation-ui');
    
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

    // Test git pull functionality
    console.log("\n📥 Testing git pull functionality...");
    const pullResult = await services.git.pullLatest('foundation-ui');
    
    if (Result.isSuccess(pullResult)) {
      console.log(`✅ Git pull successful`);
    } else {
      const error = pullResult.message;
      console.log(`❌ Git pull failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error with git operations:", error);
    process.exit(1);
  }

  // Analyze commit with AI service
  console.log("\n🔍 Analyzing commit with AI service...");

  try {
    const updateResult = await services.ai.shouldUpdateDocs(services, args.commitHash);
    
    if (Result.isSuccess(updateResult)) {
      const needsUpdate = updateResult.value;
      console.log(`AI Analysis Result: ${needsUpdate ? '📝 Documentation updates needed' : '✅ No documentation updates required'}`);
      
      if (needsUpdate) {
        console.log("🚀 Proceeding with documentation update process...");
        // TODO: Implement documentation update logic
      } else {
        console.log("✨ No action needed - documentation is up to date");
      }
    } else {
      console.error(`❌ AI Analysis Error: ${updateResult.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during AI analysis:", error);
    process.exit(1);
  }

  console.log("\nArguments validated and repositories ready!");
}

// Run the main function
main().catch(console.error); 