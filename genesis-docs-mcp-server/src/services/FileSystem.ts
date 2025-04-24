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
  totalLines: number; // Total number of lines in the file
};

export type FileSystem = {
  docsFiles: () => Promise<string[]>;
  readDocFile: (filePath: string, offset?: number, maxLines?: number) => Promise<string>;
  searchDocFiles: (searchTerm: string) => Promise<SearchResult[]>;
  rulesFiles: () => Promise<string[]>;
  readRuleFile: (filePath: string) => Promise<string>;
  listRules: () => Promise<string[]>;
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
      return files.map(filePath => {
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
        const ruleFile = files.find(file => file.endsWith(`/${filePath}`)) || 
                         files.find(file => path.basename(file) === filePath);
                         
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

        // Escape special regex characters in the search term for grep
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Process files in batches to control concurrency
        const batchSize = 50;
        
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          
          // Process each batch concurrently
          const batchResults = await Promise.all(
            batch.map(async (filePath) => {
              try {
                // Use grep to search the file
                const { exec } = await import('child_process');
                const { promisify } = await import('util');
                const execAsync = promisify(exec);
                
                // Run grep with line numbers (-n) and case insensitive (-i)
                const { stdout } = await execAsync(`grep -in "${escapedTerm}" "${filePath}"`);
                
                if (stdout) {
                  const lines = stdout.split('\n').filter(line => line.trim());
                  const matches = lines.map(line => {
                    // grep output format is "filename:linenumber:content"
                    const [_, lineNum, ...contentParts] = line.split(':');
                    const text = contentParts.join(':'); // Rejoin in case content contains colons
                    const lineIndex = parseInt(lineNum) - 1; // Convert to 0-based index
                    
                    return {
                      line: parseInt(lineNum), // 1-based line number
                      text,
                      offset: lineIndex,
                    };
                  });

                  // Get total lines in file using wc -l
                  const { stdout: lineCount } = await execAsync(`wc -l < "${filePath}"`);
                  const totalLines = parseInt(lineCount);

                  // Format the path
                  let relativePath = filePath;
                  if (relativePath.includes('/dist/')) {
                    relativePath = relativePath.split('/dist/').pop() || relativePath;
                  } else {
                    relativePath = relativePath.replace(`${projectRoot}/dist/`, '');
                  }

                  return {
                    filePath: relativePath,
                    matches,
                    totalLines,
                  };
                }
              } catch (error) {
                // Skip files with read errors or no matches
                if ((error as any).code !== 1) { // grep returns 1 when no matches found
                  console.error(`Error searching file ${filePath}:`, error);
                }
              }
              return null;
            })
          );

          // Add non-null results to the main results array
          const filteredResults = batchResults.filter(
            (result): result is SearchResult => result !== null && result.totalLines !== undefined
          );
          searchResults.push(...filteredResults);
        }

        return searchResults;
      } catch (error) {
        console.error(`Error searching doc files for ${searchTerm}:`, error);
        return [];
      }
    },
  };
};

export const fileSystem = fileSystemBuilder();
