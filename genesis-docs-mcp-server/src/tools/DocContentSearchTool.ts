import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import { fileSystem, SearchResult } from '../services/FileSystem.js';

interface DocContentSearchInput {
  searchString: string;
  showContent?: string;
  noFallbackSearch?: string;
  // TODO: return sibling files?
}

interface FallbackStrategy {
  strategy: (x: string) => string | null;
  description: string;
}

const fallbacks: FallbackStrategy[] = [
  {
    description: 'Change alpha to rapid, as rapid is the favoured design system.',
    strategy: (x) => (x.includes('alpha') ? x.replaceAll('alpha', 'rapid') : null),
  },
  {
    description: 'Change zero to rapid, as rapid is the favoured design system.',
    strategy: (x) => (x.includes('zero') ? x.replaceAll('zero', 'rapid') : null),
  },
  {
    description: 'Removing any "_" to widen search terms',
    strategy: (x) => (x.includes('_') ? x.replaceAll('_', ' ') : null),
  },
  {
    description: 'Removing any "-" to widen search terms',
    strategy: (x) => (x.includes('-') ? x.replaceAll('-', ' ') : null),
  },
  {
    description: 'Using less search terms',
    strategy: (x) => {
      const tokens = x.split(' ');
      if (tokens.length <= 1) return null;
      return tokens.slice(0, -1).join(' ');
    },
  },
  {
    description: 'Using less search terms',
    strategy: (x) => {
      const tokens = x.split(' ');
      if (tokens.length <= 1) return null;
      return tokens.slice(0, -1).join(' ');
    },
  },
];

class DocContentSearchTool extends MCPTool<DocContentSearchInput> {
  name = 'doc-content-search';
  description =
    'DocContentSearch allows you to search for text in the genesis docs and receive which files have the search term. You can then use that information to use the DocFileViewTool to read and understand the documentation. You could also use the filepath to search for other similar files using the FilenameSearchTool so you can get more context.';

  schema = {
    searchString: {
      type: z.string(),
      description: 'Text to search for in documentation files',
    },
    showContent: {
      type: z.string().optional(),
      description: 'If set to "true" then return the line content which contains the match',
    },
    noFallbackSearch: {
      type: z.string().optional().default('false'),
      description:
        'By default if there is no match then strategies are attempted on the search string to find matches, such as taking a subset of the input. If this is set true then no matches just return that without trying to find backups',
    },
  };

  async pipeline(
    input: DocContentSearchInput,
    strategies: FallbackStrategy[],
    fallbackInfo: string
  ): Promise<[SearchResult[], string]> {
    const results = await fileSystem.searchDocFiles(input.searchString);
    if (results.length > 0 || strategies.length === 0) {
      return [results, fallbackInfo];
    }
    const withStrategy = strategies[0].strategy(input.searchString);
    return await this.pipeline(
      { ...input, searchString: withStrategy ?? input.searchString },
      strategies.slice(1),
      fallbackInfo + withStrategy ? strategies[0].description + ';' : ''
    );
  }

  async execute(input: DocContentSearchInput) {
    const [results, fallbackInfo] = await this.pipeline(
      input,
      input.noFallbackSearch === 'true' ? [] : fallbacks,
      ''
    );
    const fallbackInfoMsg = fallbackInfo
      ? 'Unable to find result with original search term, tried fallback search criteria changes: ' +
        fallbackInfo
      : '';
    if (results.length === 0) {
      return `No results. ${fallbackInfoMsg}`;
    }
    const s = input.showContent === 'true';
    return (
      fallbackInfoMsg +
      results
        .map(
          (res) => `
-----
filePath: ${res.filePath}
totalLines: ${res.totalLines}

${res.matches.map((f, i) => `(Match ${i}, offset ${f.offset}): ${s ? f.text : ''}`).join('\n')}
-----
`
        )
        .join('\n\n')
    );
  }
}

export default DocContentSearchTool;
