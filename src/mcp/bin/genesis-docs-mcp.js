#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Calculate the root directory of the package
// When installed globally, bin is in node_modules/genesis-docs-mcp/bin
// and index.js is in node_modules/genesis-docs-mcp/
const packageRoot = resolve(__dirname, '..');

// Check if index.js exists in the expected location
const indexPath = resolve(packageRoot, 'index.js');
if (!fs.existsSync(indexPath)) {
  console.error(`Error: Cannot find MCP server entry point at ${indexPath}`);
  console.error('Please reinstall the package with: npm install -g genesis-docs-mcp');
  process.exit(1);
}

console.log(`Starting Genesis Docs MCP server from ${packageRoot}`);

// Run the MCP server
const server = spawn('node', [indexPath], {
  stdio: 'inherit',
  cwd: packageRoot
});

// Handle server exit
server.on('close', (code) => {
  process.exit(code);
});

// Handle process signals
process.on('SIGINT', () => {
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});