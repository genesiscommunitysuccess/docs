#!/usr/bin/env node
// Direct CLI for testing tools without MCP server

import FilenameSearchTool from './tools/FilenameSearchTool.js';
import { fileSystem } from './services/FileSystem.js';

// Simple test function for the FilenameSearchTool
async function testFilenameSearch(
  searchTerm: string,
  options: { showApiDocs: string; strictWordBoundaries: string }
) {
  console.log(`Testing FilenameSearchTool with search term: "${searchTerm}"`);
  console.log(`API docs: ${options.showApiDocs === 'true' ? 'enabled' : 'disabled'}`);
  console.log(
    `Strict word boundaries: ${options.strictWordBoundaries === 'true' ? 'enabled' : 'disabled'}`
  );

  // Create and execute the tool
  try {
    const tool = new FilenameSearchTool();
    console.log('\nRunning filename search...');
    const result = await tool.execute({
      searchString: searchTerm,
      showApiDocs: options.showApiDocs,
      strictWordBoundaries: options.strictWordBoundaries,
    });

    console.log('\nResults:');
    console.log(JSON.stringify(result, null, 2));

    // If there are more results than what was shown, provide a hint
    // If not explicitly showing API docs and we're searching for "api", run a comparison search
    if (!options.showApiDocs && searchTerm.toLowerCase().includes('api')) {
      console.log('\nRunning the same search WITH showApiDocs = true for comparison:');
      const resultWithApi = await tool.execute({
        searchString: searchTerm,
        showApiDocs: 'true',
        strictWordBoundaries: options.strictWordBoundaries,
      });

      console.log('\nResults with API docs included:');
      console.log(JSON.stringify(resultWithApi, null, 2));
    }
  } catch (error) {
    console.error('Error executing tool:', error);
    process.exit(1);
  }
}

// Function to test the new content search functionality
async function testContentSearch(searchTerm: string) {
  console.log(`\nTesting searchDocFiles with search term: "${searchTerm}"`);

  try {
    console.log('\nRunning content search...');
    const results = await fileSystem.searchDocFiles(searchTerm);

    console.log(`\nFound matches in ${results.length} files.`);

    if (results.length > 0) {
      // Display some stats about the results
      const totalMatches = results.reduce((total, file) => total + file.matches.length, 0);
      console.log(`Total matching lines across all files: ${totalMatches}`);

      // Show the top 3 files with the most matches
      const sortedResults = [...results].sort((a, b) => b.matches.length - a.matches.length);
      console.log('\nTop files with matches:');
      sortedResults.slice(0, 3).forEach((file, index) => {
        console.log(
          `${index + 1}. ${file.filePath} (${file.matches.length} matches, ${file.totalLines} total lines)`
        );

        // Show a sample of the first 2 matching lines for each file
        console.log('   Sample matches:');
        file.matches.slice(0, 2).forEach((match) => {
          console.log(
            `   Line ${match.line} (offset: ${match.offset}): ${match.text.substring(0, 80)}${match.text.length > 80 ? '...' : ''}`
          );
        });
        if (file.matches.length > 2) {
          console.log(`   ... and ${file.matches.length - 2} more matches`);
        }

        // Show usage example with DocFileViewTool
        const firstMatch = file.matches[0];
        console.log('\n   Usage with DocFileViewTool:');
        console.log(
          `   DocFileViewTool.execute({ filePath: "${file.filePath}", offset: ${firstMatch.offset}, maxLines: 10 })`
        );
      });

      if (results.length > 3) {
        console.log(`\n... and ${results.length - 3} more files with matches`);
      }

      // Show results in JSON format that could be consumed by AI
      console.log('\nJSON results format (sample):');
      console.log(JSON.stringify(sortedResults[0], null, 2));
    } else {
      console.log('No matches found.');
    }
  } catch (error) {
    console.error('Error during content search:', error);
  }
}

// Main test function
async function runTests() {
  // Get command line arguments, defaulting to "grid pro" if none provided
  const searchTerm = process.argv[2] || 'grid pro';

  // Parse command line options
  const showApiDocs = process.argv.includes('--show-api') ? 'true' : '';
  const strictWordBoundaries = process.argv.includes('--strict-word-boundaries') ? 'true' : '';
  const contentSearchOnly = process.argv.includes('--content-only');
  const filenameSearchOnly = process.argv.includes('--filename-only');

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

  // First ensure we have docs files
  const files = await fileSystem.docsFiles();
  console.log(`Found ${files.length} documentation files`);

  if (files.length === 0) {
    console.log("No documentation files found. Please run 'npm run copy-docs' first");
    process.exit(1);
  }

  // Run the appropriate tests based on flags
  if (!contentSearchOnly) {
    await testFilenameSearch(searchTerm, { strictWordBoundaries, showApiDocs });
  }

  if (!filenameSearchOnly) {
    await testContentSearch(searchTerm);
  }
}

// Run the tests
runTests();
