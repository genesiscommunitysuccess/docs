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
    const result = await this.executeSearch(query, "ApiDocsSearchTool");
    
    if (!result.success) {
      return result;
    }
    
    // Format the response for this specific tool
    return {
      success: true,
      apiDocs: result.items.map((doc: ApiDocInfo) => doc.path),
      count: result.count,
      query,
    };
  }
  
  filterItemsByQuery(docs: ApiDocInfo[], searchTerm: string): ApiDocInfo[] {
    return docs.filter(
      (doc) => 
        doc.path.toLowerCase().includes(searchTerm) || 
        (doc.modulePath && doc.modulePath.toLowerCase().includes(searchTerm)) ||
        (doc.componentName && doc.componentName.toLowerCase().includes(searchTerm)) ||
        (doc.methodName && doc.methodName.toLowerCase().includes(searchTerm))
    );
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