import { existsSync } from 'fs';

export type ScriptName = 'checks' | 'doc-automation';

export interface ScriptArgs {
  scriptName: ScriptName;
  docsRepoPath: string;
  foundationUiRepoPath: string;
  commitHash: string;
  needsDocsRepo: boolean;
  needsFoundationUiRepo: boolean;
}

export function validateAndParseArgs(): ScriptArgs {
  const args = process.argv.slice(2);

  if (args.length !== 4) {
    console.error("Error: This script requires exactly 4 arguments:");
    console.error("Usage: node dist/index.js <script-name> <docs-repo-path> <foundation-ui-repo-path> <commit-hash>");
    console.error("");
    console.error("Arguments:");
    console.error("  script-name         Script to run ('checks' or 'doc-automation')");
    console.error("  docs-repo-path      Path to the documentation repository");
    console.error("  foundation-ui-repo-path  Path to the foundation-ui platform repository");
    console.error("  commit-hash         Git commit hash to process");
    console.error("");
    console.error("Available scripts:");
    console.error("  checks              Run service checks and validation");
    console.error("  doc-automation      Run automated documentation updates");
    process.exit(1);
  }

  const [scriptName, docsRepoPath, foundationUiRepoPath, commitHash] = args;

  // Validate script name
  if (scriptName !== 'checks' && scriptName !== 'doc-automation') {
    console.error(`Error: Invalid script name '${scriptName}'`);
    console.error("Available scripts: 'checks', 'doc-automation'");
    process.exit(1);
  }

  // Check if the paths exist
  const needsDocsRepo = !existsSync(docsRepoPath);
  const needsFoundationUiRepo = !existsSync(foundationUiRepoPath);

  return {
    scriptName: scriptName as ScriptName,
    docsRepoPath,
    foundationUiRepoPath,
    commitHash,
    needsDocsRepo,
    needsFoundationUiRepo
  };
} 