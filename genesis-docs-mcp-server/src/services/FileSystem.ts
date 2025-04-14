import { globby } from 'globby';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type FileSystem = {
  docsFiles: () => Promise<string[]>;
}

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

let docs: string[] | null = null

export const fileSystemBuilder = (): FileSystem => {
  return {
    async docsFiles() {
      if (!docs) {
        // Search for both MD and MDX files
        docs = await runGlobby('**/*.{md,mdx}');
      }
      return docs;
    },
  }
}

export const fileSystem = fileSystemBuilder()
