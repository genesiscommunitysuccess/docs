import { globby } from 'globby';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project root path (useful for resolving paths)
export const projectRoot = path.resolve(__dirname, '../..');

export type FileSystem = {
  docsFiles: () => Promise<string[]>;
  readDocFile: (filePath: string, offset?: number, maxLines?: number) => Promise<string>;
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

export const fileSystemBuilder = (): FileSystem => {
  return {
    async docsFiles() {
      if (!docs) {
        // Search for both MD and MDX files
        docs = await runGlobby('**/*.{md,mdx}');
      }
      return docs;
    },

    async readDocFile(filePath: string, offset?: number, maxLines?: number): Promise<string> {
      try {
        // Ensure the path is properly resolved to the project root and handle dist/ prefix if needed
        const absolutePath = filePath.startsWith('dist/')
          ? path.join(projectRoot, filePath)
          : path.join(projectRoot, 'dist', filePath);

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
  };
};

export const fileSystem = fileSystemBuilder();
