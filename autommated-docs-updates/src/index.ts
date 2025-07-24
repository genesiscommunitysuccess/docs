import { validateAndParseArgs } from './args';
import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';

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

console.log("Arguments validated and repositories ready!"); 