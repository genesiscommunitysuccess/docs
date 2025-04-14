import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import { fileSystem } from '../services/FileSystem.js';

interface DocFileViewInput {
  filePath: string;
  offset?: number;
  maxLines?: number;
}

class DocFileViewTool extends MCPTool<DocFileViewInput> {
  name = 'doc-file-view';
  description =
    'View the contents of a documentation file. This tool is designed to work seamlessly with the output from FilenameSearchTool - you can use the file paths returned by FilenameSearchTool as input to this tool. The content is returned as raw markdown, preserving all formatting and newlines for proper rendering.';

  schema = {
    filePath: {
      type: z.string(),
      description:
        'The file path, relative to the project root dist directory. This should match the format returned by FilenameSearchTool (e.g., "docs/path/to/file.md").',
    },
    offset: {
      type: z.number().int().min(0).optional(),
      description:
        'Optional line number to start reading from (0-based index). Use this when you only need to view a specific portion of a large file.',
    },
    maxLines: {
      type: z.number().int().positive().optional(),
      description:
        'Optional maximum number of lines to read. Use together with offset to paginate through large files.',
    },
  };

  async execute(input: DocFileViewInput) {
    try {
      // Read the file using the FileSystem service
      const content = await fileSystem.readDocFile(input.filePath, input.offset, input.maxLines);

      // Determine if content is truncated
      const isTruncated = input.offset !== undefined && input.maxLines !== undefined;

      return {
        content,
        isTruncated,
        offset: input.offset,
        maxLines: input.maxLines,
        filePath: input.filePath,
      };
    } catch (error) {
      // Return error message in a consistent format
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        filePath: input.filePath,
      };
    }
  }
}

export default DocFileViewTool;
