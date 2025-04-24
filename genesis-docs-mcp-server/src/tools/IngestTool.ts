import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { runCli, type CliOptions } from 'repomix';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

interface IngestInput {
  repository?: string;
  outputFormat?: string;
  maxFileSizeKb?: string;
  ignorePatterns?: string;
}

class IngestTool extends MCPTool<IngestInput> {
  name = 'ingest';
  description = 'Packs GitHub repositories into a single AI-friendly file using repomix';

  schema = {
    repository: {
      type: z.string().optional().default('genesiscommunitysuccess/docs'),
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
      const repository = input.repository || 'genesiscommunitysuccess/docs';
      const outputFormat = (input.outputFormat || 'markdown').toLowerCase();
      const maxFileSizeKb = input.maxFileSizeKb || '50';
      
      // Format the repository as a GitHub URL if it's not already a full URL
      const repoUrl = repository.startsWith('http') 
        ? repository 
        : `https://github.com/${repository}`;
      
      console.log(`Processing repository: ${repoUrl}`);
      
      // Create a temporary output path
      const outputDir = path.join(projectRoot, 'dist', 'docs');
      await fs.mkdir(outputDir, { recursive: true });
      
      // Create a random filename for the output
      const timestamp = new Date().getTime();
      const outputFilename = `repo-${timestamp}.${outputFormat === 'json' ? 'json' : outputFormat === 'xml' ? 'xml' : 'md'}`;
      const outputPath = path.join(outputDir, outputFilename);
      
      // Parse ignore patterns if provided
      const ignorePatterns = input.ignorePatterns ? input.ignorePatterns.split(',').map(p => p.trim()) : [];
      
      // Configure repomix options
      const options: CliOptions = {
        remote: repoUrl,
        output: outputPath,
        style: outputFormat as any,
        maxFileSize: parseInt(maxFileSizeKb, 10) * 1024, // Convert to bytes
        ignorePatterns,
        compress: false, // Disable compression for easier handling
        quiet: true, // Reduce console output
      };
      
      console.log(`Packing repository with repomix...`);
      const result = await runCli(['.'], process.cwd(), options);
      
      if (!result || !result.packResult) {
        throw new Error('Failed to pack repository with repomix');
      }
      
      // Read the generated file
      const outputContent = await fs.readFile(outputPath, 'utf-8');
      
      // Save the packed file to dist/docs
      const docsDir = path.join(projectRoot, 'dist', 'docs');
      await fs.mkdir(docsDir, { recursive: true });
      
      // Save with a more descriptive filename
      const repoName = repository.split('/').pop() || 'repository';
      const docsFilename = `${repoName}-${timestamp}.${outputFormat === 'json' ? 'json' : outputFormat === 'xml' ? 'xml' : 'md'}`;
      const docsPath = path.join(docsDir, docsFilename);
      
      await fs.writeFile(docsPath, outputContent);
      
      // Calculate stats based on the output file
      const fileStats = await fs.stat(docsPath);
      const totalSize = fileStats.size;
      // Estimate tokens as ~4 characters per token
      const totalTokens = Math.round(outputContent.length / 4);
      
      return {
        success: true,
        message: `Successfully packed repository: ${repository}`,
        stats: {
          outputSize: `${(totalSize / 1024).toFixed(2)} KB`,
          estimatedTokens: totalTokens,
          outputFormat,
        },
        outputFile: docsFilename,
        relativePath: `docs/${docsFilename}`,
      };
    } catch (error) {
      console.error('Error during repository packing:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export default IngestTool; 