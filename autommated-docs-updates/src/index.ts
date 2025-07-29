import { config } from 'dotenv';
import { validateAndParseArgs } from './args';
import { createAIService } from './services/ai-service';
import { createGitService } from './services/git-service';
import { createFilesystemService } from './services/filesystem-service';
import { createFileEditingService } from './services/file-editing-service';
import { createGitHubService } from './services/github-service';
import { Services } from './types/services';
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';
import { runDocAutomation } from './scripts/doc-automation';
import { runServiceChecksScript } from './scripts/service-checks';

// Load environment variables from .env file
config();

async function main() {
  // Validate and parse command line arguments
  const args = validateAndParseArgs();

  console.log("=== Automated Docs Updates Script ===");
  console.log(`Script: ${args.scriptName}`);
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
    ai: createAIService({ useMock: useMockServices }),
    filesystem: createFilesystemService({ 
      useMock: useMockServices,
      docsRepositoryPath: args.docsRepoPath,
      foundationUiRepositoryPath: args.foundationUiRepoPath
    }),
    fileEditing: createFileEditingService({
      useMock: useMockServices,
      docsRepositoryPath: args.docsRepoPath,
      foundationUiRepositoryPath: args.foundationUiRepoPath,
      createBackups: true,
      backupDirectory: '.backups'
    }),
    github: createGitHubService({
      useMock: useMockServices
    })
  };
  
  console.log("✅ All services initialized successfully");

  // Route to the appropriate script based on scriptName
  switch (args.scriptName) {
    case 'checks':
      await runServiceChecksScript(services, args);
      break;
    case 'doc-automation':
      await runDocAutomation(services, args);
      break;
    default:
      console.error(`❌ Unknown script: ${args.scriptName}`);
      process.exit(1);
  }
}

// Run the main function
main().catch(console.error); 