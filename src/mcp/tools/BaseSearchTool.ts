import { MCPTool } from "mcp-framework";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import * as globModule from "glob";
const { glob } = globModule;

// Base interface for search inputs
export interface BaseSearchInput {
  query: string;
}

// Base class for search tools
export abstract class BaseSearchTool<TInput extends BaseSearchInput, TResult> extends MCPTool<TInput> {
  // Base directory for docs
  protected docsDir = path.resolve(process.cwd(), "docs");
  // Route base path from config
  protected routeBasePath = "/";

  // Abstract methods that derived classes must implement
  abstract findAllItems(): Promise<TResult[]>;
  abstract filterItemsByQuery(items: TResult[], searchTerm: string): TResult[];

  /**
   * Standard executor that handles common search patterns
   */
  async executeSearch(query: string, toolName: string): Promise<any> {
    try {
      console.log(`[${toolName}] Searching with query: ${query}`);
      const items = await this.findAllItems();
      
      // Filter items based on the query
      let filteredItems = items;
      if (query !== "*") {
        const searchTerm = query.toLowerCase();
        filteredItems = this.filterItemsByQuery(items, searchTerm);
      }
      
      return {
        success: true,
        count: filteredItems.length,
        query,
        items: filteredItems,
      };
    } catch (error: unknown) {
      console.error(`[${toolName}] Error searching:`, error);
      return {
        success: false,
        error: `Failed to search: ${this.formatError(error)}`,
        query,
      };
    }
  }

  protected async findFilesWithGlob(pattern: string, options: globModule.GlobOptions = {}): Promise<string[]> {
    const defaultOptions = { 
      cwd: this.docsDir,
      absolute: true
    };
    
    const result = await glob(pattern, { ...defaultOptions, ...options });
    return result.map(path => path.toString());
  }

  protected extractFrontMatter(content: string): { title?: string; description?: string } {
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

  protected getDocsPath(filePath: string): string {
    const relativePath = path.relative(this.docsDir, filePath);
    return '/docs/' + relativePath;
  }

  protected filePathToRoutePath(relativePath: string): string {
    // Convert file path to route path
    // 1. Remove file extension
    let routePath = relativePath.replace(/\.(md|mdx)$/, '');
    
    // 2. Handle index files
    routePath = routePath.replace(/\/index$/, '');
    
    // 3. Convert to web path format
    routePath = '/' + routePath.split(path.sep).join('/');
    
    // 4. Make sure it starts with the route base path
    if (this.routeBasePath !== '/' && !routePath.startsWith(this.routeBasePath)) {
      routePath = this.routeBasePath + routePath;
    }
    
    return routePath;
  }

  protected formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}