import { globby } from 'globby';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root path (useful for resolving paths)
export const projectRoot = path.resolve(__dirname, '../..');

export type SearchResult = {
  filePath: string; // Path in the format expected by DocFileViewTool
  matches: Array<{
    line: number; // 1-based line number
    text: string; // The text content of the matching line
    offset: number; // 0-based line offset (for DocFileViewTool)
  }>;
  totalLines?: number; // Total number of lines in the file
};

export type FileSystem = {
  docsFiles: () => Promise<string[]>;
  readDocFile: (filePath: string, offset?: number, maxLines?: number) => Promise<string>;
  searchDocFiles: (searchTerm: string) => Promise<SearchResult[]>;
  rulesFiles: () => Promise<string[]>;
  readRuleFile: (filePath: string) => Promise<string>;
  listRules: () => Promise<string[]>;
  listSiblingDocFiles: (filePath: string) => Promise<string[]>;
};

export async function runGlobby(searchTerm: string) {
  try {
    // Use __dirname from ES Module equivalent set up at the top of the file
    const projectRoot = path.resolve(__dirname, '../..');
    console.error(`Looking for docs in: ${projectRoot}/dist/docs/${searchTerm}`);
    const mdFiles = await globby(`${projectRoot}/dist/docs/${searchTerm}`);
    console.error(`Found ${mdFiles.length} matching files`);
    return mdFiles;
  } catch (error) {
    console.error(`Error in runGlobby with pattern ${searchTerm}:`, error);
    return [];
  }
}

let docs: string[] | null = null;
let rules: string[] | null = null;

export const fileSystemBuilder = (): FileSystem => {
  return {
    async docsFiles() {
      if (!docs) {
        // Search for both MD and MDX files
        docs = await runGlobby('**/*.{md,mdx}');
      }
      return docs;
    },

    async rulesFiles() {
      if (!rules) {
        // Search for MDC files in the rules directory
        const projectRoot = path.resolve(__dirname, '../..');
        const mdcFiles = await globby(`${projectRoot}/dist/rules/**/*.mdc`);
        rules = mdcFiles;
      }
      return rules;
    },

    async listRules() {
      const files = await this.rulesFiles();
      return files.map((filePath) => {
        // Extract just the filename without the path
        return path.basename(filePath);
      });
    },

    async readRuleFile(filePath: string): Promise<string> {
      try {
        // If full path provided, use it directly
        if (filePath.includes('/dist/rules/')) {
          const absolutePath = filePath;
          return await fs.readFile(absolutePath, 'utf-8');
        }

        // If just a filename provided, find it in the rules directory
        const files = await this.rulesFiles();
        const ruleFile =
          files.find((file) => file.endsWith(`/${filePath}`)) ||
          files.find((file) => path.basename(file) === filePath);

        if (!ruleFile) {
          throw new Error(`Rule file not found: ${filePath}`);
        }

        return await fs.readFile(ruleFile, 'utf-8');
      } catch (error) {
        console.error(`Error reading rule file ${filePath}:`, error);
        throw new Error(`Failed to read rule file: ${filePath}`);
      }
    },

    async readDocFile(filePath: string, offset?: number, maxLines?: number): Promise<string> {
      try {
        // Extract relative path from the input path using the pattern in FilenameSearchTool
        // Remove any '/dist/' prefix if present, since we'll add it back
        let relativePath = filePath;
        if (relativePath.includes('/dist/')) {
          relativePath = relativePath.split('/dist/').pop() || relativePath;
        }

        // Build the absolute path
        const absolutePath = path.join(projectRoot, 'dist', relativePath);

        // Read the file
        const content = await fs.readFile(absolutePath, 'utf-8');

        // If no offset or maxLines specified, return the entire file
        if (offset === undefined || maxLines === undefined) {
          return content;
        }

        // Otherwise, return the specified lines
        const lines = content.split('\n');
        const startLine = Math.max(0, offset);
        const endLine = Math.min(lines.length, startLine + maxLines);

        return lines.slice(startLine, endLine).join('\n');
      } catch (error) {
        console.error(`Error reading doc file ${filePath}:`, error);
        throw new Error(`Failed to read documentation file: ${filePath}`);
      }
    },

    async searchDocFiles(searchTerm: string): Promise<SearchResult[]> {
      try {
        const files = await this.docsFiles();
        const searchResults: SearchResult[] = [];

        // Escape special regex characters in the search term
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Create case insensitive regex for better search
        const searchRegex = new RegExp(escapedTerm, 'i');

        // Process files in batches to control concurrency
        const batchSize = 50; // Adjust based on expected file size and system resources

        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);

          // Process each batch concurrently
          const batchResults = await Promise.all(
            batch.map(async (filePath) => {
              try {
                // Read the file
                const content = await this.readDocFile(filePath);
                const lines = content.split('\n');

                const matches = lines
                  .map((text, lineIndex) => {
                    if (searchRegex.test(text)) {
                      // Add offset property (0-based) which is the same as lineIndex
                      return {
                        line: lineIndex + 1, // 1-based line number for display
                        text,
                        offset: lineIndex, // 0-based offset for DocFileViewTool
                      };
                    }
                    return null;
                  })
                  .filter(
                    (match): match is { line: number; text: string; offset: number } =>
                      match !== null
                  );

                if (matches.length > 0) {
                  // Format the path in the same way as FilenameSearchTool
                  // Extract relative path from /dist (if present)
                  let relativePath = filePath;
                  if (relativePath.includes('/dist/')) {
                    relativePath = relativePath.split('/dist/').pop() || relativePath;
                  } else {
                    // Just ensure we're returning the path relative to dist/
                    relativePath = relativePath.replace(`${projectRoot}/dist/`, '');
                  }

                  // Create a SearchResult object
                  const searchResult: SearchResult = {
                    filePath: relativePath,
                    matches,
                    totalLines: lines.length,
                  };
                  return searchResult;
                }
              } catch (error) {
                // Skip files with read errors
                console.error(`Error searching file ${filePath}:`, error);
              }
              return null;
            })
          );

          // Add non-null results to the main results array
          const filteredResults = batchResults.filter(
            (result): result is SearchResult => result !== null
          );
          searchResults.push(...filteredResults);
        }

        return searchResults;
      } catch (error) {
        console.error(`Error searching doc files for ${searchTerm}:`, error);
        return [];
      }
    },

    async listSiblingDocFiles(filePath: string): Promise<string[]> {
      // Normalize the file path to be relative to dist/
      let relativePath = filePath;
      if (relativePath.includes('/dist/')) {
        relativePath = relativePath.split('/dist/').pop() || relativePath;
      }
      // Remove leading slashes
      relativePath = relativePath.replace(/^\/*/, '');
      // Get the directory
      const dir = path.dirname(relativePath);
      // Get all docs files
      const allDocs = await this.docsFiles();
      // Filter for files in the same directory
      const siblings = allDocs
        .map((f) => f.replace(/^.*dist\//, ''))
        .filter((f) => path.dirname(f) === dir)
        .sort();
      return siblings;
    },
  };
};

export const fileSystem = fileSystemBuilder();
