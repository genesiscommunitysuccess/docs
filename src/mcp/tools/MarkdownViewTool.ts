import { MCPTool } from "mcp-framework";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";

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

  private docsDir = path.resolve(process.cwd(), "docs");

  async execute({ path: markdownPath, offset, limit }: MarkdownViewInput) {
    try {
      // Normalize the path to handle various formats
      const normalizedPath = await this.normalizePath(markdownPath);
      console.log(`[MarkdownViewTool] Attempting to read file at: ${normalizedPath}`);
      
      // Read the file
      const content = await this.readMarkdownFile(normalizedPath, offset, limit);
      
      return {
        success: true,
        path: normalizedPath,
        content,
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