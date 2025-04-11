import { MCPTool } from "mcp-framework";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

interface MarkdownViewInput {
  path: string;
  offset?: number;
  limit?: number;
}

class MarkdownViewTool extends MCPTool<MarkdownViewInput> {
  name = "markdownView";
  description = "View the content of markdown files (MD/MDX) found through the docs or API search tools";
  schema = {
    path: {
      type: z.string(),
      description: "The path to the markdown file to view (from route/api docs search tools)",
    },
    offset: {
      type: z.number().optional(),
      description: "Line number to start reading from (0-based, optional)",
    },
    limit: {
      type: z.number().optional(),
      description: "Maximum number of lines to read (optional)",
    },
  };

  // Find the root directory for docs regardless of where the server is running from
  private docsDir = this.findDocsDirectory();

  async execute({ path: markdownPath, offset, limit }: MarkdownViewInput) {
    try {
      // Normalize the path to handle various formats
      const normalizedPath = await this.normalizePath(markdownPath);
      console.log(`[MarkdownViewTool] Attempting to read file at: ${normalizedPath}`);
      
      // Read the file
      const content = await this.readMarkdownFile(normalizedPath, offset, limit);
      
      // Process the content to make it more readable (remove YAML frontmatter)
      const processedContent = this.processMarkdownContent(content);
      
      return {
        success: true,
        path: normalizedPath,
        content: processedContent,
        offset: offset || 0,
        limit: limit || null,
      };
    } catch (error: unknown) {
      console.error("Error reading markdown file:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to read markdown file: ${errorMessage}`,
        path: markdownPath,
      };
    }
  }
  
