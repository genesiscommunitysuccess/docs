import { Services } from '../types/services';
import { Result } from '../types/result';
import { ScriptArgs } from '../args';

export async function runDocAutomation(services: Services, args: ScriptArgs): Promise<void> {
  console.log("\n🚀 Starting main application flow...");

  // Analyze commit with AI service
  console.log("\n🔍 Analyzing commit with AI service...");

  try {
    const updateResult = await services.ai.shouldUpdateDocs(services, args.commitHash);

    if (!Result.isSuccess(updateResult)) {
      console.error(`❌ AI Analysis Error: ${updateResult.message}`);
      process.exit(1);
    }

    const needsUpdate = updateResult.value;
    console.log(`AI Analysis Result: ${needsUpdate ? '📝 Documentation updates needed' : '✅ No documentation updates required'}`);

    if (!needsUpdate) {
      console.log("✨ No action needed - documentation is up to date");
      console.log("\nArguments validated and repositories ready!");
      return;
    }

    console.log("🚀 Proceeding with documentation update process...");

    // Find docs files to edit
    console.log("\n🔍 Finding docs files to edit...");
    const filesResult = await services.ai.findDocsFilesToEdit(services, args.commitHash);

    if (!Result.isSuccess(filesResult)) {
      console.error(`❌ Error finding docs files to edit: ${filesResult.message}`);
      process.exit(1);
    }

    const filesToEdit = filesResult.value;
    console.log(`📁 Found ${filesToEdit.length} docs files to edit:`);
    filesToEdit.forEach((filePath, index) => {
      console.log(`   ${index + 1}. ${filePath}`);
    });

    // Create a new branch for the documentation updates
    console.log("\n🌿 Creating new branch for documentation updates...");
    const timestamp = Date.now();
    const branchName = `docs/update-${args.commitHash.substring(0, 8)}-${timestamp}`;
    console.log(`📝 Branch name: ${branchName}`);

    const createBranchResult = await services.git.createBranch(branchName, 'preprod', 'docs');
    if (Result.isError(createBranchResult)) {
      console.error(`❌ Failed to create branch: ${createBranchResult.message.message}`);
      process.exit(1);
    }

    console.log(`✅ Successfully created and checked out branch: ${branchName}`);

    // Update each documentation file using AI
    console.log("\n✏️ Updating documentation files...");
    let updatedFilesCount = 0;
    let skippedFilesCount = 0;
    let failedFilesCount = 0;

    for (const filePath of filesToEdit) {
      console.log(`\n🔄 Processing: ${filePath}`);

      try {
        const updateResult = await services.ai.updateDocFile(services, args.commitHash, filePath);

        if (Result.isSuccess(updateResult)) {
          const wasUpdated = updateResult.value;
          if (wasUpdated) {
            console.log(`   ✅ Updated successfully`);
            updatedFilesCount++;
          } else {
            console.log(`   ⚪ No changes needed`);
            skippedFilesCount++;
          }
        } else {
          console.log(`   ❌ Update failed: ${updateResult.message}`);
          failedFilesCount++;
        }
      } catch (error) {
        console.log(`   ❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        failedFilesCount++;
      }
    }

    // Summary of updates
    console.log(`\n📊 Documentation Update Summary:`);
    console.log(`   ✅ Files updated: ${updatedFilesCount}`);
    console.log(`   ⚪ Files skipped (no changes): ${skippedFilesCount}`);
    console.log(`   ❌ Files failed: ${failedFilesCount}`);
    console.log(`   📁 Total files processed: ${filesToEdit.length}`);

    if (updatedFilesCount > 0) {
      console.log(`\n🎉 Successfully updated ${updatedFilesCount} documentation file${updatedFilesCount === 1 ? '' : 's'}!`);
      
      // Stage, commit, and push the changes
      console.log("\n📦 Staging changes...");
      
      // First, stage all changes
      const stageResult = await services.git.stageAllChanges('docs');
      if (Result.isError(stageResult)) {
        console.error(`❌ Failed to stage changes: ${stageResult.message.message}`);
        process.exit(1);
      }
      console.log("✅ Changes staged successfully");
      
      // Then, explicitly remove any backup files that might have been staged
      console.log("\n🗑️ Cleaning up backup files from staging area...");
      const cleanupResult = await services.git.removeBackupFilesFromStaging('docs');
      if (Result.isError(cleanupResult)) {
        console.error(`❌ Failed to remove backup files: ${cleanupResult.message.message}`);
        // Don't exit here - this is not critical, just log the warning
        console.log("⚠️ Continuing with commit despite backup cleanup failure");
      } else {
        console.log("✅ Backup files removed from staging area");
      }

      console.log("\n💾 Committing changes...");
      const commitMessage = `docs: update documentation based on commit ${args.commitHash}\n\nAutomated documentation updates for:\n${filesToEdit.map(f => `- ${f}`).join('\n')}\n\nUpdated ${updatedFilesCount} file${updatedFilesCount === 1 ? '' : 's'}`;
      const commitResult = await services.git.commitChanges(commitMessage, 'docs');
      if (Result.isError(commitResult)) {
        console.error(`❌ Failed to commit changes: ${commitResult.message.message}`);
        process.exit(1);
      }
      console.log(`✅ Changes committed successfully (${commitResult.value})`);

      console.log("\n🚀 Pushing branch to remote...");
      const pushResult = await services.git.pushBranch(branchName, 'docs');
      if (Result.isError(pushResult)) {
        console.error(`❌ Failed to push branch: ${pushResult.message.message}`);
        process.exit(1);
      }
      console.log(`✅ Branch ${branchName} pushed to remote successfully`);
      
      // Create a pull request
      console.log("\n📋 Creating pull request...");
      const prTitle = `docs: update documentation based on commit ${args.commitHash.substring(0, 8)}`;
      const prBody = `## Automated Documentation Updates

This pull request contains automated documentation updates based on commit \`${args.commitHash}\`.

### Files Updated:
${filesToEdit.map(f => `- \`${f}\``).join('\n')}

### Summary:
- ✅ **${updatedFilesCount}** file${updatedFilesCount === 1 ? '' : 's'} updated
- ⚪ **${skippedFilesCount}** file${skippedFilesCount === 1 ? '' : 's'} skipped (no changes needed)
- ❌ **${failedFilesCount}** file${failedFilesCount === 1 ? '' : 's'} failed

### Review Notes:
- This PR was automatically generated by the docs automation system
- Please review the changes to ensure they are accurate and appropriate
- The AI has attempted to maintain formatting and document structure

---
*Generated by automated docs system*`;

      const prResult = await services.github.createPullRequest(
        prTitle,
        prBody,
        branchName,
        'preprod',
        {
          draft: true, // Always create as draft for safety
          labels: ['documentation', 'automated'],
          assignees: [] // Could be configured to assign specific reviewers
        }
      );

      if (Result.isSuccess(prResult)) {
        const pr = prResult.value;
        console.log(`✅ Pull request created successfully!`);
        console.log(`   📋 PR #${pr.number}: ${pr.title}`);
        console.log(`   🔗 URL: ${pr.url}`);
        console.log(`   📝 Status: ${pr.draft ? 'Draft' : 'Ready for review'}`);
        console.log(`   🏷️  Labels: ${pr.labels.join(', ')}`);
      } else {
        console.log(`⚠️ Pull request creation failed: ${prResult.message.message}`);
        console.log(`🔗 Manual step: Create a pull request from ${branchName} to preprod`);
      }
      
    } else if (skippedFilesCount === filesToEdit.length) {
      console.log(`\n✨ All documentation files are already up to date!`);
      console.log(`\n🧹 Cleaning up: No changes were made, so the branch ${branchName} can be deleted`);
    } else {
      console.log(`\n⚠️ Some files could not be updated. Check the logs above for details.`);
      console.log(`\n🔍 The branch ${branchName} has been created but may need manual intervention`);
    }

  } catch (error) {
    console.error("❌ Error during AI analysis:", error);
    process.exit(1);
  }

  console.log("\nArguments validated and repositories ready!");
}
