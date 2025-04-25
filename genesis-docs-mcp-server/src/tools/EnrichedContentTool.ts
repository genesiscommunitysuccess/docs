import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import DocContentSearchTool from './DocContentSearchTool.js';
import IngestTool from './IngestTool.js';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const defaultDocsFolder = path.resolve(projectRoot, '../docs');

interface EnrichedContentInput {
  searchString: string;
  outputFormat?: string;
  maxFileSizeKb?: string;
  localFolder?: string;
  maxResults?: string;
}

interface FileResult {
  filePath: string;
  fullPath: string;
  content: string;
  size: number;
  tokens: number;
}

class EnrichedContentTool extends MCPTool<EnrichedContentInput> {
  name = 'enriched';
  description =
    'Performs a content search to find relevant files, then ingests all matching files and combines them into a single result for detailed information.';

  schema = {
    searchString: {
      type: z.string(),
      description: 'Text to search for in documentation files',
    },
    outputFormat: {
      type: z.string().optional().default('markdown'),
      description: 'Output format. Options: markdown, xml, json (default: markdown)',
    },
    maxFileSizeKb: {
      type: z.string().optional().default('50'),
      description: 'Maximum file size in KB to include in the output (default: 50)',
    },
    localFolder: {
      type: z.string().optional(),
      description: 'Local folder path to use for ingestion (defaults to ../docs)',
    },
    maxResults: {
      type: z.string().optional().default('5'),
      description: 'Maximum number of files to process (default: 5)',
    },
  };

  /**
   * Read a single file and return its contents and metadata
   */
  private async readSingleFile(filePath: string): Promise<FileResult | null> {
    try {
      console.log(`Reading file: ${filePath}`);
      
      // Check if file exists and is accessible
      const stats = await fsPromises.stat(filePath);
      if (!stats.isFile()) {
        console.log(`Path exists but is not a file: ${filePath}`);
        return null;
      }
      
      // Read the file content
      const content = await fsPromises.readFile(filePath, 'utf-8');
      
      // Estimate tokens as ~4 characters per token
      const tokens = Math.round(content.length / 4);
      
      return {
        filePath: path.basename(filePath),
        fullPath: filePath,
        content,
        size: stats.size,
        tokens
      };
    } catch (error) {
      console.error(`Error reading file: ${filePath}`, error);
      return null;
    }
  }

  /**
   * Extract all file paths from search results
   */
  private extractFilePaths(searchResult: string): string[] {
    const regex = /filePath: (.*?)(?:\n|\r|$)/g;
    const matches = [...searchResult.matchAll(regex)];
    
    if (matches.length === 0) {
      return [];
    }
    
    return matches.map(match => match[1].trim());
  }