  /**
   * Process markdown content to make it more readable
   * - Removes YAML frontmatter
   * - Preserves code blocks with proper formatting
   * - Removes import statements (React/MDX components)
   * - Cleans up tables for better rendering
   * - Ensures proper heading rendering
   */
  private processMarkdownContent(content: string): string {
    // Remove YAML frontmatter (content between --- lines at the beginning)
    const withoutFrontmatter = content.replace(/^---\n(.|\n)*?\n---\n/, '');
    
    // Remove MDX import statements
    const withoutImports = withoutFrontmatter.replace(
      /import\s+.*\s+from\s+['"].*['"];?\n/g, 
      ''
    );
    
    // Replace component usages with text notices
    const withoutComponents = withoutImports.replace(
      /<([A-Z][A-Za-z0-9]*)\s*.*?\/>/g, 
      '**[Component: $1]**'
    );
    
    // Replace opening/closing component tags with notices
    const withoutComponentTags = withoutComponents.replace(
      /<([A-Z][A-Za-z0-9]*)\s*.*?>([\s\S]*?)<\/\1>/g,
      '**[Component: $1]**\n$2\n**[End Component: $1]**'
    );
    
    // Clean up Tabs component usage which is common in MDX docs
    const withoutTabs = withoutComponentTags.replace(
      /<Tabs[\s\S]*?<\/Tabs>/g,
      (match) => {
        // Extract tab items
        const tabItems = match.match(/<TabItem[\s\S]*?<\/TabItem>/g) || [];
        const cleanTabItems = tabItems.map(tabItem => {
          const valueMatch = tabItem.match(/value=["']([^"']*)["']/);
          const value = valueMatch ? valueMatch[1] : 'tab';
          const content = tabItem.replace(/<TabItem[\s\S]*?>/g, '').replace(/<\/TabItem>/g, '');
          return `### ${value}\n${content}`;
        });
        
        return cleanTabItems.join('\n\n');
      }
    );
    
    // Replace MDX tip/warning/note/info blocks with standard markdown
    const withFormattedCallouts = withoutTabs.replace(
      /:::(tip|warning|note|info|caution|danger)(.*?)\n([\s\S]*?):::/g,
      (_, type, title, content) => {
        const titleText = title.trim() ? title.trim() : type.toUpperCase();
        return `> **${titleText}**\n>\n${content.split('\n').map((line: string) => `> ${line}`).join('\n')}\n`;
      }
    );
    
    // Process links to make them more readable
    const withFormattedLinks = withFormattedCallouts.replace(
      /\[(.*?)\]\((.*?)\)/g,
      (match, text, url) => {
        // Internal docs links - extract meaningful part
        if (url.startsWith('../') || url.startsWith('./')) {
          const cleanedUrl = url.replace(/\.\.\//g, '').replace(/\.\//g, '');
          return `[${text}] (Link to: ${cleanedUrl})`;
        }
        return match;
      }
    );
    
    // Enhance code blocks for better rendering 
    // This preserves the language specification and ensures proper formatting
    const enhancedCodeBlocks = withFormattedLinks.replace(
      /```(\w*)\n([\s\S]*?)```/g, 
      (_, language, code) => `\`\`\`${language}\n${code}\`\`\``
    );
    
    // Convert common HTML entities to their actual characters
    const withConvertedEntities = enhancedCodeBlocks
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&nbsp;/g, ' ');
    
    // Fix table formatting to ensure proper rendering
    const enhancedTables = withConvertedEntities.replace(
      /<table>[\s\S]*?<\/table>/g,
      (tableMatch) => {
        // Extract table headers
        const headerMatch = tableMatch.match(/<thead>[\s\S]*?<\/thead>/);
        const headers = headerMatch ? 
          headerMatch[0].match(/<th>([\s\S]*?)<\/th>/g)?.map(th => 
            th.replace(/<th>([\s\S]*?)<\/th>/, '$1').trim()
          ) : [];
        
        // Extract table rows
        const bodyMatch = tableMatch.match(/<tbody>[\s\S]*?<\/tbody>/);
        const rows = bodyMatch ? 
          bodyMatch[0].match(/<tr>[\s\S]*?<\/tr>/g)?.map(tr => {
            const cells = tr.match(/<td>([\s\S]*?)<\/td>/g)?.map(td => 
              td.replace(/<td>([\s\S]*?)<\/td>/, '$1').trim()
            );
            return cells;
          }) : [];
        
        // Rebuild as markdown table
        if (headers && rows) {
          let markdownTable = '| ' + headers.join(' | ') + ' |\n';
          markdownTable += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
          rows.forEach(row => {
            if (row) {
              markdownTable += '| ' + row.join(' | ') + ' |\n';
            }
          });
          return markdownTable;
        }
        
        return tableMatch;
      }
    );
    
    // Fix common HTML elements that might be in the markdown
    const withFixedHtml = enhancedTables
      .replace(/<p>([\s\S]*?)<\/p>/g, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<hr\s*\/?>/gi, '---\n')
      .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
      .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
      .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
    
    // Extract and format the title
    const titleMatch = withFixedHtml.match(/# (.*?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1] : path.basename(this.docsDir);
    
    // Add a note about this being formatted content at the top
    return "# " + title + "\n\n" + withFixedHtml;
  }

  private async normalizePath(inputPath: string): Promise<string> {
    // Remove `/docs/` prefix if present
    let cleanPath = inputPath.replace(/^\/docs\//, "");
    
    // Remove any route base path prefix
    cleanPath = cleanPath.replace(/^\//, "");
    
    // Check if the path already has a .md or .mdx extension
    if (!cleanPath.endsWith('.md') && !cleanPath.endsWith('.mdx')) {
      // Try mdx first, then fallback to md
      const mdxPath = path.join(this.docsDir, `${cleanPath}.mdx`);
      const mdPath = path.join(this.docsDir, `${cleanPath}.md`);
      
      try {
        await fs.access(mdxPath);
        cleanPath = `${cleanPath}.mdx`;
      } catch {
        // MDX not found, try MD
        try {
          await fs.access(mdPath);
          cleanPath = `${cleanPath}.md`;
        } catch {
          // Default to mdx if neither exists (will fail later with proper error)
          cleanPath = `${cleanPath}.mdx`;
        }
      }
    }

    // Resolve the full path
    return path.join(this.docsDir, cleanPath);
  }

  private async readMarkdownFile(filePath: string, offset?: number, limit?: number): Promise<string> {
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read the file
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Handle offset and limit if provided
    if (offset !== undefined || limit !== undefined) {
      const lines = content.split('\n');
      const startIndex = offset || 0;
      const endIndex = limit ? startIndex + limit : lines.length;
      return lines.slice(startIndex, endIndex).join('\n');
    }
    
    return content;
  }
}

export default MarkdownViewTool;