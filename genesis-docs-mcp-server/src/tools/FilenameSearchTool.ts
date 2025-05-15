import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import { fileSystem } from '../services/FileSystem.js';

interface FilenameSearchInput {
  searchString: string;
  showApiDocs?: string;
  strictWordBoundaries?: string;
}

class FilenameSearchTool extends MCPTool<FilenameSearchInput> {
  name = 'filename-search';
  description =
    "This tool allows you to perform a fuzzy search for documentation fileneames and you'll return back all matches as well as any sibling documents that match the directories for extra context. The response is lenient with matches to allow for the most context to be returned - this means some sibling documents may not be relevant.";

  schema = {
    searchString: {
      type: z.string(),
      description: 'The search term to use which is used to fuzzy match against the documentation',
    },
    showApiDocs: {
      type: z.string().optional(),
      description: 'Whether to include API documentation in the search results. Defaults to false.',
    },
    strictWordBoundaries: {
      type: z.string().optional().default('true'),
      description:
        'Whether to enforce a search term as a word boundary. When enabled (default) "pro" would match a file containing "grid-pro", when disabled it would match that as well as a file containing "improving".',
    },
  };

  async execute(input: FilenameSearchInput) {
    const docsFiles = await fileSystem.docsFiles();

    // Filter out API docs if showApiDocs is false (default)
    const filteredDocsFiles =
      input.showApiDocs === 'true'
        ? docsFiles
        : docsFiles.filter((file) => {
            // Filter out anything with /docs/api/ in the path
            // Also check for lowercase variations to be comprehensive
            return !file.includes('/docs/api/') && !file.includes('/docs/API/');
          });

    // Creates a builder function which enforces matches using word boundaries or not depending on the
    // tool config
    const predicateBuilder =
      input.strictWordBoundaries === 'true'
        ? (searchTerm: string) => (fileName: string) =>
            new RegExp(`\\b${searchTerm}\\b`).test(fileName)
        : (searchTerm: string) => (fileName: string) => fileName.includes(searchTerm);

    // Extract search components and prepare them as predicate functions
    const searchPredicates = input.searchString
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map(predicateBuilder);

    // Filter all the docs which contain any of the search terms
    const preFilteredFiles = filteredDocsFiles.filter((file) => {
      const filename = file.toLowerCase();
      return searchPredicates.some((predicate) => predicate(filename));
    });

    if (!preFilteredFiles) {
      return 'No valid files found for search terms.';
    }

    const validDirs = preFilteredFiles.map(
      (filePath) => '/' + filePath.split('/').slice(1, -1).join('/')
    );

    const filteredFiles = [
      ...new Set(filteredDocsFiles.filter((path) => validDirs.some((dir) => path.includes(dir)))),
    ].sort();

    return filteredFiles.map((filePath) => 'docs' + filePath.split('dist/docs')[1]);
  }
}

export default FilenameSearchTool;
