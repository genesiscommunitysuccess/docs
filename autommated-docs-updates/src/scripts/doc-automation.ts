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
    } else if (skippedFilesCount === filesToEdit.length) {
      console.log(`\n✨ All documentation files are already up to date!`);
    } else {
      console.log(`\n⚠️ Some files could not be updated. Check the logs above for details.`);
    }

  } catch (error) {
    console.error("❌ Error during AI analysis:", error);
    process.exit(1);
  }

  console.log("\nArguments validated and repositories ready!");
}
