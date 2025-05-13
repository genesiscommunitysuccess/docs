#!/usr/bin/env node
// Direct CLI for testing tools without MCP server

import FilenameSearchTool from './tools/FilenameSearchTool.js';
import DocContentSearchTool from './tools/DocContentSearchTool.js';
import DocFileViewTool from './tools/DocFileViewTool.js';
import RulesViewTool from './tools/RulesViewTool.js';
import GenesisDocsReadmeTool from './tools/GenesisDocsReadmeTool.js';
import { fileSystem } from './services/FileSystem.js';

// Enum for selecting which tool to test
enum TestTool {
  FilenameSearch = 'filename',
  ContentSearch = 'content',
  FileView = 'fileview',
  RulesView = 'rules',
  ToolsInfo = 'info',
  All = 'all',
}

// Parse command-line options for filename search
interface FilenameSearchOptions {
  searchTerm: string;
  showApiDocs: string;
  strictWordBoundaries: string;
}

// Simple test function for the FilenameSearchTool
async function testFilenameSearch(searchTerm: string, options: FilenameSearchOptions) {
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

    // If not explicitly showing API docs and we're searching for "api", run a comparison search
    if (options.showApiDocs !== 'true' && searchTerm.toLowerCase().includes('api')) {
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
    console.error('Error executing FilenameSearchTool:', error);
  }
}

// Function to test the content search tool
async function testContentSearch(searchTerm: string, showContent = false) {
  console.log(`\nTesting DocContentSearchTool with search term: "${searchTerm}"`);
  console.log(`Show content: ${showContent ? 'enabled' : 'disabled'}`);

  try {
    const tool = new DocContentSearchTool();
    console.log('\nRunning content search...');
    const result = await tool.execute({
      searchString: searchTerm,
      showContent: showContent ? 'true' : '',
    });

    console.log('\nResults:');
    console.log(result);
  } catch (error) {
    console.error('Error executing DocContentSearchTool:', error);
  }
}

// Function to test the file view tool
async function testFileView(filePath: string, offset?: number, maxLines?: number) {
  console.log(`\nTesting DocFileViewTool with file: "${filePath}"`);
  if (offset !== undefined) console.log(`Offset: ${offset}`);
  if (maxLines !== undefined) console.log(`Max lines: ${maxLines}`);

  try {
    const tool = new DocFileViewTool();
    console.log('\nReading file...');
    const result = await tool.execute({
      filePath,
      offset,
      maxLines,
    });

    console.log('\nFile content:');
    console.log(result);
  } catch (error) {
    console.error('Error executing DocFileViewTool:', error);
  }
}

