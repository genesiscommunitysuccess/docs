#!/usr/bin/env node
// CLI for testing tools

import FilenameSearchTool from './tools/FilenameSearchTool.js';
import DocFileViewTool from './tools/DocFileViewTool.js';
import RulesViewTool from './tools/RulesViewTool.js';
import { fileSystem } from './services/FileSystem.js';

const TOOL_TYPES = {
  SEARCH: 'search',
  VIEW: 'view',
  RULES: 'rules',
};

async function main() {
  // Determine which tool to test based on the first argument
  const toolType = process.argv[2]?.toLowerCase() || TOOL_TYPES.SEARCH;

  if (toolType === TOOL_TYPES.SEARCH) {
    await testFilenameSearch();
  } else if (toolType === TOOL_TYPES.VIEW) {
    await testDocFileView();
  } else if (toolType === TOOL_TYPES.RULES) {
    await testRulesView();
  } else {
    console.log(`Unknown tool type: ${toolType}`);
    console.log(`Available tool types: ${Object.values(TOOL_TYPES).join(', ')}`);
    console.log('Usage: node dist/test-cli.js [tool] [arguments...]');
    console.log('Examples:');
    console.log('  Search: node dist/test-cli.js search "grid pro"');
    console.log('  View: node dist/test-cli.js view docs/001_develop/index.md [offset] [maxLines]');
    console.log('  Rules: node dist/test-cli.js rules [ruleName]');
    process.exit(1);
  }
}

async function testFilenameSearch() {
  // Get command line arguments, defaulting to "grid pro" if none provided
  const searchTerm = process.argv[3] || 'grid pro';

  // Parse options
  const showApiDocs = process.argv.includes('--show-api') ? 'true' : '';
  const strictWordBoundaries = process.argv.includes('--no-strict-boundaries') ? 'false' : 'true';

  console.log(`Testing FilenameSearchTool with search term: "${searchTerm}"`);
  console.log(`API docs: ${showApiDocs === 'true' ? 'enabled' : 'disabled'}`);
  console.log(
    `Strict word boundaries: ${strictWordBoundaries === 'true' ? 'enabled' : 'disabled'}`
  );

  try {
    const tool = new FilenameSearchTool();
    const result = await tool.execute({
      searchString: searchTerm,
      showApiDocs,
      strictWordBoundaries,
    });

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

    // Handle the new object response format
    if (response && typeof response === 'object') {
      if ('error' in response) {
        console.log(`\n${response.error}`);
        process.exit(1);
      }
      // Print file content
      if ('fileContent' in response) {
        const { fileContent, siblingFiles } = response;
        // Print the header and content
        if (fileContent.includes('---')) {
          const [header, content] = fileContent.split('\n\n---\n\n');
          console.log(`\n${header}`);
          const contentLines = content.split('\n');
          console.log(`Lines: ${contentLines.length}`);
          console.log(`Size: ${content.length} bytes`);
          console.log('\nContent Preview:');
          console.log('----------------------------------------');
          console.log(content.slice(0, 500) + (content.length > 500 ? '...' : ''));
          console.log('----------------------------------------');
        } else {
          console.log(fileContent);
        }
        // Print sibling files
        if (Array.isArray(siblingFiles)) {
          console.log('\nSibling files in the same directory:');
          siblingFiles.forEach((f) => console.log(`- ${f}`));
        }
      } else {
        console.log('Unexpected response format:', response);
      }
    } else {
      console.log('Unexpected response type:', typeof response);
    }
  } catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
  }
}

async function testRulesView() {
  // Get the rule name from command line args or use list mode
  const ruleName = process.argv[3];

  try {
    const tool = new RulesViewTool();
    let result;

    if (!ruleName || ruleName === 'list') {
      // List all available rules
      console.log('Listing all Genesis coding standard rules:');
      result = await tool.execute({ listRules: 'true' });

      if (result && typeof result === 'object' && 'ruleFiles' in result) {
        const { ruleFiles } = result;
        console.log('\nAvailable rules:');
        ruleFiles.forEach((rule, index) => {
          console.log(`${index + 1}. ${rule}`);
        });
        console.log('\nTo view a specific rule, use: node dist/test-cli.js rules <ruleName>');
      } else {
        console.log('\nUnexpected result format:', result);
      }
    } else {
      // View a specific rule
      console.log(`Viewing Genesis coding standard rule: ${ruleName}`);
      result = await tool.execute({ ruleName });

      if (result && typeof result === 'object' && 'content' in result) {
        console.log('\nRule Content:');
        console.log('----------------------------------------');
        console.log(result.content);
        console.log('----------------------------------------');
      } else {
        console.log('\nError or unexpected result format:', result);
      }
    }
  } catch (error) {
    console.error('Error during rules test:', error);
    process.exit(1);
  }
}

main();
