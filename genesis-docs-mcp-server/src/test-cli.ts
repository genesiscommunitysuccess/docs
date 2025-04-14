#!/usr/bin/env node
// CLI for testing tools

import FilenameSearchTool from './tools/FilenameSearchTool.js';
import DocFileViewTool from './tools/DocFileViewTool.js';
import { fileSystem } from './services/FileSystem.js';

const TOOL_TYPES = {
  SEARCH: 'search',
  VIEW: 'view',
};

async function main() {
  // Determine which tool to test based on the first argument
  const toolType = process.argv[2]?.toLowerCase() || TOOL_TYPES.SEARCH;

  if (toolType === TOOL_TYPES.SEARCH) {
    await testFilenameSearch();
  } else if (toolType === TOOL_TYPES.VIEW) {
    await testDocFileView();
  } else {
    console.log(`Unknown tool type: ${toolType}`);
    console.log(`Available tool types: ${Object.values(TOOL_TYPES).join(', ')}`);
    console.log('Usage: node dist/test-cli.js [tool] [arguments...]');
    console.log('Examples:');
    console.log('  Search: node dist/test-cli.js search "grid pro"');
    console.log('  View: node dist/test-cli.js view docs/001_develop/index.md [offset] [maxLines]');
    process.exit(1);
  }
}

async function testFilenameSearch() {
  // Get command line arguments, defaulting to "grid pro" if none provided
  const searchTerm = process.argv[3] || 'grid pro';

  console.log(`Testing FilenameSearchTool with search term: "${searchTerm}"`);

  try {
    const tool = new FilenameSearchTool();
    const result = await tool.execute({ searchString: searchTerm });

    console.log('\nResults:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

async function testDocFileView() {
  // Determine the file path from command line args or use a default
  const filePath =
    process.argv[3] ||
    'docs/001_develop/03_client-capabilities/006_charts/docs/api/g2plot-chart.g2plotchartscomponents.md';

  // Parse any other options from command line
  const offset = parseInt(process.argv[4] || '0', 10);
  const maxLines = parseInt(process.argv[5] || '0', 10);

  console.log(`Testing DocFileViewTool with file: "${filePath}"`);
  if (offset || maxLines) {
    console.log(`Using offset: ${offset}, maxLines: ${maxLines || 'all'}`);
  }

  // First ensure we have docs files
  const files = await fileSystem.docsFiles();
  console.log(`Found ${files.length} documentation files in total`);

  if (files.length === 0) {
    console.log("No documentation files found. Please run 'npm run copy-docs' first");
    process.exit(1);
  }

  // Create and execute the tool
  try {
    const tool = new DocFileViewTool();
    const result = await tool.execute({
      filePath,
      offset: offset || undefined,
      maxLines: maxLines || undefined,
    });

    console.log('\nResults:');

    // Check if there was an error
    if ('error' in result && result.error) {
      console.log(`Error: ${result.message}`);
      process.exit(1);
    }

    // Display some info about the file
    if ('content' in result && result.content) {
      const contentLines = result.content.split('\n');
      console.log(`\nFile: ${result.filePath}`);
      console.log(`Lines: ${contentLines.length}`);
      console.log(`Size: ${result.content.length} bytes`);

      if (result.isTruncated) {
        console.log(
          `Showing lines ${result.offset} to ${result.offset! + contentLines.length} (truncated)`
        );
      }

      // Show first few lines of content for preview
      console.log('\nContent Preview:');
      console.log('----------------------------------------');
      console.log(result.content.slice(0, 500) + (result.content.length > 500 ? '...' : ''));
      console.log('----------------------------------------');

      // Provide instructions for viewing entire content or specific parts
      console.log(
        '\nTo see more content, use: node dist/test-cli.js view <path> [offset] [maxLines]'
      );
      console.log(`For example: node dist/test-cli.js view ${filePath} 10 20`);
    }
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

main();
