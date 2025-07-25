import { config } from 'dotenv';
import { validateAndParseArgs } from './args';
import { createAIService } from './services/ai-service';
import { createGitService } from './services/git-service';
import { createFilesystemService } from './services/filesystem-service';
import { createFileEditingService } from './services/file-editing-service';
import { Result } from './types/result';
import { Services } from './types/services';
import { RepositoryType } from './repositories/git/types';
import { runServiceChecks } from './service-checks';
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
    })
  };
  
  console.log("✅ All services initialized successfully");

  // Run service checks if enabled via environment variable
  const runServiceChecksEnabled = process.env.RUN_SERVICE_CHECKS === 'true';
  if (runServiceChecksEnabled) {
    try {
      await runServiceChecks(services, args.commitHash);
    } catch (error) {
      console.error("❌ Service checks failed:", error);
      process.exit(1);
    }
  } else {
    console.log("\n⏭️ Service checks skipped (RUN_SERVICE_CHECKS not set to 'true')");
  }

  // Main application flow
  console.log("\n🚀 Starting main application flow...");
  
  // Analyze commit with AI service
  console.log("\n🔍 Analyzing commit with AI service...");

  try {
    const updateResult = await services.ai.shouldUpdateDocs(services, args.commitHash);
    
    if (Result.isSuccess(updateResult)) {
      const needsUpdate = updateResult.value;
      console.log(`AI Analysis Result: ${needsUpdate ? '📝 Documentation updates needed' : '✅ No documentation updates required'}`);
      
      if (needsUpdate) {
        console.log("🚀 Proceeding with documentation update process...");
        
        // Find docs files to edit
        console.log("\n🔍 Finding docs files to edit...");
        const filesResult = await services.ai.findDocsFilesToEdit(services, args.commitHash);
        
        if (Result.isSuccess(filesResult)) {
          const filesToEdit = filesResult.value;
          console.log(`📁 Found ${filesToEdit.length} docs files to edit:`);
          filesToEdit.forEach((filePath, index) => {
            console.log(`   ${index + 1}. ${filePath}`);
          });
          
          // TODO: Implement documentation update logic for the identified files
          console.log("🔄 Documentation update logic will be implemented in the next phase");
        } else {
          console.error(`❌ Error finding docs files to edit: ${filesResult.message}`);
          process.exit(1);
        }
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