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
    
    // TODO: Implement documentation update logic for the identified files
    console.log("🔄 Documentation update logic will be implemented in the next phase");
    
  } catch (error) {
    console.error("❌ Error during AI analysis:", error);
    process.exit(1);
  }

  console.log("\nArguments validated and repositories ready!");
} 