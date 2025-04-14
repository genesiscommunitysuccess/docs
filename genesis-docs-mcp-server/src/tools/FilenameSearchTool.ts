import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { fileSystem } from "../services/FileSystem.js";
import Fuse from 'fuse.js'

interface FilenameSearchInput {
  searchString: string;
  showApiDocs?: boolean;
  maxResults?: number;
}

class FilenameSearchTool extends MCPTool<FilenameSearchInput> {
  name = "filename-search";
  description = "This tool allows you to perform a fuzzy search for documentation fileneames and you'll return back all matches as well as any sibling documents that match the directories for extra context";

  schema = {
    searchString: {
      type: z.string(),
      description: "The search term to use which is used to fuzzy match against the documentation",
    },
    showApiDocs: {
      type: z.boolean().optional().default(false),
      description: "Whether to include API documentation in the search results. Defaults to false.",
    },
    maxResults: {
      type: z.number().positive().int().optional().default(20),
      description: "Maximum number of results to return. Defaults to 20.",
    },
  };

  async execute(input: FilenameSearchInput) {
    const docsFiles = await fileSystem.docsFiles();
    
    // Filter out API docs if showApiDocs is false (default)
    const filteredDocsFiles = input.showApiDocs === true 
      ? docsFiles 
      : docsFiles.filter(file => {
          // Filter out anything with /docs/api/ in the path
          // Also check for lowercase variations to be comprehensive
          return !file.includes('/docs/api/') && !file.includes('/docs/API/')
        });

    // Extract search components and prepare them
    const searchTerms = input.searchString.toLowerCase().trim().split(/\s+/);

    // Pre-filter files to only those likely to be relevant (containing any of the search terms)
    // This gives us a smaller set to run the expensive fuzzy search on
    const preFilteredFiles = filteredDocsFiles.filter(file => {
      const filename = file.toLowerCase();
      return searchTerms.some(term => filename.includes(term));
    });
    
    // Check for exact matches
    const exactMatches = preFilteredFiles.filter(file => {
      const filename = file.toLowerCase().split('/').pop() || '';
      // Use the full search term to match against filename
      return filename === input.searchString.toLowerCase();
    });
    
    // If there are exact matches, return them in a special format
    if (exactMatches.length > 0) {
      const formattedExactMatches = exactMatches.map(path => {
        // Extract relative path from /dist
        const relativePath = path.split('/dist/').pop() || path;
        return relativePath;
      });
      
      return {
        exactMatches: true,
        paths: formattedExactMatches
      };
    }

    // If pre-filtering found potential matches but no exact matches, use those instead of the full set
    const filesToSearch = preFilteredFiles.length > 0 ? preFilteredFiles : docsFiles;

    // Configure Fuse with more effective options for filename search
    const fuse = new Fuse(filesToSearch, {
      // Stricter threshold (0.0 is exact, 1.0 matches everything)
      threshold: 0.4,
      // Reasonable distance for path matching
      distance: 100,
      // Sort results by score
      includeScore: true,
      // Match anywhere in the string, not just at the beginning
      ignoreLocation: true,
      // Use basic search for better precision
      useExtendedSearch: false,
      // Keys to search within (for future if we want to search specific parts of the path)
      // For now we're searching the whole string
      findAllMatches: true
    });

    // Run the search
    const searchResults = fuse.search(input.searchString);

    if (searchResults.length === 0) {
      return "No results found. Try using fewer or different words in your search term.";
    }

    // Find the best score to use as a baseline
    const bestScore = searchResults[0].score || 0.3;

    // Get the max number of results to return (default to 20 if not specified)
    const maxResults = input.maxResults || 20;

    // Only include results that are within a reasonable range of the best score
    // This helps exclude less relevant results
    const filteredResults = searchResults
      .filter(result => (result.score || 1) <= bestScore + 0.2); // Keep results with scores close to the best
    
    // Check if we have more results than we're going to show
    const totalResults = filteredResults.length;
    const hasMoreResults = totalResults > maxResults;
    
    // Limit to specified max results
    const relevantResults = filteredResults.slice(0, maxResults);

    // Format results with relative paths
    const formattedResults = relevantResults.map(result => {
      const fullPath = result.item;
      const score = result.score?.toFixed(3) || '?';
      const fileName = fullPath.split('/').pop() || '';
      
      // Extract relative path from /dist
      const relativePath = fullPath.split('/dist/').pop() || fullPath;

      // Return a formatted entry with path and score
      return `${fileName} (${score})\n${relativePath}`;
    });

    // Build the response
    const response: any = {
      exactMatches: false,
      text: formattedResults.join("\n\n")
    };
    
    // Add information about additional results if applicable
    if (hasMoreResults) {
      response.totalResults = totalResults;
      response.shownResults = maxResults;
      response.additionalResults = totalResults - maxResults;
    }

    return response;
  }
}

export default FilenameSearchTool;
