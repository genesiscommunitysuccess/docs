import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import { BaseSearchTool, BaseSearchInput } from "./BaseSearchTool.js";

interface RouteInfo {
  path: string;
  routePath: string;
  title?: string;
  description?: string;
}

class RouteSearchTool extends BaseSearchTool<BaseSearchInput, RouteInfo> {
  name = "routeSearch";
  description = "Search and list Docusaurus routes based on markdown files";
  schema = {
    query: {
      type: z.string(),
      description: "Search term to filter routes (use * for all routes)",
    },
  };

  async execute({ query }: BaseSearchInput) {
    const result = await this.executeSearch(query, "RouteSearchTool");
    
    if (!result.success) {
      return result;
    }
    
    // Format the response for this specific tool
    if (query === "*") {
      return {
        success: true,
        routes: result.items.map((route: RouteInfo) => route.path),
        count: result.count,
        query,
      };
    } else {
      return {
        success: true,
        routes: result.items,
        count: result.count,
        query,
      };
    }
  }
  
  filterItemsByQuery(routes: RouteInfo[], searchTerm: string): RouteInfo[] {
    return routes.filter(
      (route) => 
        route.routePath.toLowerCase().includes(searchTerm) || 
        (route.title && route.title.toLowerCase().includes(searchTerm)) ||
        (route.description && route.description.toLowerCase().includes(searchTerm))
    );
  }

  async findAllItems(): Promise<RouteInfo[]> {
    // Find all .md and .mdx files in the docs directory, but exclude API docs
    const mdFiles = await this.findFilesWithGlob(`**/*.{md,mdx}`, { 
      ignore: ['**/docs/api/**'] // Exclude API docs
    });
    
    // Process each file to extract route information
    const routePromises = mdFiles.map(async (filePath: string) => {
      try {
        const relativePath = path.relative(this.docsDir, filePath);
        
        // Skip files with /docs/api/ in their path (just in case the glob ignore pattern didn't work)
        if (relativePath.includes(path.join('docs', 'api'))) {
          return null;
        }
        
        // Convert file path to route path
        let routePath = this.filePathToRoutePath(relativePath);
        
        // Get the path from /docs onwards
        const docsPath = this.getDocsPath(filePath);
        
        // Extract title and description from file content
        const fileContent = await fs.readFile(filePath, 'utf8');
        const frontMatter = this.extractFrontMatter(fileContent);
        
        return {
          path: docsPath,
          routePath,
          title: frontMatter.title,
          description: frontMatter.description,
        };
      } catch (error) {
        console.error(`[RouteSearchTool] Error processing file ${filePath}:`, error);
        return {
          path: this.getDocsPath(filePath),
          routePath: this.filePathToRoutePath(path.relative(this.docsDir, filePath)),
        };
      }
    });

    // Filter out any null values (from API docs files)
    const routes = await Promise.all(routePromises);
    return routes.filter(route => route !== null) as RouteInfo[];
  }
}

export default RouteSearchTool;