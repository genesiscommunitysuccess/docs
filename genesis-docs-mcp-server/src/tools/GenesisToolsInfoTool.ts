import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

interface GenesisToolsInfoInput {
  detail?: string;
}

class GenesisToolsInfoTool extends MCPTool<GenesisToolsInfoInput> {
  name = 'info';
  description = 'Provides information about the available Genesis documentation tools and how to use them effectively with AI';

  schema = {
    detail: {
      type: z.string().optional(),
      description: 'Optional parameter to get detailed information about a specific aspect of the tools (e.g., "search", "rules", "files")',
    },
  };

  async execute(input: GenesisToolsInfoInput) {
    const detail = input.detail?.toLowerCase();

    if (detail === 'search') {
      return this.getSearchToolsInfo();
    } else if (detail === 'files') {
      return this.getFileToolsInfo();
    } else if (detail === 'rules') {
      return this.getRulesToolsInfo();
    } else {
      return this.getGeneralInfo();
    }
  }

  private getGeneralInfo(): string {
    return `# Genesis Documentation Tools

The Genesis documentation tools provide AI assistants with access to comprehensive documentation for the Genesis low-code platform. These tools are designed to help you find, read, and understand Genesis documentation efficiently.

## Available Tools

1. **Search Tools**
   - \`filename-search\`: Search for documentation files by name
   - \`doc-content-search\`: Search for specific text within documentation files

2. **Content Tools**
   - \`doc-file-view\`: View the contents of a documentation file
   - \`enriched-content\`: Process and combine relevant files for comprehensive information
   - \`rules-view\`: View Genesis coding standards and conventions
   - \`mixin-code-samples\`: Map documentation to relevant code repositories

3. **Utility Tools**
   - \`info\`: Get information about the available tools (this tool)
   - \`genesis-docs-readme\`: Get an overview of Genesis documentation
   - \`all\`: View all available tools

## Recommended Usage Patterns

- Start with \`filename-search\` or \`doc-content-search\` to find relevant documentation
- Use \`doc-file-view\` to read specific files
- Use \`enriched-content\` for comprehensive information on a topic
- Use \`mixin-code-samples\` to find relevant code examples for documentation

For more specific information, use the \`detail\` parameter with values like "search", "files", or "rules".`;
  }

  private getSearchToolsInfo(): string {
    return `# Genesis Documentation Search Tools

## 🔍 filename-search

This tool allows you to search for documentation files by name using fuzzy matching.

### Parameters:
- \`searchString\`: The search term to use
- \`showApiDocs\`: Whether to include API documentation (defaults to false)
- \`strictWordBoundaries\`: Whether to enforce word boundaries in search (defaults to true)

### Example Usage:
\`\`\`
filename-search({ searchString: "grid component" })
\`\`\`

### Response Format:
Returns a list of matching file paths that can be used with \`doc-file-view\`.

## 🔍 doc-content-search

This tool allows you to search for specific text within documentation files.

### Parameters:
- \`searchString\`: Text to search for in documentation files
- \`showContent\`: If set to "true" then return the line content containing the match

### Example Usage:
\`\`\`
doc-content-search({ searchString: "grid pro", showContent: "true" })
\`\`\`

### Response Format:
Returns a list of files containing the search term, with optional content snippets.

## Best Practices for Searching

1. **Start with broad terms** then narrow down
2. **Use specific technical terms** for better results
3. **Try different variations** of terms if initial searches don't yield good results
4. **Use natural language** rather than complex queries
5. **Combine search tools** for best results`;
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

### Response Format:
Returns the file content as raw markdown, preserving all formatting and newlines.

## 📄 enriched-content

This tool searches for content and processes multiple matching files.

### Parameters:
- \`searchString\`: Text to search for in documentation files
- \`outputFormat\`: (Optional) Output format. Options: markdown, xml, json (default: markdown)
- \`maxFileSizeKb\`: (Optional) Maximum file size in KB to include (default: 50)
- \`maxResults\`: (Optional) Maximum number of files to process (default: 5)

### Example Usage:
\`\`\`
enriched-content({ searchString: "grid component" })
\`\`\`

### Response Format:
Returns combined content from multiple files, with clear section headers.

## 📄 mixin-code-samples

This tool maps documentation to relevant code repositories from Genesis Community Success.

### Parameters:
- \`mdxFilePath\`: Path to the .mdx file to analyze, relative to the docs folder
- \`localFolder\`: (Optional) Local folder path where docs are located
- \`maxRepos\`: (Optional) Maximum number of repositories to return (default: 3)

### Example Usage:
\`\`\`
mixin-code-samples({ mdxFilePath: "docs/001_develop/03_client-capabilities/005_grids/index.mdx" })
\`\`\`

### Response Format:
Returns a list of relevant repositories with descriptions and URLs.`;
  }

  private getRulesToolsInfo(): string {
    return `# Genesis Coding Standards and Conventions

## 📋 rules-view

This tool allows you to view Genesis coding standards and conventions.

### Parameters:
- \`ruleName\`: The name of the specific rule file to view
- \`listRules\`: If true, returns a list of all available rules

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
Returns either a list of available rules or the content of a specific rule file.

## Purpose of Genesis Coding Rules

The Genesis coding standards and conventions ensure:

1. **Consistency** across Genesis projects
2. **Maintainability** of code
3. **Best practices** for performance and security
4. **Integration** with Genesis platform features

These rules are particularly important when working with AI assistants to ensure generated code follows Genesis conventions.`;
  }
}

export default GenesisToolsInfoTool; 