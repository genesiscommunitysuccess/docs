import { MCPTool } from "mcp-framework";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";

interface SearchInput {
  query: string;
  limit?: number;
}

class DocsSearchTool extends MCPTool<SearchInput> {
  name = "docsSearch";
  description = "Search through the documentation for specific terms or topics";
  schema = {
    query: {
      type: z.string(),
      description: "The search term or topic to look for in the documentation",
    },
    limit: {
      type: z.number().optional(),
      description: "Maximum number of results to return (default: 5)",
    },
  };

  async execute({ query, limit = 5 }: SearchInput) {
    try {
      const results = await this.searchDocs(query, limit);
      return {
        success: true,
        results,
        count: results.length,
        query,
      };
    } catch (error: unknown) {
      console.error("Error searching docs:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to search documentation: ${errorMessage}`,
        query,
      };
    }
  }

  private async searchDocs(query: string, limit: number): Promise<any[]> {
    // Mock implementation - in a real scenario, we would search through the docs directory
    return [
      {
        title: "Example Documentation Page",
        path: "/example/path",
        excerpt: `This is an example result containing the term "${query}"`,
        score: 0.95,
      },
      {
        title: "Another Documentation Page",
        path: "/another/path",
        excerpt: `Another example matching "${query}" with some context`,
        score: 0.85,
      },
    ].slice(0, limit);
  }
}

export default DocsSearchTool;