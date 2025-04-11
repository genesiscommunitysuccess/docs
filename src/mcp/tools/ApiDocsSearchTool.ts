import { z } from "zod";
import path from "path";
import { BaseSearchTool, BaseSearchInput } from "./BaseSearchTool.js";

interface ApiDocInfo {
  path: string;
  modulePath?: string;
  componentName?: string;
  methodName?: string;
}

class ApiDocsSearchTool extends BaseSearchTool<BaseSearchInput, ApiDocInfo> {
  name = "apiDocsSearch";
  description = "Search and list API documentation resources";
  schema = {
    query: {
      type: z.string(),
      description: "Search term to filter API docs (use * for all API docs)",
    },
  };

  async execute({ query }: BaseSearchInput) {
    // Pass a getPathFunc to enable sibling context
    const getPathFunc = (doc: ApiDocInfo) => doc.path;
    const result = await this.executeSearch(query, "ApiDocsSearchTool", getPathFunc);
    
    if (!result.success) {
      return result;
    }
    
    // Format the response for this specific tool
    return {
      success: true,
      apiDocs: result.items.map((doc: ApiDocInfo) => doc.path),
      count: result.count,
      query,
      noResultsHint: result.noResultsHint
    };
  }
  
  filterItemsByQuery(docs: ApiDocInfo[], searchTerm: string): ApiDocInfo[] {
    // Use fuzzy matching instead of simple includes
    const matches: [ApiDocInfo, number][] = docs.map(doc => {
      // Calculate a composite score across all searchable fields
      const pathScore = this.fuzzyMatch(doc.path, searchTerm);
      const moduleScore = doc.modulePath ? this.fuzzyMatch(doc.modulePath, searchTerm) : 0;
      const componentScore = doc.componentName ? this.fuzzyMatch(doc.componentName, searchTerm) : 0;
      const methodScore = doc.methodName ? this.fuzzyMatch(doc.methodName, searchTerm) : 0;
      
      // Take the best score among the fields
      const score = Math.max(pathScore, moduleScore, componentScore, methodScore);
      
      return [doc, score];
    });
    
    // Filter out docs with zero score and sort by score descending
    return matches
      .filter(([, score]) => score > 0)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([doc]) => doc);
  }

  async findAllItems(): Promise<ApiDocInfo[]> {
    // Find all API documentation files (which have /docs/api/ in their path)
    const apiDocFiles = await this.findFilesWithGlob(`**/docs/api/**/*.md`);
    
    // Process each file to extract API doc information
    const docPromises = apiDocFiles.map(async (filePath: string) => {
      try {
        const relativePath = path.relative(this.docsDir, filePath);
        
        // Get the path from /docs onwards
        const docsPath = this.getDocsPath(filePath);
        
        // Try to extract module, component and method names from the path
        const pathParts = relativePath.split(path.sep);
        let modulePath, componentName, methodName;
        
        if (pathParts.length >= 4) {
          // Module might be the first part after api (like foundation-utils, foundation-comms)
          const apiIndex = pathParts.findIndex(part => part === 'api');
          if (apiIndex >= 0 && apiIndex + 1 < pathParts.length) {
            modulePath = pathParts[apiIndex + 1];
            
            // Extract component and method if possible from filename
            const fileName = pathParts[pathParts.length - 1].replace('.md', '');
            const nameParts = fileName.split('.');
            
            if (nameParts.length >= 2) {
              componentName = nameParts[0];
              methodName = nameParts[1];
            } else {
              componentName = fileName;
            }
          }
        }
        
        return {
          path: docsPath,
          modulePath,
          componentName,
          methodName,
        };
      } catch (error) {
        console.error(`[ApiDocsSearchTool] Error processing file ${filePath}:`, error);
        return {
          path: this.getDocsPath(filePath)
        };
      }
    });

    return Promise.all(docPromises);
  }
}

export default ApiDocsSearchTool;