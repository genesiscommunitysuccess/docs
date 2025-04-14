#!/usr/bin/env node
// Direct CLI for testing tools without MCP server

import FilenameSearchTool from './tools/FilenameSearchTool.js';
import { fileSystem } from './services/FileSystem.js';

// Simple test function for the FilenameSearchTool
async function testFilenameSearch() {
  // Get command line arguments, defaulting to "grid pro" if none provided
  const searchTerm = process.argv[2] || "grid pro";
  
  // Parse command line options
  const showApiDocs = process.argv.includes('--show-api');
  
  // Look for --limit=X or -n X parameter
  let maxResults = 20; // Default
  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--limit=')) {
      const limitValue = arg.split('=')[1];
      maxResults = parseInt(limitValue, 10) || 20;
    } else if ((arg === '--limit' || arg === '-n') && i < process.argv.length - 1) {
      maxResults = parseInt(process.argv[i + 1], 10) || 20;
    }
  }
  
  console.log(`Testing FilenameSearchTool with search term: "${searchTerm}"`);
  console.log(`API docs: ${showApiDocs ? 'enabled' : 'disabled'}`);
  console.log(`Max results: ${maxResults}`);
  
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
    console.log("\nRunning search...");
    const result = await tool.execute({ 
      searchString: searchTerm,
      showApiDocs,
      maxResults
    });
    
    console.log("\nResults:");
    console.log(JSON.stringify(result, null, 2));
    
    // If there are more results than what was shown, provide a hint
    if (result.additionalResults && result.additionalResults > 0) {
      console.log(`\nNote: ${result.additionalResults} additional results were found but not shown.`);
      console.log(`Use --limit=${result.totalResults} to see all results.`);
    }
    
    // If not explicitly showing API docs and we're searching for "api", run a comparison search
    if (!showApiDocs && searchTerm.toLowerCase().includes('api')) {
      console.log("\nRunning the same search WITH showApiDocs = true for comparison:");
      const resultWithApi = await tool.execute({ 
        searchString: searchTerm,
        showApiDocs: true,
        maxResults
      });
      
      console.log("\nResults with API docs included:");
      console.log(JSON.stringify(resultWithApi, null, 2));
    }
  } catch (error) {
    console.error("Error executing tool:", error);
    process.exit(1);
  }
}

// Run the test
testFilenameSearch();