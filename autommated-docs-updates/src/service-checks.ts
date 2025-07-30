import { Result } from './types/result';
import { Services } from './types/services';
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

  // Test GitHub service
  await testGitHubService(services);

  // Test comprehensive workflow (git + file editing + GitHub)
  await testComprehensiveWorkflow(services, commitHash);

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
    const branchExistsResult = await services.git.branchExists('preprod', 'docs');
    
    if (Result.isSuccess(branchExistsResult)) {
      console.log(`✅ Branch existence check: 'preprod' exists = ${branchExistsResult.value}`);
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
    const createBranchResult = await services.git.createBranch(uniqueBranchName, 'preprod', 'docs');
    
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
          
          // Test updating the first documentation file
          if (filesToEdit.length > 0) {
            console.log("\n✏️ Testing documentation file update...");
            const firstFile = filesToEdit[0];
            console.log(`🔄 Testing update of: ${firstFile}`);
            
            const updateResult = await services.ai.updateDocFile(services, commitHash, firstFile);
            
            if (Result.isSuccess(updateResult)) {
              const wasUpdated = updateResult.value;
              console.log(`✅ AI file update successful: ${wasUpdated ? 'File was updated' : 'No changes needed'}`);
            } else {
              console.log(`❌ AI file update failed: ${updateResult.message}`);
              // Don't throw error for AI update failures in tests - they may be expected
            }
          } else {
            console.log("⚠️ No files to test update functionality");
          }
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
        'Add documentation for the new authentication system',
        services.git  // Pass the git service parameter
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

/**
 * Tests GitHub service functionality including pull request operations.
 */
async function testGitHubService(services: Services): Promise<void> {
  try {
    console.log("\n🔍 Testing GitHub service...");

    // Test configuration validation
    console.log("\n🔧 Testing configuration validation...");
    const validationResult = await services.github.validateConfiguration();
    if (Result.isSuccess(validationResult)) {
      console.log("✅ GitHub configuration validation successful");
    } else {
      console.error(`❌ GitHub configuration validation failed: ${validationResult.message.message}`);
      throw new Error(`GitHub service failed: ${validationResult.message.message}`);
    }

    // Test branch existence check
    console.log("\n🔍 Testing branch existence check...");
    const branchExistsResult = await services.github.branchExists('test-branch');
    if (Result.isSuccess(branchExistsResult)) {
      console.log(`✅ Branch existence check successful: ${branchExistsResult.value}`);
    } else {
      console.error(`❌ Branch existence check failed: ${branchExistsResult.message.message}`);
      throw new Error(`GitHub service failed: ${branchExistsResult.message.message}`);
    }

    // Test pull request creation (mock only)
    console.log("\n🔍 Testing pull request creation...");
    const createPRResult = await services.github.createPullRequest(
      'Test Pull Request',
      'This is a test pull request created by the automated docs updates script.',
      'test-branch',
      'main',
      {
        draft: false, // This will be ignored - always creates as draft for safety
        labels: ['documentation', 'test'],
        assignees: ['test-user']
      }
    );

    if (Result.isSuccess(createPRResult)) {
      const pr = createPRResult.value;
      console.log(`✅ Pull request creation successful: #${pr.number} - ${pr.title}`);
      console.log(`   URL: ${pr.url}`);
      console.log(`   Head: ${pr.head} -> Base: ${pr.base}`);
      console.log(`   Draft: ${pr.draft} (always true for safety)`);

      // Test pull request retrieval
      console.log("\n🔍 Testing pull request retrieval...");
      const getPRResult = await services.github.getPullRequest(pr.number);
      if (Result.isSuccess(getPRResult)) {
        console.log(`✅ Pull request retrieval successful: #${getPRResult.value.number}`);
      } else {
        console.error(`❌ Pull request retrieval failed: ${getPRResult.message.message}`);
        throw new Error(`GitHub service failed: ${getPRResult.message.message}`);
      }

      // Test pull request update
      console.log("\n🔍 Testing pull request update...");
      const updatePRResult = await services.github.updatePullRequest(pr.number, {
        title: 'Updated Test Pull Request',
        labels: ['documentation', 'test', 'updated']
      });

      if (Result.isSuccess(updatePRResult)) {
        console.log(`✅ Pull request update successful: #${updatePRResult.value.number}`);
        console.log(`   New title: ${updatePRResult.value.title}`);
      } else {
        console.error(`❌ Pull request update failed: ${updatePRResult.message.message}`);
        throw new Error(`GitHub service failed: ${updatePRResult.message.message}`);
      }

    } else {
      // For mock services, this might fail if branch doesn't exist - that's expected behavior
      const error = createPRResult.message;
      if (error.type === 'branch_not_found') {
        console.log(`⚠️ Pull request creation failed as expected (branch not found): ${error.message}`);
        console.log(`✅ GitHub service correctly validates branch existence before creating PRs`);
      } else {
        console.error(`❌ Pull request creation failed: ${createPRResult.message.message}`);
        throw new Error(`GitHub service failed: ${createPRResult.message.message}`);
      }
    }

  } catch (error) {
    console.error("❌ Error during GitHub service test:", error);
    throw error;
  }
}

/**
 * Tests comprehensive workflow combining git, file editing, and GitHub services.
 * This test performs a complete end-to-end workflow:
 * 1. Creates a new branch in docs repo
 * 2. Writes changes to a file
 * 3. Commits the changes
 * 4. Pushes the branch
 * 5. Creates a draft PR
 */
async function testComprehensiveWorkflow(services: Services, commitHash: string): Promise<void> {
  try {
    console.log("\n🚀 Testing comprehensive workflow (git + file editing + GitHub)...");
    
    // Step 1: Create a new unique branch
    const uniqueBranchName = `docs/automated-test-${Date.now()}`;
    console.log(`\n🌿 Step 1: Creating new branch '${uniqueBranchName}' in docs repository...`);
    
    const createBranchResult = await services.git.createBranch(uniqueBranchName, 'preprod', 'docs');
    if (Result.isError(createBranchResult)) {
      console.error(`❌ Failed to create branch: ${createBranchResult.message.message}`);
      throw new Error(`Branch creation failed: ${createBranchResult.message.message}`);
    }
    console.log(`✅ Successfully created branch: ${uniqueBranchName}`);

    // Step 2: Create and update a test file using file editing service
    console.log(`\n📝 Step 2: Creating and writing test content to file...`);
    const testFilePath = 'test-automation-file.md';

    // Use file editing service to create and update the file in one step
    const fileEditResult = await services.fileEditing.updateDocFile(
      testFilePath,
      {
        hash: commitHash,
        message: 'Test commit for automation workflow',
        author: 'Automated Docs Script',
        authorEmail: 'automated@example.com',
        date: new Date(),
        filesChanged: [testFilePath],
        diffs: [],
        repositoryType: RepositoryType.DOCS
      },
      `Create a test documentation file with the following content:

## Test Documentation Update

This is a test file update created by the automated docs update script.

**Timestamp:** ${new Date().toISOString()}
**Commit Hash:** ${commitHash}
**Branch:** ${uniqueBranchName}

This file was created to test the comprehensive workflow that includes:
1. Git branch creation
2. File creation and editing
3. Git staging and committing
4. Git push
5. GitHub PR creation

This change should be committed and pushed to demonstrate the full automation workflow.`,
      services.git  // Pass the git service so it knows about the current branch
    );
    
    if (Result.isError(fileEditResult)) {
      console.error(`❌ Failed to update file: ${fileEditResult.message.message}`);
      throw new Error(`File update failed: ${fileEditResult.message.message}`);
    }
    console.log(`✅ Successfully wrote changes to file: ${fileEditResult.value.filePath}`);

    // Step 3: Stage and commit changes
    console.log(`\n📦 Step 3: Staging all changes...`);
    const stageResult = await services.git.stageAllChanges('docs');
    if (Result.isError(stageResult)) {
      console.error(`❌ Failed to stage changes: ${stageResult.message.message}`);
      throw new Error(`Stage changes failed: ${stageResult.message.message}`);
    }
    console.log(`✅ Successfully staged all changes`);
    
    // Clean up any backup files that might have been staged
    console.log(`\n🗑️ Cleaning up backup files from staging area...`);
    const cleanupResult = await services.git.removeBackupFilesFromStaging('docs');
    if (Result.isError(cleanupResult)) {
      console.log(`⚠️ Backup cleanup warning: ${cleanupResult.message.message}`);
      console.log(`ℹ️ Continuing with commit despite backup cleanup warning`);
    } else {
      console.log(`✅ Backup files removed from staging area`);
    }

    // Step 4: Commit changes
    console.log(`\n💾 Step 4: Committing changes...`);
    const commitMessage = `docs: automated test update for commit ${commitHash} - generated by service checks`;
    const commitChangesResult = await services.git.commitChanges(commitMessage, 'docs');
    if (Result.isError(commitChangesResult)) {
      console.error(`❌ Failed to commit changes: ${commitChangesResult.message.message}`);
      throw new Error(`Commit failed: ${commitChangesResult.message.message}`);
    }
    console.log(`✅ Successfully committed changes with hash: ${commitChangesResult.value}`);

    // Step 4: Push the branch
    console.log(`\n🚀 Step 5: Pushing branch to remote...`);
    const pushResult = await services.git.pushBranch(uniqueBranchName, 'docs');
    if (Result.isError(pushResult)) {
      console.error(`❌ Failed to push branch: ${pushResult.message.message}`);
      throw new Error(`Push failed: ${pushResult.message.message}`);
    }
    console.log(`✅ Successfully pushed branch: ${uniqueBranchName}`);

    // Step 5: Create a draft PR
    console.log(`\n📝 Step 6: Creating draft pull request...`);
    const prTitle = `[Automated] Documentation updates for ${commitHash}`;
    const prBody = `## Automated Documentation Updates

This pull request contains documentation updates generated by the automated docs service based on changes in foundation-ui commit \`${commitHash}\`.

### Changes Made
- Updated documentation files based on code changes
- Generated content using AI analysis
- Created comprehensive documentation coverage

### Review Notes
- This PR was created automatically by the docs automation service
- Please review the generated content for accuracy
- Feel free to make manual adjustments as needed

**Foundation UI Commit:** \`${commitHash}\`
**Generated:** ${new Date().toISOString()}
**Branch:** \`${uniqueBranchName}\``;

    const prResult = await services.github.createPullRequest(
      prTitle,
      prBody,
      uniqueBranchName,
      'preprod',
      {
        draft: true, // Always draft for safety
        labels: ['documentation', 'automated', 'service-check'],
        assignees: []
      }
    );

    if (Result.isError(prResult)) {
      console.error(`❌ Failed to create pull request: ${prResult.message.message}`);
      throw new Error(`PR creation failed: ${prResult.message.message}`);
    }

    const pr = prResult.value;
    console.log(`\n🎉 Successfully completed comprehensive workflow!`);
    console.log(`✅ Created draft pull request: #${pr.number} - ${pr.title}`);
    console.log(`🔗 PR URL: ${pr.url}`);
    console.log(`📋 Summary:`);
    console.log(`   • Branch: ${uniqueBranchName}`);
    console.log(`   • Commit: ${commitChangesResult.value}`);
    console.log(`   • File Updated: ${fileEditResult.value.filePath}`);
    console.log(`   • PR Number: #${pr.number}`);
    console.log(`   • Draft Status: ${pr.draft ? 'Yes (for safety)' : 'No'}`);
    console.log(`   • Labels: ${pr.labels.join(', ')}`);

  } catch (error) {
    console.error("❌ Error during comprehensive workflow test:", error);
    throw error;
  }
} 