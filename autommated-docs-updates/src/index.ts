import { config } from 'dotenv';
import { validateAndParseArgs } from './args';
import { createAIService } from './services/ai-service';
import { createGitRepositoryService } from './repositories/git';
import { RepositoryType } from './repositories/git/types';
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

  // Initialize git repository service with both repositories
  console.log("\n📁 Getting commit information...");
  const gitService = createGitRepositoryService({ 
    docsRepositoryPath: args.docsRepoPath,
    foundationUiRepositoryPath: args.foundationUiRepoPath,
    useMock: true // Use mock for now
  });

  // Test both repositories
  try {
    // Test docs repository
    console.log("\n📖 Checking docs repository...");
    const docsCommitInfo = await gitService.getCommitInfo(args.commitHash, RepositoryType.DOCS);
    console.log(`✅ Docs Repository Commit Info:`);
    console.log(`   Hash: ${docsCommitInfo.hash}`);
    console.log(`   Author: ${docsCommitInfo.author} (${docsCommitInfo.authorEmail})`);
    console.log(`   Date: ${docsCommitInfo.date.toISOString()}`);
    console.log(`   Message: ${docsCommitInfo.message}`);
    console.log(`   Files Changed: ${docsCommitInfo.filesChanged.length}`);
    console.log(`   Diffs: ${docsCommitInfo.diffs.length} file(s) with changes`);
    
    // Test foundation-ui repository
    console.log("\n🔧 Checking foundation-ui repository...");
    const fuiCommitInfo = await gitService.getCommitInfo(args.commitHash, RepositoryType.FOUNDATION_UI);
    console.log(`✅ Foundation UI Repository Commit Info:`);
    console.log(`   Hash: ${fuiCommitInfo.hash}`);
    console.log(`   Author: ${fuiCommitInfo.author} (${fuiCommitInfo.authorEmail})`);
    console.log(`   Date: ${fuiCommitInfo.date.toISOString()}`);
    console.log(`   Message: ${fuiCommitInfo.message}`);
    console.log(`   Files Changed: ${fuiCommitInfo.filesChanged.length}`);
    console.log(`   Diffs: ${fuiCommitInfo.diffs.length} file(s) with changes`);
    
  } catch (error) {
    console.error("❌ Error getting commit info:", error);
    process.exit(1);
  }

  // Initialize AI service and analyze commit
  console.log("\n🔍 Analyzing commit with AI service...");
  
  // Determine which AI service to use based on environment variable
  const useMockAI = process.env.USE_MOCK_AI === 'true' || process.env.USE_MOCK_AI !== 'false';
  const aiService = createAIService({ useMock: useMockAI });

  try {
    const needsUpdate = await aiService.shouldUpdateDocs(args.commitHash);
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