#!/usr/bin/env node
// Direct CLI for testing tools without MCP server

import FilenameSearchTool from './tools/FilenameSearchTool.js';
import { fileSystem } from './services/FileSystem.js';

// Simple test function for the FilenameSearchTool
async function testFilenameSearch() {
  // Get command line arguments, defaulting to "grid pro" if none provided
  const searchTerm = process.argv[2] || "grid pro";
  
  console.log(`Testing FilenameSearchTool with search term: "${searchTerm}"`);
  
  // First ensure we have docs files
  const files = await fileSystem.docsFiles();
  console.log(`Found ${files.length} documentation files`);
  
  if (files.length === 0) {
    console.log("No documentation files found. Please run 'npm run copy-docs' first");
    process.exit(1);
  }
  
  // Create and execute the tool
  try {
    const tool = new FilenameSearchTool();
    const result = await tool.execute({ searchString: searchTerm });
    
    console.log("\nResults:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error executing tool:", error);
    process.exit(1);
  }
}

// Run the test
testFilenameSearch();