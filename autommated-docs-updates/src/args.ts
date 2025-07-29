import { existsSync } from 'fs';
import { config } from './config';

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

  // Support both 2 arguments (with default paths) and 4 arguments (explicit paths)
  if (args.length !== 2 && args.length !== 4) {
    console.error("Error: This script requires either 2 or 4 arguments:");
    console.error("");
    console.error("Usage with default paths:");
    console.error("  node dist/index.js <script-name> <commit-hash>");
    console.error("");
    console.error("Usage with explicit paths:");
    console.error("  node dist/index.js <script-name> <docs-repo-path> <foundation-ui-repo-path> <commit-hash>");
    console.error("");
    console.error("Arguments:");
    console.error("  script-name         Script to run ('checks' or 'doc-automation')");
    console.error("  docs-repo-path      Path to the documentation repository (optional, defaults to config)");
    console.error("  foundation-ui-repo-path  Path to the foundation-ui platform repository (optional, defaults to config)");
    console.error("  commit-hash         Git commit hash to process");
    console.error("");
    console.error("Available scripts:");
    console.error("  checks              Run service checks and validation");
    console.error("  doc-automation      Run automated documentation updates");
    console.error("");
    console.error(`Default repository paths:`);
    console.error(`  docs: ${config.repositories.docs}`);
    console.error(`  foundation-ui: ${config.repositories.foundationUi}`);
    process.exit(1);
  }

  let scriptName: string;
  let docsRepoPath: string;
  let foundationUiRepoPath: string;
  let commitHash: string;

  if (args.length === 2) {
    // Use default paths from config
    [scriptName, commitHash] = args;
    docsRepoPath = config.repositories.docs;
    foundationUiRepoPath = config.repositories.foundationUi;
  } else {
    // Use explicit paths
    [scriptName, docsRepoPath, foundationUiRepoPath, commitHash] = args;
  }

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