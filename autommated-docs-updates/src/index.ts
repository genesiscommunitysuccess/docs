import { validateAndParseArgs } from './args';

// Validate and parse command line arguments
const args = validateAndParseArgs();

console.log("=== Automated Docs Updates Script ===");
console.log(`Docs Repository: ${args.docsRepoPath}`);
console.log(`Foundation UI Repository: ${args.foundationUiRepoPath}`);
console.log("Arguments validated successfully!"); 