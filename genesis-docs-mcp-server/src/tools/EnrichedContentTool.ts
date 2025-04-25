import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import DocContentSearchTool from './DocContentSearchTool.js';
import IngestTool from './IngestTool.js';
import MixinCodeSamplesTool from './MixinCodeSamplesTool.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

interface DocContentSearchResult {
  success: boolean;
  error?: string;
  matches?: Array<{
    file: string;
    content?: string;
    matches?: number;
  }>;
}

interface MixinCodeSamplesResult {
  success: boolean;
  error?: string;
  repos?: string[];
  mdxFile?: string;
  extractedTerms?: string[];
  totalMatches?: number;
  topMatches?: any[];
  matchesByCategory?: any;
  relevanceNote?: string;
}

interface EnrichedContentInput {
  searchString: string;
  maxResults?: string;
  includeOriginalText?: string;
  outputFormat?: string;
  maxFileSizeKb?: string;
  localFolder?: string;
}

class EnrichedContentTool extends MCPTool<EnrichedContentInput> {
  name = 'enriched';
  description = 'Search for documentation and enrich it with relevant code samples from GitHub repos';
  
  private contentSearchTool = new DocContentSearchTool();
  private ingestTool = new IngestTool();
  private codeSamplesTool = new MixinCodeSamplesTool();

  schema = {
    searchString: {
      type: z.string(),
      description: 'Text to search for in documentation files',
    },
    maxResults: {
      type: z.string().optional().default('3'),
      description: 'Maximum number of files to process',
    },
    includeOriginalText: {
      type: z.string().optional().default('true'),
      description: 'Whether to include the original documentation text in the output',
    },
    outputFormat: {
      type: z.string().optional().default('markdown'),
      description: 'Output format for ingested content (markdown, xml, json)',
    },
    maxFileSizeKb: {
      type: z.string().optional().default('100'),
      description: 'Maximum file size to include in KB',
    },
    localFolder: {
      type: z.string().optional(),
      description: 'Local folder path to use for ingestion',
    },
  };

