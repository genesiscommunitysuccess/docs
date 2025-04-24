import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

interface GenesisDocsReadmeInput {
  detail?: string;
}

class GenesisDocsReadmeTool extends MCPTool<GenesisDocsReadmeInput> {
  name = 'genesis-docs-readme';
  description =
    'Provides a comprehensive readme for using Genesis documentation tools with AI';

  schema = {
    detail: {
      type: z.string().optional(),
      description:
        'Optional parameter to get detailed information about a specific aspect (e.g., "search", "rules", "best-practices")',
    },
  };

  async execute(input: GenesisDocsReadmeInput) {
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

## Working with Genesis Projects

When working with Genesis projects, AI assistants should:

1. **Always look up documentation** before changing or adding code
2. **Search for "custom-components"** when writing Genesis code to understand project-specific components
3. **Search for "framework-integration"** when writing code that integrates with different frameworks

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

For more detailed information about each tool, provide a 'detail' parameter with values like 'search', 'files', 'rules', or 'best-practices'.`;
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
    } else if (
      lowerDetail.includes('best') ||
      lowerDetail.includes('practice') ||
      lowerDetail.includes('genesis')
    ) {
      return this.getBestPracticesInfo();
    } else {
      return `No detailed information available for "${detail}". Try using "search", "files", "rules", or "best-practices" as the detail parameter.`;
    }
  }

  private getSearchToolsInfo(): string {
    return `# Genesis Documentation Search Tools

## 🔍 filename-search

This tool allows you to find documentation files by their names using fuzzy matching. It returns all matches plus sibling documents from the same directories for additional context.

### Parameters:
- \`searchString\`: The text to search for in filenames
- \`showApiDocs\`: (Optional) Set to "true" to include API documentation in results
- \`strictWordBoundaries\`: (Optional) Controls how search terms are matched - when enabled (default), "pro" would match a file containing "grid-pro" but not "improving"

### Example Usage:
\`\`\`
filename-search({ searchString: "grid" })
\`\`\`

### Response Format:
Returns an array of matching file paths, including both direct matches and sibling documents for context.

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

  private getBestPracticesInfo(): string {
    return `# Genesis Development Best Practices for AI

## General Development Guidelines

When working with Genesis projects, AI assistants should:

1. **Always consult documentation first**:
   - Before modifying or adding code to a Genesis project, search for and read the relevant documentation
   - Use the \`filename-search\` and \`doc-content-search\` tools to find appropriate guidance
   - Reference the documentation when explaining your code choices

2. **Follow Genesis coding standards**:
   - Use the \`rules-view\` tool to access Genesis coding standards
   - Follow these standards consistently when writing or modifying code
   - Structure projects according to Genesis conventions

## Key Search Terms

When working on specific aspects of Genesis projects, search for these terms:

### 1. Custom Components
\`\`\`
filename-search({ searchString: "custom-components" })
\`\`\`

- **Why**: When writing Genesis code, understanding project-specific components is crucial
- **What you'll find**: Documentation on creating and using custom components in Genesis
- **When to use**: Before creating new components or modifying existing custom components

### 2. Framework Integration
\`\`\`
filename-search({ searchString: "framework-integration" })
\`\`\`

- **Why**: When integrating Genesis with other frameworks, special considerations apply
- **What you'll find**: Documentation on how Genesis integrates with various frameworks
- **When to use**: Before writing code that connects Genesis to external frameworks or libraries

## Recommended Workflow

1. **Understand the task**: Clarify what part of Genesis you're working with
2. **Search documentation**: Use the appropriate search terms
3. **Review coding standards**: Check for relevant rules
4. **Implement solution**: Follow Genesis patterns and conventions
5. **Verify against standards**: Ensure your solution adheres to Genesis best practices

By following these guidelines, you'll create high-quality, maintainable code that integrates well with the Genesis platform.`;
  }
}

export default GenesisDocsReadmeTool;