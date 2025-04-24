import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

interface GenesisToolsInfoInput {
  detail?: string;
}

class GenesisToolsInfoTool extends MCPTool<GenesisToolsInfoInput> {
  name = 'genesis-tools-info';
  description =
    'Provides information about the available Genesis documentation tools and how to use them effectively with AI';

  schema = {
    detail: {
      type: z.string().optional(),
      description:
        'Optional parameter to get detailed information about a specific aspect of the tools (e.g., "search", "rules", "files")',
    },
  };

  async execute(input: GenesisToolsInfoInput) {
    // Return information based on the requested detail or general information if no detail specified
    if (input.detail) {
      return this.getDetailedInfo(input.detail);
    }

    return this.getOverview();
  }

  private getOverview(): string {
    return `# Genesis Documentation Tools Guide

Welcome to the Genesis Documentation tools. These tools are designed to help AI assistants effectively work with Genesis documentation.

## Available Tools

### 🔍 Search Tools

- **filename-search**: Search for documentation files by name with fuzzy matching
- **doc-content-search**: Search for specific text within documentation files

### 📄 Content Tools

- **doc-file-view**: View the contents of a documentation file
- **rules-view**: Read Genesis coding standards and conventions

## How to Use These Tools Together

Typical workflows include:

1. **Finding relevant documentation**:
   - First, use \`filename-search\` to locate files related to your topic
   - Then use \`doc-file-view\` to read those files

2. **Searching for specific information**:
   - Use \`doc-content-search\` to find mentions of specific terms
   - Use \`doc-file-view\` to read the files that contain those terms

3. **Understanding coding standards**:
   - Use \`rules-view\` to list available coding rules
   - Use \`rules-view\` with a specific ruleName to read particular standards

For more detailed information about each tool, provide a 'detail' parameter with values like 'search', 'files', or 'rules'.`;
  }

  private getDetailedInfo(detail: string): string {
    const lowerDetail = detail.toLowerCase();

    if (lowerDetail.includes('search')) {
      return this.getSearchToolsInfo();
    } else if (lowerDetail.includes('file') || lowerDetail.includes('content')) {
      return this.getFileToolsInfo();
    } else if (
      lowerDetail.includes('rule') ||
      lowerDetail.includes('standard') ||
      lowerDetail.includes('convention')
    ) {
      return this.getRulesToolsInfo();
    } else {
      return `No detailed information available for "${detail}". Try using "search", "files", or "rules" as the detail parameter.`;
    }
  }

  private getSearchToolsInfo(): string {
    return `# Genesis Documentation Search Tools

## 🔍 filename-search

This tool allows you to find documentation files by their names. It uses fuzzy matching to find files even when the search term isn't an exact match.

### Parameters:
- \`searchString\`: The text to search for in filenames
- \`showApiDocs\`: (Optional) Set to true to include API documentation in results
- \`maxResults\`: (Optional) Maximum number of results to return (default: 20)

### Example Usage:
\`\`\`
filename-search({ searchString: "grid" })
\`\`\`

### Response Format:
- For exact matches: Returns an object with \`exactMatches: true\` and an array of matching paths
- For fuzzy matches: Returns formatted text with filenames and paths

## 🔍 doc-content-search

This tool searches within the content of documentation files for specific text.

### Parameters:
- \`searchString\`: The text to search for inside documentation files
- \`showContent\`: (Optional) Set to "true" to display the matching line content

### Example Usage:
\`\`\`
doc-content-search({ searchString: "dataserver", showContent: "true" })
\`\`\`

### Response Format:
Returns a formatted list of files containing matches, with file paths and line numbers where matches occur. If \`showContent\` is set to "true", it also includes the text of the matching lines.

## Best Practices for Searching

1. **Start broad, then narrow down**: Begin with general search terms, then refine based on results
2. **Use multiple search terms**: If you get too many results, add more specific terms
3. **Chain searches**: Use \`filename-search\` to find relevant files, then \`doc-content-search\` to find specific information in those files
4. **Look for patterns**: Notice directory structures and naming conventions to predict where information might be located`;
  }

  private getFileToolsInfo(): string {
    return `# Genesis Documentation File Tools

## 📄 doc-file-view

This tool allows you to view the contents of a documentation file.

### Parameters:
- \`filePath\`: The path to the file (as returned by \`filename-search\`)
- \`offset\`: (Optional) Line number to start reading from (0-based index)
- \`maxLines\`: (Optional) Maximum number of lines to read

### Example Usage:
\`\`\`
doc-file-view({ filePath: "docs/001_develop/03_client-capabilities/005_grids/index.mdx" })
\`\`\`

To view a specific section of a large file:
\`\`\`
doc-file-view({ 
  filePath: "docs/001_develop/02_server-capabilities/004_real-time-queries-data-server/index.mdx", 
  offset: 100, 
  maxLines: 50 
})
\`\`\`

### Response Format:
Returns the file content as raw markdown, preserving all formatting and newlines.

## Best Practices for File Operations

1. **Use paths from search results**: The file paths returned by \`filename-search\` and \`doc-content-search\` can be directly used with \`doc-file-view\`
2. **Read files in chunks**: For large files, use \`offset\` and \`maxLines\` to read manageable sections
3. **Explore related files**: Look for related files in the same directory for additional context
4. **Understand the documentation structure**: Genesis documentation follows a consistent structure:
   - \`001_develop\`: Development documentation
   - \`002_how-to\`: How-to guides
   - \`003_build-deploy-operate\`: Build, deployment, and operations guides
   - \`004_release-notes\`: Release notes`;
  }

  private getRulesToolsInfo(): string {
    return `# Genesis Coding Standards and Conventions

## 📚 rules-view

This tool provides access to Genesis coding standards and conventions, which are essential references for AI-assisted development.

### Parameters:
- \`ruleName\`: (Optional) The name of a specific rule file to view
- \`listRules\`: (Optional) Set to "true" to list all available rule files

### Example Usage:

To list all available rules:
\`\`\`
rules-view({ listRules: "true" })
\`\`\`

To view a specific rule:
\`\`\`
rules-view({ ruleName: "genesis-general-rules.mdc" })
\`\`\`

### Response Format:
- When listing rules: Returns an object with an array of rule file names
- When viewing a specific rule: Returns the rule content as formatted text

## Available Rule Categories

Genesis rules are organized into categories:

1. **General rules**: Overall development standards
2. **Project structure**: Directory structure conventions
3. **Server component rules**: Standards for:
   - Consolidator
   - DataServer
   - EventHandler
   - RequestReply
   - Table definitions
   - View definitions
4. **UI component rules**: Standards for:
   - Charts
   - Entity management
   - Forms
   - Grids
   - Routes
   - Screen notifications
   - General UI guidelines

## Best Practices for Using Rules

1. **Start with general rules**: Begin with \`genesis-general-rules.mdc\` for an overview
2. **Review domain-specific rules**: When working on a specific component, check for relevant rules
3. **Apply rules consistently**: Follow the rules throughout your development process
4. **Reference rules in explanations**: When explaining code choices to users, reference the relevant rules`;
  }
}

export default GenesisToolsInfoTool;
