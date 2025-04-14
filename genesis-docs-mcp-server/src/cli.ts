#!/usr/bin/env node
// Direct CLI for testing tools

import FilenameSearchTool from './tools/FilenameSearchTool';

async function main() {
  // Get command line arguments, defaulting to "grid pro" if none provided
  const searchTerm = process.argv[2] || "grid pro";
  
  console.log(`Testing FilenameSearchTool with search term: "${searchTerm}"`);
  
  try {
    const tool = new FilenameSearchTool();
    const result = await tool.execute({ searchString: searchTerm });
    
    console.log("\nResults:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error during test:", error);
    process.exit(1);
  }
}

main();