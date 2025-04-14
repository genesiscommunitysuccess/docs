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
    const response = await tool.execute({
      filePath,
      offset: offset || undefined,
      maxLines: maxLines || undefined,
    });

    console.log('\nRaw Response:');
    console.log(response);

    // Handle the response
    if (typeof response === 'string') {
      // Check if it's an error response
      if (response.startsWith('ERROR:')) {
        console.log(`\n${response}`);
        process.exit(1);
      }

      // Handle the format with header and content separated by ---
      if (response.includes('---')) {
        const [header, content] = response.split('\n\n---\n\n');

        // Display the header information
        console.log(`\n${header}`);

        // Calculate some additional information about the content
        const contentLines = content.split('\n');
        console.log(`Lines: ${contentLines.length}`);
        console.log(`Size: ${content.length} bytes`);

        // Show preview of the content
        console.log('\nContent Preview:');
        console.log('----------------------------------------');
        console.log(content.slice(0, 500) + (content.length > 500 ? '...' : ''));
        console.log('----------------------------------------');

        // Provide instructions for viewing entire content or specific parts
        console.log(
          '\nTo see more content, use: node dist/test-cli.js view <path> [offset] [maxLines]'
        );
        console.log(`For example: node dist/test-cli.js view ${filePath} 10 20`);
      } else {
        // Unknown response format
        console.log('Unexpected response format:');
        console.log(response);
      }
    } else {
      console.error('Unexpected response type:', typeof response);
    }
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

main();
