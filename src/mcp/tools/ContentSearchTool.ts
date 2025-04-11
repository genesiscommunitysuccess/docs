import { MCPTool } from "mcp-framework";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import Fuse from 'fuse.js';

interface ContentSearchInput {
  query: string;
  limit?: string;
}

interface ContentSearchResult {
  path: string;
  title: string;
  snippet: string;
  matchScore: number;
}

class ContentSearchTool extends MCPTool<ContentSearchInput> {
  name = "contentSearch";
  description = "Search through the content of documentation files for specific text or phrases";
  schema = {
    query: {
      type: z.string(),
      description: "The text to search for within document content (supports fuzzy matching)",
    },
    limit: {
      type: z.string().optional(),
      description: "Maximum number of results to return (default: 5)",
    },
  };

  // Base directory for docs
  private docsDir = path.resolve(process.cwd(), "docs");

  async execute({ query, limit }: ContentSearchInput) {
    try {
      console.log(`[ContentSearchTool] Searching content with query: ${query}`);
      
      // Find all markdown files
      const mdFiles = await this.findFilesWithGlob(`**/*.{md,mdx}`, { 
        ignore: ['**/docs/api/**'] // Exclude API docs by default
      });
      
      // Process each file to extract content for searching
      const contentItems = await this.processFiles(mdFiles);
      
      // Set up Fuse.js for fuzzy searching
      const fuse = new Fuse(contentItems, {
        keys: [
          { name: 'content', weight: 2 }, // Higher weight for content matches
          { name: 'title', weight: 1.5 },
          { name: 'path', weight: 0.5 }
        ],
        includeScore: true,
        threshold: 0.4, // Lower threshold = more strict matching
        minMatchCharLength: 3,
        shouldSort: true
      });
      
      // Perform the search
      const searchResults = fuse.search(query);
      console.log(`[ContentSearchTool] Found ${searchResults.length} matches`);
      
      // Apply limit if specified
      const limitNum = limit ? parseInt(limit, 10) : 5;
      const limitedResults = searchResults.slice(0, limitNum);
      
      // Extract snippets from matching content
      const formattedResults = limitedResults.map(result => {
        return {
          path: result.item.path,
          title: result.item.title,
          snippet: this.extractSnippetWithContext(result.item.content, query),
          matchScore: result.score ? 1 - result.score : 0 // Convert score to a 0-1 scale where 1 is best
        };
      });
      
      return {
        success: true,
        results: formattedResults,
        count: formattedResults.length,
        totalCount: searchResults.length,
        query
      };
    } catch (error) {
      console.error(`[ContentSearchTool] Error searching:`, error);
      return {
        success: false,
        error: `Failed to search content: ${this.formatError(error)}`,
        query
      };
    }
  }

  /**
   * Extract a snippet from the content that includes the search term with context
   */
  private extractSnippetWithContext(content: string, searchTerm: string): string {
    // If content is too short, just return it
    if (content.length < 300) {
      return content;
    }
    
    // Try to find direct matches first (case insensitive)
    const lowerContent = content.toLowerCase();
    const lowerTerm = searchTerm.toLowerCase();
    
    let matchIndex = lowerContent.indexOf(lowerTerm);
    if (matchIndex === -1) {
      // If no direct match, try to find any of the search words
      const searchWords = lowerTerm.split(/\s+/).filter(word => word.length > 2);
      for (const word of searchWords) {
        matchIndex = lowerContent.indexOf(word);
        if (matchIndex !== -1) break;
      }
    }
    
    // If still no match found, return the beginning of the content
    if (matchIndex === -1) {
      return content.substring(0, 250) + '...';
    }
    
    // Extract context around the match
    const contextStart = Math.max(0, matchIndex - 100);
    const contextEnd = Math.min(content.length, matchIndex + searchTerm.length + 100);
    
    // Include ellipses if we're not at the start/end of the content
    const prefix = contextStart > 0 ? '...' : '';
    const suffix = contextEnd < content.length ? '...' : '';
    
    // Extract the snippet with context
    return prefix + content.substring(contextStart, contextEnd) + suffix;
  }

  /**
   * Process all markdown files to extract searchable content
   */
  private async processFiles(filePaths: string[]): Promise<Array<{path: string, title: string, content: string}>> {
    const contentPromises = filePaths.map(async (filePath: string) => {
      try {
        // Read file content
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        // Extract frontmatter for title
        const frontMatter = this.extractFrontMatter(fileContent);
        const title = frontMatter.title || path.basename(filePath, path.extname(filePath));
        
        // Remove frontmatter from content
        const contentWithoutFrontmatter = fileContent.replace(/^---\n(.|\n)*?\n---\n/, '');
        
        // Clean content for better searching
        const cleanedContent = this.cleanMarkdownContent(contentWithoutFrontmatter);
        
        return {
          path: this.getDocsPath(filePath),
          title,
          content: cleanedContent
        };
      } catch (error) {
        console.error(`[ContentSearchTool] Error processing file ${filePath}:`, error);
        return {
          path: this.getDocsPath(filePath),
          title: path.basename(filePath),
          content: 'Error extracting content'
        };
      }
    });

    return Promise.all(contentPromises);
  }
  
  /**
   * Find files using glob pattern
   */
  private async findFilesWithGlob(pattern: string, options: any = {}): Promise<string[]> {
    const { glob } = await import('glob');
    const defaultOptions = { 
      cwd: this.docsDir,
      absolute: true
    };
    
    const result = await glob(pattern, { ...defaultOptions, ...options });
    return result.map(p => p.toString());
  }
  
  /**
   * Extract YAML frontmatter from markdown content
   */
  private extractFrontMatter(content: string): { title?: string; description?: string } {
    const frontMatterRegex = /---\s*([\s\S]*?)\s*---/;
    const match = content.match(frontMatterRegex);
    
    if (!match || !match[1]) {
      return {};
    }
    
    const frontMatter = match[1];
    const titleMatch = frontMatter.match(/title:\s*["']?(.*?)["']?\s*$/m);
    const descriptionMatch = frontMatter.match(/description:\s*["']?(.*?)["']?\s*$/m);
    
    return {
      title: titleMatch ? titleMatch[1] : undefined,
      description: descriptionMatch ? descriptionMatch[1] : undefined,
    };
  }
  
  /**
   * Clean markdown content for better searching
   */
  private cleanMarkdownContent(content: string): string {
    return content
      // Remove MDX import statements
      .replace(/import\s+.*\s+from\s+['"].*['"];?\n/g, '')
      // Remove MDX component tags
      .replace(/<[A-Z][A-Za-z0-9]*.*?\/?>/g, '')
      .replace(/<\/[A-Z][A-Za-z0-9]*>/g, '')
      // Remove HTML tags but preserve content
      .replace(/<[^>]*>/g, ' ')
      // Replace multiple whitespace with single space
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Convert absolute file path to docs path
   */
  private getDocsPath(filePath: string): string {
    const relativePath = path.relative(this.docsDir, filePath);
    return '/docs/' + relativePath;
  }
  
  /**
   * Format error messages
   */
  private formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}

export default ContentSearchTool;