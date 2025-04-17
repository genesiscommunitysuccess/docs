import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import { BaseSearchTool, BaseSearchInput } from "./BaseSearchTool.js";

interface DocsSearchInput extends BaseSearchInput {
  limit?: string;
}

interface DocSearchResult {
  path: string;
  title: string;
  excerpt: string;
}

class DocsSearchTool extends BaseSearchTool<DocsSearchInput, DocSearchResult> {
  name = "docsSearch";
  description = "Search through the documentation for specific terms or topics";
  schema = {
    query: {
      type: z.string(),
      description: "The search term or topic to look for in the documentation",
    },
    limit: {
      type: z.string().optional(),
      description: "Maximum number of results to return (default: 5)",
    },
  };

  async execute({ query, limit }: DocsSearchInput) {
    // Get path function for sibling context
    const getPathFunc = (doc: DocSearchResult) => doc.path;
    const result = await this.executeSearch(query, "DocsSearchTool", getPathFunc);
    
    if (!result.success) {
      return result;
    }
    
    // Apply limit if specified
    const limitNum = limit ? parseInt(limit, 10) : 5;
    const limitedResults = result.items.slice(0, limitNum);
    
    return {
      success: true,
      results: limitedResults,
      count: limitedResults.length,
      totalCount: result.count,
      query,
      noResultsHint: result.noResultsHint
    };
  }
  
  filterItemsByQuery(docs: DocSearchResult[], searchTerm: string): DocSearchResult[] {
    // Use fuzzy matching instead of simple includes
    const matches: [DocSearchResult, number][] = docs.map(doc => {
      // Calculate a composite score across all searchable fields
      const pathScore = this.fuzzyMatch(doc.path, searchTerm);
      const titleScore = this.fuzzyMatch(doc.title, searchTerm);
      const excerptScore = this.fuzzyMatch(doc.excerpt, searchTerm) * 0.5; // Lower weight for excerpt
      
      // Take the best score among the fields
      const score = Math.max(pathScore, titleScore, excerptScore);
      
      return [doc, score];
    });
    
    // Filter out docs with zero score and sort by score descending
    return matches
      .filter(([, score]) => score > 0)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([doc]) => doc);
  }

  async findAllItems(): Promise<DocSearchResult[]> {
    // Find all .md and .mdx files in the docs directory, but exclude API docs
    const mdFiles = await this.findFilesWithGlob(`**/*.{md,mdx}`, { 
      ignore: ['**/docs/api/**'] // Exclude API docs
    });
    
    // Process each file to extract searchable content
    const docPromises = mdFiles.map(async (filePath: string) => {
      try {
        // Get the path from /docs onwards
        const docsPath = this.getDocsPath(filePath);
        
        // Read file content
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        // Extract frontmatter for title and description
        const frontMatter = this.extractFrontMatter(fileContent);
        const title = frontMatter.title || path.basename(filePath, path.extname(filePath));
        
        // Extract an excerpt from content (first paragraph after frontmatter)
        // Remove frontmatter
        const contentWithoutFrontmatter = fileContent.replace(/^---\n(.|\n)*?\n---\n/, '');
        // Find first substantial paragraph for excerpt (skip import statements, etc.)
        const excerptMatch = contentWithoutFrontmatter.match(/(?:^|\n)([^#\n][^\n]{20,})/);
        const excerpt = excerptMatch 
          ? excerptMatch[1].trim().substring(0, 150) + (excerptMatch[1].length > 150 ? '...' : '')
          : 'No excerpt available';
        
        return {
          path: docsPath,
          title,
          excerpt
        };
      } catch (error) {
        console.error(`[DocsSearchTool] Error processing file ${filePath}:`, error);
        return {
          path: this.getDocsPath(filePath),
          title: path.basename(filePath),
          excerpt: 'Error extracting content'
        };
      }
    });

    return Promise.all(docPromises);
  }
}

export default DocsSearchTool;