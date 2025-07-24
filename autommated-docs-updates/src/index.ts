import { config } from 'dotenv';
import { validateAndParseArgs } from './args';
import { createAIService } from './services/ai-service';
import { createGitService } from './services/git-service';
import { createFilesystemService } from './services/filesystem-service';
import { createFileEditingService } from './services/file-editing-service';
import { Result } from './types/result';
import { Services } from './types/services';
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

  // Test filesystem service
  try {
    console.log("\n🔍 Testing filesystem grep functionality...");
    const grepResult = await services.filesystem.grepDocs('test');
    
    if (Result.isSuccess(grepResult)) {
      const results = grepResult.value;
      console.log(`✅ Filesystem grep successful - found ${results.length} matches`);
      results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.filePath}:${result.lineNumber} - "${result.line}"`);
      });
    } else {
      const error = grepResult.message;
      console.log(`❌ Filesystem grep failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }

    // Test readDocFile functionality
    console.log("\n📖 Testing filesystem readDocFile functionality...");
    const readResult = await services.filesystem.readDocFile('001_develop/01_development-environment/007_genx/index.mdx', { lineCount: 10, offset: 0 });
    
    if (Result.isSuccess(readResult)) {
      const content = readResult.value;
      console.log(`✅ Filesystem readDocFile successful:`);
      console.log(`   File: ${content.relativePath}`);
      console.log(`   Total lines: ${content.totalLines}`);
      console.log(`   Lines read: ${content.linesRead} (offset: ${content.offset})`);
      console.log(`   Content preview:`);
      content.lines.forEach((line, index) => {
        console.log(`   ${content.offset + index + 1}: ${line}`);
      });
    } else {
      const error = readResult.message;
      console.log(`❌ Filesystem readDocFile failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }
  } catch (error) {
    console.error("❌ Error with filesystem operations:", error);
    process.exit(1);
  }

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

  // Test file editing service
  try {
    console.log("\n✏️ Testing file editing service...");
    
    // Get commit info for testing
    const commitResult = await services.git.getCommitInfo(args.commitHash, RepositoryType.FOUNDATION_UI);
    if (Result.isSuccess(commitResult)) {
      const commitInfo = commitResult.value;
      
      // Test file editing with a mock file path
      const updateResult = await services.fileEditing.updateDocFile(
        'test-file.md',
        commitInfo,
        'Add documentation for the new authentication system'
      );
      
      if (Result.isSuccess(updateResult)) {
        const update = updateResult.value;
        console.log(`✅ File editing successful:`);
        console.log(`   File: ${update.filePath}`);
        console.log(`   Lines changed: ${update.linesChanged}`);
        console.log(`   Backup created: ${update.backupPath ? 'Yes' : 'No'}`);
        console.log(`   Timestamp: ${update.timestamp.toISOString()}`);
        console.log(`   Content preview (first 200 chars):`);
        console.log(`   "${update.newContent.substring(0, 200)}..."`);
      } else {
        const error = updateResult.message;
        console.log(`❌ File editing failed:`);
        console.log(`   Type: ${error.type}`);
        console.log(`   Message: ${error.message}`);
        if (error.details) {
          console.log(`   Details: ${error.details}`);
        }
        if (error.currentBranch) {
          console.log(`   Current Branch: ${error.currentBranch}`);
        }
      }
    } else {
      console.log(`❌ Could not get commit info for file editing test: ${commitResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with file editing operations:", error);
    process.exit(1);
  }

  console.log("\nArguments validated and repositories ready!");
}

// Run the main function
main().catch(console.error); 