// Function to test the rules view tool
async function testRulesView(ruleName?: string) {
  console.log('\nTesting RulesViewTool');

  try {
    const tool = new RulesViewTool();

    if (ruleName) {
      console.log(`Looking up rule: ${ruleName}`);
      const result = await tool.execute({ ruleName });
      console.log('\nRule content:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('Listing all rules');
      const result = await tool.execute({ listRules: 'true' });
      console.log('\nAvailable rules:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error executing RulesViewTool:', error);
  }
}

// Function to test the docs readme tool
async function testDocsReadme(detail?: string) {
  console.log('\nTesting GenesisDocsReadmeTool');

  try {
    const tool = new GenesisDocsReadmeTool();

    if (detail) {
      console.log(`Getting detailed info about: ${detail}`);
      const result = await tool.execute({ detail });
      console.log('\nDetailed info:');
      console.log(result);
    } else {
      console.log('Getting general overview');
      const result = await tool.execute({});
      console.log('\nTools overview:');
      console.log(result);
    }
  } catch (error) {
    console.error('Error executing GenesisDocsReadmeTool:', error);
  }
}

// Main function to parse command line args and determine which tool to run
async function main() {
  // Check for docs files
  const files = await fileSystem.docsFiles();
  console.log(`Found ${files.length} documentation files`);

  if (files.length === 0) {
    console.error("No documentation files found. Please run 'npm run copy-docs' first");
    process.exit(1);
  }

  // Default to filename search if no tool specified
  let toolToRun = TestTool.FilenameSearch;

  // Parse the tool selection
  const toolArg = process.argv.find((arg) => arg.startsWith('--tool=') || arg.startsWith('-t='));

  if (toolArg) {
    const toolValue = toolArg.split('=')[1].toLowerCase();
    if (Object.values(TestTool).includes(toolValue as TestTool)) {
      toolToRun = toolValue as TestTool;
    } else {
      console.error(
        `Unknown tool: ${toolValue}. Available tools: ${Object.values(TestTool).join(', ')}`
      );
      process.exit(1);
    }
  }

  // Get the search term - need to skip node path, script path, and any flag arguments
  let searchTerm = 'grid'; // Default value
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg.startsWith('-') && !process.argv[i - 1]?.startsWith('--')) {
      // Remove any surrounding quotes if present
      searchTerm = arg.replace(/^["'](.*)["']$/, '$1');
      break;
    }
  }

  // Parse common options
  const showApiDocs = process.argv.includes('--show-api') ? 'true' : '';
  const strictWordBoundaries = process.argv.includes('--no-strict-boundaries') ? 'false' : 'true';
  const showContent = process.argv.includes('--show-content');

  // Parse file view options
  const filePathArg = process.argv.find((arg) => arg.startsWith('--file='));
  const filePath = filePathArg ? filePathArg.split('=')[1] : undefined;

  const offsetArg = process.argv.find((arg) => arg.startsWith('--offset='));
  const offset = offsetArg ? parseInt(offsetArg.split('=')[1], 10) : undefined;

  const maxLinesArg = process.argv.find((arg) => arg.startsWith('--max-lines='));
  const maxLines = maxLinesArg ? parseInt(maxLinesArg.split('=')[1], 10) : undefined;

  // Parse rules view options
  const ruleNameArg = process.argv.find((arg) => arg.startsWith('--rule='));
  const ruleName = ruleNameArg ? ruleNameArg.split('=')[1] : undefined;

  // Parse tools info options
  const detailArg = process.argv.find((arg) => arg.startsWith('--detail='));
  const detail = detailArg ? detailArg.split('=')[1] : undefined;

  // Run selected tool(s)
  switch (toolToRun) {
    case TestTool.FilenameSearch:
      await testFilenameSearch(searchTerm, {
        searchTerm,
        showApiDocs,
        strictWordBoundaries,
      });
      break;

    case TestTool.ContentSearch:
      await testContentSearch(searchTerm, showContent);
      break;

    case TestTool.FileView:
      if (!filePath) {
        console.error('Error: --file parameter is required for file view tool');
        process.exit(1);
      }
      await testFileView(filePath, offset, maxLines);
      break;

    case TestTool.RulesView:
      await testRulesView(ruleName);
      break;

    case TestTool.ToolsInfo:
      await testDocsReadme(detail);
      break;

    case TestTool.All:
      console.log('=== Running all tools ===');
      await testFilenameSearch(searchTerm, {
        searchTerm,
        showApiDocs,
        strictWordBoundaries,
      });
      await testContentSearch(searchTerm, showContent);
      if (filePath) {
        await testFileView(filePath, offset, maxLines);
      }
      await testRulesView(ruleName);
      await testDocsReadme(detail);
      break;

    default:
      console.error(`Unsupported tool: ${toolToRun}`);
      process.exit(1);
  }
}

// Display help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Genesis Documentation Tools CLI Tester

Usage:
  npm run manual-test -- [search-term] [options]

Tool Selection:
  --tool=<tool-name>, -t=<tool-name>    Tool to run (default: filename)
                                       Available tools: filename, content, fileview, rules, info, all

Common Options:
  --show-api                           Include API docs in search results
  --no-strict-boundaries               Disable strict word boundaries for search
  --show-content                       Show content in content search results

FilenameSearch Options:
  [search-term]                        Term to search for (default: "grid-pro")

ContentSearch Options:
  [search-term]                        Term to search for content

FileView Options:
  --file=<file-path>                   Path to the file to view (required)
  --offset=<number>                    Line to start viewing from
  --max-lines=<number>                 Maximum number of lines to view

RulesView Options:
  --rule=<rule-name>                   Name of rule to view (if omitted, lists all rules)

ToolsInfo Options:
  --detail=<detail-name>               Detail to show (if omitted, shows overview)

Examples:
  npm run manual-test -- "grid-pro"                       # Search for "grid-pro" using FilenameSearchTool
  npm run manual-test -- --tool=content "function"        # Search for "function" in content
  npm run manual-test -- --tool=fileview --file=docs/index.md  # View a specific file
  npm run manual-test -- --tool=rules                     # List all rules
  npm run manual-test -- --tool=rules --rule=genesis-general-rules.mdc  # View a specific rule
  npm run manual-test -- --tool=info --detail=search      # Get detailed info about search tools
  npm run manual-test -- --tool=info --detail=best-practices      # Get detailed info about best practices
  npm run manual-test -- --tool=all "grid"                # Run all tools with "grid" as search term
  `);
  process.exit(0);
}

// Run the main function
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
