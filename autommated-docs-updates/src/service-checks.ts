import { Services } from './types/services';
import { Result } from './types/result';
import { RepositoryType } from './repositories/git/types';

/**
 * Runs comprehensive service checks to validate all services are working correctly.
 * This function tests filesystem, git, AI, and file editing services.
 */
export async function runServiceChecks(services: Services, commitHash: string): Promise<void> {
  console.log("\n🔧 Running comprehensive service checks...");

  // Test filesystem service
  await testFilesystemService(services);

  // Test git service
  await testGitService(services, commitHash);

  // Test AI service
  await testAIService(services, commitHash);

  // Test file editing service
  await testFileEditingService(services, commitHash);

  console.log("\n✅ All service checks completed successfully!");
}

/**
 * Tests filesystem service functionality including grep and readDocFile operations.
 */
async function testFilesystemService(services: Services): Promise<void> {
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
    throw error;
  }
}

/**
 * Tests git service functionality including commit info, pull, and branch operations.
 */
async function testGitService(services: Services, commitHash: string): Promise<void> {
  try {
    console.log("\n🔍 Checking git repository...");
    const commitResult = await services.git.getCommitInfo(commitHash, 'foundation-ui');
    
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

    // Test branch creation functionality
    console.log("\n🌿 Testing branch creation functionality...");
    
    // Test current branch retrieval
    console.log("\n📖 Testing current branch retrieval...");
    const currentBranchResult = await services.git.getCurrentBranch('docs');
    
    if (Result.isSuccess(currentBranchResult)) {
      console.log(`✅ Current branch: ${currentBranchResult.value}`);
    } else {
      const error = currentBranchResult.message;
      console.log(`❌ Current branch retrieval failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }

    // Test branch existence checking
    console.log("\n🔍 Testing branch existence checking...");
    const branchExistsResult = await services.git.branchExists('main', 'docs');
    
    if (Result.isSuccess(branchExistsResult)) {
      console.log(`✅ Branch existence check: 'main' exists = ${branchExistsResult.value}`);
    } else {
      const error = branchExistsResult.message;
      console.log(`❌ Branch existence check failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }

    // Test branch creation (with a unique branch name to avoid conflicts)
    console.log("\n🌿 Testing branch creation...");
    const uniqueBranchName = `docs/update-test-${Date.now()}`;
    const createBranchResult = await services.git.createBranch(uniqueBranchName, 'main', 'docs');
    
    if (Result.isSuccess(createBranchResult)) {
      console.log(`✅ Branch creation successful: '${uniqueBranchName}'`);
      
      // Verify the branch was created
      const verifyResult = await services.git.branchExists(uniqueBranchName, 'docs');
      if (Result.isSuccess(verifyResult) && verifyResult.value) {
        console.log(`✅ Branch verification successful: '${uniqueBranchName}' exists`);
      } else {
        console.log(`⚠️ Branch verification failed: '${uniqueBranchName}' may not exist`);
      }
    } else {
      const error = createBranchResult.message;
      console.log(`❌ Branch creation failed:`);
      console.log(`   Type: ${error.type}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Branch Name: ${error.branchName}`);
      if (error.details) {
        console.log(`   Details: ${error.details}`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error with git operations:", error);
    throw error;
  }
}

/**
 * Tests AI service functionality including commit analysis and file discovery.
 */
async function testAIService(services: Services, commitHash: string): Promise<void> {
  try {
    console.log("\n🔍 Analyzing commit with AI service...");

    const updateResult = await services.ai.shouldUpdateDocs(services, commitHash);
    
    if (Result.isSuccess(updateResult)) {
      const needsUpdate = updateResult.value;
      console.log(`AI Analysis Result: ${needsUpdate ? '📝 Documentation updates needed' : '✅ No documentation updates required'}`);
      
      if (needsUpdate) {
        console.log("🚀 Proceeding with documentation update process...");
        
        // Find docs files to edit
        console.log("\n🔍 Finding docs files to edit...");
        const filesResult = await services.ai.findDocsFilesToEdit(services, commitHash);
        
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
          throw new Error(`AI file discovery failed: ${filesResult.message}`);
        }
      } else {
        console.log("✨ No action needed - documentation is up to date");
      }
    } else {
      console.error(`❌ AI Analysis Error: ${updateResult.message}`);
      throw new Error(`AI analysis failed: ${updateResult.message}`);
    }
  } catch (error) {
    console.error("❌ Error during AI analysis:", error);
    throw error;
  }
}

/**
 * Tests file editing service functionality including file updates and backups.
 */
async function testFileEditingService(services: Services, commitHash: string): Promise<void> {
  try {
    console.log("\n✏️ Testing file editing service...");
    
    // Get commit info for testing
    const commitResult = await services.git.getCommitInfo(commitHash, RepositoryType.FOUNDATION_UI);
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
      throw new Error(`Failed to get commit info for file editing test: ${commitResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with file editing operations:", error);
    throw error;
  }
} 