  /**
   * Extract GitHub repository URLs directly from content
   */
  private extractGitHubRepoUrls(content: string): string[] {
    const repoUrls: string[] = [];
    
    // Look for GitHub URLs in the content
    const githubPattern = /https:\/\/github\.com\/([^\/\s"')]+)\/([^\/\s"')]+)/g;
    const matches = [...content.matchAll(githubPattern)];
    
    for (const match of matches) {
      const fullUrl = match[0];
      const owner = match[1];
      const repo = match[2];
      
      // Check if this is a repo URL (not a file or issue)
      if (owner && repo) {
        // Just get the repo owner/name, without the specific path
        repoUrls.push(`${owner}/${repo}`);
      }
    }
    
    // Return unique repository URLs
    return [...new Set(repoUrls)];
  }

  async execute(input: EnrichedContentInput) {
    console.log(`Starting enriched content search for: ${input.searchString}`);
    
    try {
      // Step 1: Search for content
      const contentSearchResponse = await this.contentSearchTool.execute({
        searchString: input.searchString,
        showContent: 'true',
      });
      
      // The DocContentSearchTool returns a string, not an object
      // Parse the response string to extract file paths
      if (typeof contentSearchResponse === 'string') {
        if (contentSearchResponse.includes('No results:')) {
          return {
            success: false,
            error: `No documentation matches found for: ${input.searchString}`,
          };
        }
        
        // Parse the search results from the string response
        const matches = [];
        
        // Set to collect repositories for ingestion
        const reposToIngest = new Set<string>();
        
        // Extract files from the response
        const fileMatches = contentSearchResponse.split('-----').filter(section => section.trim());
        
        for (const fileSection of fileMatches) {
          const filePathMatch = fileSection.match(/filePath: ([^\n]+)/);
          
          if (filePathMatch && filePathMatch[1]) {
            const filePath = filePathMatch[1].trim();
            
            // Extract content - but we'll replace this later with the full document
            const matchContent = fileSection.split('\n\n').slice(1).join('\n\n').trim();
            
            // Extract GitHub repositories directly from the content
            const repoUrls = this.extractGitHubRepoUrls(matchContent);
            
            // Add each repository to the ingest list
            for (const repo of repoUrls) {
              reposToIngest.add(repo);
            }
            
            matches.push({
              file: filePath,
              matchContent,
              matches: (fileSection.match(/\(Match \d+/g) || []).length,
              repos: repoUrls
            });
          }
        }
        
        if (matches.length === 0) {
          return {
            success: false,
            error: `No documentation matches found for: ${input.searchString}`,
          };
        }
        
        console.log(`Found ${matches.length} documentation matches`);
        
        // Limit number of files to process
        const maxResults = parseInt(input.maxResults || '3', 10);
        const filesToProcess = matches.slice(0, maxResults);
        
        const results = [];
        
        // Step 2: Process each file to extract relevant code samples and full content
        for (const fileMatch of filesToProcess) {
          const { file } = fileMatch;
          console.log(`Processing file: ${file}`);
          
          // Get code samples from the MixinCodeSamplesTool
          const codeSamplesResponse = await this.codeSamplesTool.execute({
            mdxFilePath: file,
          });
          
          // Safely convert to our expected type
          const codeSamplesResult = codeSamplesResponse as unknown as MixinCodeSamplesResult;
          
          console.log('MixinCodeSamplesResult success:', codeSamplesResult.success);
          console.log('MixinCodeSamplesResult repos:', codeSamplesResult.repos);
          
          // If code samples are found, add the repos to the ingest list
          if (codeSamplesResult.success && codeSamplesResult.repos) {
            console.log(`Found ${codeSamplesResult.repos.length} relevant repositories for ${file}`);
            
            // Add repos to the list to ingest
            for (const repo of codeSamplesResult.repos) {
              console.log(`Adding repository for ingestion: ${repo}`);
              reposToIngest.add(repo);
            }
          }
          
          // Get the full content of the MDX file
          let fullContent = '';
          try {
            // Determine folder to use
            const localFolder = input.localFolder || path.resolve(projectRoot, '../docs');
            
            // Fix for duplicate "docs/" in path
            let mdxFilePath = file;
            if (mdxFilePath.startsWith('docs/') && localFolder.endsWith('/docs')) {
              mdxFilePath = mdxFilePath.substring(5); // Remove the 'docs/' prefix
            }
            
            // Construct the full path to the MDX file
            const fullMdxPath = path.isAbsolute(mdxFilePath) 
              ? mdxFilePath 
              : path.join(localFolder, mdxFilePath);
            
            // Read the full content of the file
            const mdxContent = await fs.readFile(fullMdxPath, 'utf-8');
            fullContent = mdxContent;
            console.log(`Read full content for file: ${file}`);
          } catch (err) {
            console.error(`Error reading full content for ${file}:`, err);
            // Fallback to match content if we can't read the full file
            fullContent = fileMatch.matchContent;
          }
          
          results.push({
            file,
            content: fullContent, 
            codeSamplesResult
          });
        }
        
        // Step 3: Ingest all unique repositories found
        const ingestResults = [];
        
        if (reposToIngest.size > 0) {
          console.log(`Ingesting ${reposToIngest.size} unique repositories`);
          
          for (const repo of reposToIngest) {
            console.log(`Ingesting repository: ${repo}`);
            
            const ingestResult = await this.ingestTool.execute({
              repository: repo,
              outputFormat: input.outputFormat || 'markdown',
              maxFileSizeKb: input.maxFileSizeKb || '100',
              ignorePatterns: '*.jpg,*.png,*.gif,node_modules/**,dist/**',
              folder: input.localFolder,
            });
            
            ingestResults.push({
              repository: repo,
              ingestResult
            });
          }
        }
        
        // Step 4: Prepare the combined result
        const includeOriginalText = input.includeOriginalText !== 'false';
        
        // Create temporary directories for the combined output
        const tempDir = path.join(projectRoot, 'dist', 'temp');
        const outputDir = path.join(projectRoot, 'dist', 'output');
        await fs.mkdir(tempDir, { recursive: true });
        await fs.mkdir(outputDir, { recursive: true });
        
        // Create a random filename for the output
        const timestamp = new Date().getTime();
        const outputFilename = `enriched-${timestamp}.md`;
        const outputPath = path.join(outputDir, outputFilename);
        
        // Combine all documentation files and code samples
        let combinedOutput = `# Enriched Content for: ${input.searchString}\n\n`;
        
        for (const result of results) {
          combinedOutput += `## Documentation: ${result.file}\n\n`;
          
          if (includeOriginalText && result.content) {
            combinedOutput += `### Original Content\n\n${result.content}\n\n`;
          }
          
          if (result.codeSamplesResult.success && result.codeSamplesResult.repos) {
            combinedOutput += `### Related Code Repositories\n\n`;
            
            for (const repo of result.codeSamplesResult.repos) {
              combinedOutput += `- ${repo}\n`;
            }
            
            combinedOutput += `\n`;
          }
        }
        
        // Add ingested repository content
        if (ingestResults.length > 0) {
          combinedOutput += `## Related Code Content\n\n`;
          
          for (const ingestResult of ingestResults) {
            if (ingestResult.ingestResult.success && ingestResult.ingestResult.relativePath) {
              combinedOutput += `### From Repository: ${ingestResult.repository}\n\n`;
              
              // Get the path to the ingested content file
              const ingestedContentPath = path.join(projectRoot, 'dist', ingestResult.ingestResult.relativePath);
              
              try {
                // Read the ingested content
                const ingestedContent = await fs.readFile(ingestedContentPath, 'utf-8');
                
                // Get the full content or truncate if extremely large to avoid memory issues
                const contentSummary = ingestedContent.length > 20000 
                  ? ingestedContent.substring(0, 20000) + '\n\n... (content truncated for brevity) ...'
                  : ingestedContent;
                
                combinedOutput += `${contentSummary}\n\n`;
              } catch (err) {
                combinedOutput += `Error reading ingested content: ${err instanceof Error ? err.message : String(err)}\n\n`;
              }
            }
          }
        }
        
        // Write the combined output to the file
        await fs.writeFile(outputPath, combinedOutput);
        
        return {
          success: true,
          message: `Enriched content created successfully`,
          matches: filesToProcess.length,
          repositories: reposToIngest.size,
          outputFile: outputFilename,
          relativePath: `output/${outputFilename}`,
        };
      } else {
        // Fallback to the old approach if the response is not a string
        const contentSearchResult = contentSearchResponse as unknown as DocContentSearchResult;
        
        if (!contentSearchResult.success || !contentSearchResult.matches || contentSearchResult.matches.length === 0) {
          return {
            success: false,
            error: `No documentation matches found for: ${input.searchString}`,
          };
        }
        
        console.log(`Found ${contentSearchResult.matches.length} documentation matches`);
        
        // Limit number of files to process
        const maxResults = parseInt(input.maxResults || '3', 10);
        const filesToProcess = contentSearchResult.matches.slice(0, maxResults);
        
        const results = [];
        const reposToIngest = new Set<string>();
        
        // Step 2: Process each file to extract relevant code samples
        for (const fileMatch of filesToProcess) {
          const { file, content } = fileMatch;
          console.log(`Processing file: ${file}`);
          
          // Extract GitHub repositories directly from the content if available
          if (content) {
            const repoUrls = this.extractGitHubRepoUrls(content);
            
            // Add each repository to the ingest list
            for (const repo of repoUrls) {
              console.log(`Adding repository for ingestion: ${repo}`);
              reposToIngest.add(repo);
            }
          }
          
          // Get code samples from the MixinCodeSamplesTool
          const codeSamplesResponse = await this.codeSamplesTool.execute({
            mdxFilePath: file,
          });
          
          // Safely convert to our expected type
          const codeSamplesResult = codeSamplesResponse as unknown as MixinCodeSamplesResult;
          
          console.log('MixinCodeSamplesResult success:', codeSamplesResult.success);
          console.log('MixinCodeSamplesResult repos:', codeSamplesResult.repos);
          
          // If code samples are found, add the repos to the ingest list
          if (codeSamplesResult.success && codeSamplesResult.repos) {
            console.log(`Found ${codeSamplesResult.repos.length} relevant repositories for ${file}`);
            
            // Add repos to the list to ingest
            for (const repo of codeSamplesResult.repos) {
              console.log(`Adding repository for ingestion: ${repo}`);
              reposToIngest.add(repo);
            }
          }
          
          // Get the full content of the MDX file
          let fullContent = '';
          try {
            // Determine folder to use
            const localFolder = input.localFolder || path.resolve(projectRoot, '../docs');
            
            // Fix for duplicate "docs/" in path
            let mdxFilePath = file;
            if (mdxFilePath.startsWith('docs/') && localFolder.endsWith('/docs')) {
              mdxFilePath = mdxFilePath.substring(5); // Remove the 'docs/' prefix
            }
            
            // Construct the full path to the MDX file
            const fullMdxPath = path.isAbsolute(mdxFilePath) 
              ? mdxFilePath 
              : path.join(localFolder, mdxFilePath);
            
            // Read the full content of the file
            const mdxContent = await fs.readFile(fullMdxPath, 'utf-8');
            fullContent = mdxContent;
            console.log(`Read full content for file: ${file}`);
          } catch (err) {
            console.error(`Error reading full content for ${file}:`, err);
            // Fallback to match content if we can't read the full file
            fullContent = content || '';
          }
          
          results.push({
            file,
            content: fullContent,
            codeSamplesResult
          });
        }
        
        // Step 3: Ingest all unique repositories found
        const ingestResults = [];
        
        if (reposToIngest.size > 0) {
          console.log(`Ingesting ${reposToIngest.size} unique repositories`);
          
          for (const repo of reposToIngest) {
            console.log(`Ingesting repository: ${repo}`);
            
            const ingestResult = await this.ingestTool.execute({
              repository: repo,
              outputFormat: input.outputFormat || 'markdown',
              maxFileSizeKb: input.maxFileSizeKb || '100',
              ignorePatterns: '*.jpg,*.png,*.gif,node_modules/**,dist/**',
              folder: input.localFolder,
            });
            
            ingestResults.push({
              repository: repo,
              ingestResult
            });
          }
        }
        
        // Step 4: Prepare the combined result
        const includeOriginalText = input.includeOriginalText !== 'false';
        
        // Create temporary directories for the combined output
        const tempDir = path.join(projectRoot, 'dist', 'temp');
        const outputDir = path.join(projectRoot, 'dist', 'output');
        await fs.mkdir(tempDir, { recursive: true });
        await fs.mkdir(outputDir, { recursive: true });
        
        // Create a random filename for the output
        const timestamp = new Date().getTime();
        const outputFilename = `enriched-${timestamp}.md`;
        const outputPath = path.join(outputDir, outputFilename);
        
        // Combine all documentation files and code samples
        let combinedOutput = `# Enriched Content for: ${input.searchString}\n\n`;
        
        for (const result of results) {
          combinedOutput += `## Documentation: ${result.file}\n\n`;
          
          if (includeOriginalText && result.content) {
            combinedOutput += `### Original Content\n\n${result.content}\n\n`;
          }
          
          if (result.codeSamplesResult.success && result.codeSamplesResult.repos) {
            combinedOutput += `### Related Code Repositories\n\n`;
            
            for (const repo of result.codeSamplesResult.repos) {
              combinedOutput += `- ${repo}\n`;
            }
            
            combinedOutput += `\n`;
          }
        }
        
        // Add ingested repository content
        if (ingestResults.length > 0) {
          combinedOutput += `## Related Code Content\n\n`;
          
          for (const ingestResult of ingestResults) {
            if (ingestResult.ingestResult.success && ingestResult.ingestResult.relativePath) {
              combinedOutput += `### From Repository: ${ingestResult.repository}\n\n`;
              
              // Get the path to the ingested content file
              const ingestedContentPath = path.join(projectRoot, 'dist', ingestResult.ingestResult.relativePath);
              
              try {
                // Read the ingested content
                const ingestedContent = await fs.readFile(ingestedContentPath, 'utf-8');
                
                // Get a summary (first 1000 characters) to avoid massive output
                const contentSummary = ingestedContent.length > 2000 
                  ? ingestedContent.substring(0, 2000) + '\n\n... (content truncated for brevity) ...'
                  : ingestedContent;
                
                combinedOutput += `${contentSummary}\n\n`;
              } catch (err) {
                combinedOutput += `Error reading ingested content: ${err instanceof Error ? err.message : String(err)}\n\n`;
              }
            }
          }
        }
        
        // Write the combined output to the file
        await fs.writeFile(outputPath, combinedOutput);
        
        return {
          success: true,
          message: `Enriched content created successfully`,
          matches: filesToProcess.length,
          repositories: reposToIngest.size,
          outputFile: outputFilename,
          relativePath: `output/${outputFilename}`,
        };
      }
    } catch (error) {
      console.error(`Error during enriched content generation:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export default EnrichedContentTool; 