  /**
   * Combine multiple file contents into a single output file
   */
  private async combineFiles(files: FileResult[], input: EnrichedContentInput): Promise<any> {
    try {
      // Create a timestamp for the output filename
      const timestamp = new Date().getTime();
      const outputFilename = `combined-${timestamp}.md`;
      
      // Prepare the combined content
      let combinedContent = `# Combined Results for "${input.searchString}"\n\n`;
      
      // Add each file with headers
      files.forEach(file => {
        combinedContent += `## ${file.filePath}\n\n`;
        combinedContent += file.content;
        combinedContent += '\n\n---\n\n';
      });
      
      // Save combined file to dist/output directory
      const outputDir = path.join(projectRoot, 'dist', 'output');
      await fsPromises.mkdir(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, outputFilename);
      await fsPromises.writeFile(outputPath, combinedContent);
      
      // Calculate combined stats
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const totalTokens = files.reduce((sum, file) => sum + file.tokens, 0);
      
      return {
        success: true,
        message: `Successfully combined ${files.length} files`,
        files: files.map(f => f.filePath),
        stats: {
          outputSize: `${(totalSize / 1024).toFixed(2)} KB`,
          estimatedTokens: totalTokens,
          fileCount: files.length,
          outputFormat: 'markdown'
        },
        outputFile: outputFilename,
        relativePath: `output/${outputFilename}`,
      };
    } catch (error) {
      console.error('Error combining files:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Execute the IngestTool with the given folder and return a structured result
   */
  private async runIngest(folder: string, filePath: string, targetSubPath: string | null, input: EnrichedContentInput) {
    const ingestTool = new IngestTool();
    console.log(`Calling IngestTool with folder: ${folder}`);
    
    const ingestResult = await ingestTool.execute({
      folder,
      outputFormat: input.outputFormat,
      maxFileSizeKb: input.maxFileSizeKb
    });
    
    const result: any = {
      searchString: input.searchString,
      filePath,
      targetFolder: folder,
      ingestResult
    };
    
    // Only add targetSubPath if it exists
    if (targetSubPath) {
      result.targetSubPath = targetSubPath;
    }
    
    return result;
  }

  async execute(input: EnrichedContentInput) {
    try {
      // Determine and validate local folder
      const localFolder = input.localFolder || defaultDocsFolder;
      const maxResults = parseInt(input.maxResults || '5', 10);
      
      try {
        const stats = fs.statSync(localFolder);
        if (!stats.isDirectory()) {
          return {
            success: false,
            error: `Local folder is not a directory: ${localFolder}`
          };
        }
        console.log(`Using local folder for ingestion: ${localFolder}`);
      } catch (err) {
        return {
          success: false,
          error: `Cannot access local folder: ${localFolder}. Error: ${err instanceof Error ? err.message : String(err)}`
        };
      }

      // Search for content
      const contentSearchTool = new DocContentSearchTool();
      const searchResult = await contentSearchTool.execute({
        searchString: input.searchString,
        showContent: 'true',
      });

      // Validate search results
      if (typeof searchResult !== 'string' || searchResult.trim() === '') {
        return 'No search results found for the provided search string.';
      }

      // Extract all file paths from search results
      const filePaths = this.extractFilePaths(searchResult);
      
      if (filePaths.length === 0) {
        return 'No valid file paths found in search results.';
      }
      
      console.log(`Found ${filePaths.length} file paths in search results.`);
      
      // Limit the number of results to process
      const limitedPaths = filePaths.slice(0, maxResults);
      
      // Process each file
      const fileResults: FileResult[] = [];
      
      for (const relativeFilePath of limitedPaths) {
        // Construct the full path to the actual file
        const fullFilePath = path.join(
          localFolder, 
          relativeFilePath.startsWith('docs/') ? relativeFilePath.substring(5) : relativeFilePath
        );
        
        console.log(`Processing file: ${relativeFilePath} -> ${fullFilePath}`);
        
        // Check if the file exists
        if (fs.existsSync(fullFilePath) && fs.statSync(fullFilePath).isFile()) {
          const fileResult = await this.readSingleFile(fullFilePath);
          if (fileResult) {
            fileResults.push(fileResult);
          }
        } else {
          console.log(`File not found or not a regular file: ${fullFilePath}`);
        }
      }
      
      if (fileResults.length === 0) {
        console.log(`No files could be processed. Falling back to directory-based approach.`);
        
        // Fall back to the original directory-based approach with the first file path
        if (filePaths.length > 0) {
          const firstFilePath = filePaths[0];
          
          // Parse file path to get components
          const pathWithoutDocsPrefix = firstFilePath.startsWith('docs/') ? firstFilePath.substring(5) : firstFilePath;
          const pathComponents = pathWithoutDocsPrefix.split('/');
          
          if (pathComponents.length === 0) {
            console.log(`Empty path components, falling back to full folder: ${localFolder}`);
            return this.runIngest(localFolder, firstFilePath, null, input);
          }
          
          // Extract top-level component
          const firstComponent = pathComponents[0];
          const topLevelComponent = firstComponent;
          
          console.log(`Extracted top-level component: ${topLevelComponent}`);
          
          // Determine target path based on file path structure
          const lastComponent = pathComponents[pathComponents.length - 1];
          const isFile = lastComponent && (lastComponent.endsWith('.md') || lastComponent.endsWith('.mdx'));
          
          // Create subfolder path 
          const targetSubPath = isFile && pathComponents.length > 1 
            ? pathComponents.slice(0, -1).join('/') // Remove filename for file paths
            : (pathComponents.length > 1 ? `${pathComponents[0]}/${pathComponents[1]}` : pathComponents[0]); // Use top/second level for dirs
          
          console.log(`Target subfolder path: ${targetSubPath}`);
          
          // Try target subfolder path first
          const targetFolderPath = path.join(localFolder, targetSubPath);
          console.log(`Checking target folder: ${targetFolderPath}`);
          
          if (fs.existsSync(targetFolderPath) && fs.statSync(targetFolderPath).isDirectory()) {
            console.log(`Using target folder: ${targetFolderPath}`);
            return this.runIngest(targetFolderPath, firstFilePath, targetSubPath, input);
          }
          
          // Try top-level component as fallback
          if (topLevelComponent && topLevelComponent !== targetSubPath) {
            const fallbackPath = path.join(localFolder, topLevelComponent);
            
            if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isDirectory()) {
              console.log(`Found fallback target folder: ${fallbackPath}`);
              return this.runIngest(fallbackPath, firstFilePath, null, input);
            }
          }
          
          // Use entire local folder as last resort
          console.log(`No suitable target folder found. Using entire local folder: ${localFolder}`);
          return this.runIngest(localFolder, firstFilePath, null, input);
        } else {
          return {
            success: false,
            error: "No files could be processed and no fallback paths available."
          };
        }
      }
      
      // Combine all file results into a single output
      console.log(`Successfully processed ${fileResults.length} files. Combining results.`);
      return this.combineFiles(fileResults, input);
    } catch (error) {
      console.error('Error during enriched content process:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export default EnrichedContentTool; 