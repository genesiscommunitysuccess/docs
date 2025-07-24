import { existsSync } from 'fs';

export interface ScriptArgs {
  docsRepoPath: string;
  foundationUiRepoPath: string;
  needsDocsRepo: boolean;
  needsFoundationUiRepo: boolean;
}

export function validateAndParseArgs(): ScriptArgs {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Error: This script requires exactly 2 arguments:");
    console.error("Usage: node dist/index.js <docs-repo-path> <foundation-ui-repo-path>");
    console.error("");
    console.error("Arguments:");
    console.error("  docs-repo-path      Path to the documentation repository");
    console.error("  foundation-ui-repo-path  Path to the foundation-ui platform repository");
    process.exit(1);
  }

  const [docsRepoPath, foundationUiRepoPath] = args;

  // Check if the paths exist
  const needsDocsRepo = !existsSync(docsRepoPath);
  const needsFoundationUiRepo = !existsSync(foundationUiRepoPath);

  return {
    docsRepoPath,
    foundationUiRepoPath,
    needsDocsRepo,
    needsFoundationUiRepo
  };
} 