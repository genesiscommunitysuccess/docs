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
   * Get sibling items that share a parent path with the given item
   * This is useful for providing additional context in search results
   */
  protected getSiblingItems(
    items: TResult[], 
    filteredItems: TResult[], 
    getPathFunc: (item: TResult) => string
  ): TResult[] {
    // Create a Set to track unique items by path
    const resultSet = new Set<TResult>();
    
    // Add all already filtered items first
    filteredItems.forEach(item => resultSet.add(item));
    
    // For each filtered item, find and add its siblings
    filteredItems.forEach(item => {
      const itemPath = getPathFunc(item);
      const parentPath = path.dirname(itemPath);
      
      // Find items with the same parent directory
      const siblings = items.filter(candidate => {
        const candidatePath = getPathFunc(candidate);
        return path.dirname(candidatePath) === parentPath;
      });
      
      // Add siblings to results
      siblings.forEach(sibling => resultSet.add(sibling));
    });
    
    // Convert back to array
    return Array.from(resultSet);
  }
  
  /**
   * Fuzzy match for search terms
   * Returns a score between 0 and 1, where 1 is a perfect match
   */
  protected fuzzyMatch(text: string, pattern: string): number {
    if (!text || !pattern) return 0;
    
    // Convert to lowercase for case-insensitive matching
    const lowerText = text.toLowerCase();
    const lowerPattern = pattern.toLowerCase();
    
    // Exact match is best
    if (lowerText.includes(lowerPattern)) return 1;
    
    // Check for each word in the pattern independently
    const words = lowerPattern.split(/\s+/).filter(Boolean);
    if (words.length === 0) return 0;
    
    let matchedWords = 0;
    
    // Count how many words from the pattern match the text
    words.forEach(word => {
      if (lowerText.includes(word)) {
        matchedWords++;
      }
    });
    
    // Return ratio of matched words
    return matchedWords / words.length;
  }

  /**
   * Standard executor that handles common search patterns
   * Now with fuzzy matching and sibling context
   */
  async executeSearch(
    query: string, 
    toolName: string, 
    getPathFunc?: (item: TResult) => string
  ): Promise<any> {
    try {
      console.log(`[${toolName}] Searching with query: ${query}`);
      const items = await this.findAllItems();
      
      // Filter items based on the query
      let filteredItems = items;
      let noResultsHint = null;
      
      if (query !== "*") {
        const searchTerm = query.toLowerCase();
        filteredItems = this.filterItemsByQuery(items, searchTerm);
        
        // If no results found, provide a hint to try with fewer words
        if (filteredItems.length === 0) {
          noResultsHint = "No results found. Try searching with fewer words for better matches.";
          console.log(`[${toolName}] ${noResultsHint}`);
        }
        
        // If getPathFunc is provided, include sibling items for context
        if (getPathFunc && filteredItems.length > 0) {
          filteredItems = this.getSiblingItems(items, filteredItems, getPathFunc);
        }
      }
      
      return {
        success: true,
        count: filteredItems.length,
        query,
        items: filteredItems,
        noResultsHint
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