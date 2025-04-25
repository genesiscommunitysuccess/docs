import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { runCli, type CliOptions } from 'repomix';
import { execSync } from 'child_process';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

interface IngestInput {
  folder?: string;
  repository?: string;
  outputFormat?: string;
  maxFileSizeKb?: string;
  ignorePatterns?: string;
}

class IngestTool extends MCPTool<IngestInput> {
  name = 'ingest';
  description = 'Packs GitHub repositories or local folders into a single AI-friendly file using repomix';

  schema = {
    folder: {
      type: z.string().optional(),
      description: 'Local folder path to ingest documentation from',
    },
    repository: {
      type: z.string().optional(),
      description: 'GitHub repository to ingest documentation from (e.g., "username/repo")',
    },
    outputFormat: {
      type: z.string().optional().default('markdown'),
      description: 'Output format. Options: markdown, xml, json',
    },
    maxFileSizeKb: {
      type: z.string().optional().default('50'),
      description: 'Maximum file size in KB to include in the output',
    },
    ignorePatterns: {
      type: z.string().optional(),
      description: 'Comma-separated list of glob patterns to ignore (e.g., "*.jpg,*.png,node_modules/**")',
    },
  };

  async execute(input: IngestInput) {
    try {
      if (!input.folder && !input.repository) {
        throw new Error('Either folder or repository parameter must be provided');
      }

      const outputFormat = (input.outputFormat || 'markdown').toLowerCase();
      const maxFileSizeKb = input.maxFileSizeKb || '50';
      
      // Create temporary directories
      const tempDir = path.join(projectRoot, 'dist', 'temp');
      const outputDir = path.join(projectRoot, 'dist', 'output');
      await fs.mkdir(tempDir, { recursive: true });
      await fs.mkdir(outputDir, { recursive: true });
      
      // Create a random filename for the output
      const timestamp = new Date().getTime();
      const outputFilename = `docs-${timestamp}.${outputFormat === 'json' ? 'json' : outputFormat === 'xml' ? 'xml' : 'md'}`;
      const outputPath = path.join(outputDir, outputFilename);
      
      let sourcePath = '';
      let sourceLabel = '';
      
      // Handle GitHub repository
      if (input.repository) {
        console.log(`Processing GitHub repository: ${input.repository}`);
        
        // Set up for remote processing
        sourceLabel = input.repository.replace('/', '-');
        // We'll use '.' as a placeholder since the actual source will be fetched remotely
        sourcePath = '.';
        
        console.log(`Using repomix to process remote repository: ${input.repository}`);
      } else if (input.folder) {
        // Handle local folder
        try {
          const stats = await fs.stat(input.folder);
          if (!stats.isDirectory()) {
            throw new Error(`Path exists but is not a directory: ${input.folder}`);
          }
          
          console.log(`Processing local folder: ${input.folder}`);
          sourcePath = input.folder;
          sourceLabel = path.basename(input.folder);
        } catch (err) {
          throw new Error(`Cannot access folder: ${input.folder}. Error: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
      
      // Parse ignore patterns if provided
      const ignorePatterns = input.ignorePatterns ? input.ignorePatterns.split(',').map(p => p.trim()) : [];
      
      // Configure repomix options
      const options: CliOptions = {
        output: outputPath,
        style: outputFormat as any,
        maxFileSize: parseInt(maxFileSizeKb, 10) * 1024, // Convert to bytes
        ignorePatterns,
        compress: false, // Disable compression for easier handling
        quiet: false, // Suppress console output for cleaner logs
        removeEmptyLines: true, // Remove empty lines to reduce token usage     
      };
      
      // If processing a repository, add the remote option
      if (input.repository) {
        options.remote = `https://github.com/${input.repository}`;
      }
      
      console.log(`Packing with repomix using options:`, JSON.stringify(options, null, 2));
      
      // Pass the source path as the first argument to runCli
      const result = await runCli([sourcePath], process.cwd(), options);
      
      if (!result || !result.packResult) {
        throw new Error(`Failed to pack with repomix. Result: ${JSON.stringify(result)}`);
      }
      
      // Read the generated file
      const outputContent = await fs.readFile(outputPath, 'utf-8');
      
      // Save with a more descriptive filename
      const docsFilename = `${sourceLabel}-${timestamp}.${outputFormat === 'json' ? 'json' : outputFormat === 'xml' ? 'xml' : 'md'}`;
      const docsPath = path.join(outputDir, docsFilename);
      
      await fs.writeFile(docsPath, outputContent);
      
      // Delete the temporary output file
      try {
        await fs.unlink(outputPath);
        console.log(`Deleted temporary file: ${outputPath}`);
        
        // No need to clean up cloned repo as repomix handles this with remote option
      } catch (err) {
        console.warn(`Warning: Failed to delete temporary files: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      // Calculate stats based on the output file
      const fileStats = await fs.stat(docsPath);
      const totalSize = fileStats.size;
      // Estimate tokens as ~4 characters per token
      const totalTokens = Math.round(outputContent.length / 4);
      
      return {
        success: true,
        message: input.repository 
          ? `Successfully packed repository: ${input.repository}`
          : `Successfully packed folder: ${input.folder}`,
        source: input.repository ? `repository: ${input.repository}` : `folder: ${input.folder}`,
        stats: {
          outputSize: `${(totalSize / 1024).toFixed(2)} KB`,
          estimatedTokens: totalTokens,
          outputFormat,
        },
        outputFile: docsFilename,
        relativePath: `output/${docsFilename}`,
      };
    } catch (error) {
      console.error(`Error during packing:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export default IngestTool; 