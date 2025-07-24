import { existsSync } from 'fs';

export interface ScriptArgs {
  docsRepoPath: string;
  foundationUiRepoPath: string;
  commitHash: string;
  needsDocsRepo: boolean;
  needsFoundationUiRepo: boolean;
}

export function validateAndParseArgs(): ScriptArgs {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.error("Error: This script requires exactly 3 arguments:");
    console.error("Usage: node dist/index.js <docs-repo-path> <foundation-ui-repo-path> <commit-hash>");
    console.error("");
    console.error("Arguments:");
    console.error("  docs-repo-path      Path to the documentation repository");
    console.error("  foundation-ui-repo-path  Path to the foundation-ui platform repository");
    console.error("  commit-hash         Git commit hash to process");
    process.exit(1);
  }

  const [docsRepoPath, foundationUiRepoPath, commitHash] = args;

  // Check if the paths exist
  const needsDocsRepo = !existsSync(docsRepoPath);
  const needsFoundationUiRepo = !existsSync(foundationUiRepoPath);

  return {
    docsRepoPath,
    foundationUiRepoPath,
    commitHash,
    needsDocsRepo,
    needsFoundationUiRepo
  };
} 