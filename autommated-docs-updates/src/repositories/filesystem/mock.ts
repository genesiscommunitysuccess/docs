import { FilesystemRepositoryService, FilesystemRepositoryConfig, GrepResult, FilesystemError, ReadDocFileOptions, DocFileContent } from './types';
import { Result } from '../../types/result';

/**
 * Mock filesystem repository service for testing
 * 
 * This implementation provides predictable test data without requiring
 * actual filesystem access or real repository structures.
 */
export class MockFilesystemRepository implements FilesystemRepositoryService {
  private config: FilesystemRepositoryConfig;

  constructor(config: FilesystemRepositoryConfig) {
    this.config = config;
  }

  /**
   * Mock grep search that returns predefined test results
   * @param searchPattern - The string pattern to search for
   * @returns Promise<Result<GrepResult[], FilesystemError>> - Mock search results
   */
  async grepDocs(searchPattern: string): Promise<Result<GrepResult[], FilesystemError>> {
    // Validate search pattern
    if (!searchPattern || searchPattern.trim().length === 0) {
      return Result.error({
        type: 'search_pattern_invalid',
        message: 'Search pattern cannot be empty',
        searchPattern
      });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // Return mock results based on search pattern
    const mockResults: GrepResult[] = [
      {
        line: `This is a mock result containing "${searchPattern}" for testing purposes`,
        lineNumber: 42,
        filePath: 'getting-started/installation.md',
        fullPath: `${this.config.docsRepositoryPath}/docs/getting-started/installation.md`
      },
      {
        line: `Another example with "${searchPattern}" in a different file`,
        lineNumber: 15,
        filePath: 'api/reference.md',
        fullPath: `${this.config.docsRepositoryPath}/docs/api/reference.md`
      },
      {
        line: `Third occurrence of "${searchPattern}" for comprehensive testing`,
        lineNumber: 128,
        filePath: 'guides/advanced-usage.md',
        fullPath: `${this.config.docsRepositoryPath}/docs/guides/advanced-usage.md`
      }
    ];

    return Result.success(mockResults);
  }

  /**
   * Mock read doc file that returns predefined test content
   * @param relativePath - The file path relative to docsRepoPath/docs
   * @param options - Optional parameters for reading the file
   * @returns Promise<Result<DocFileContent, FilesystemError>> - Mock file content
   */
  async readDocFile(relativePath: string, options?: ReadDocFileOptions): Promise<Result<DocFileContent, FilesystemError>> {
    // Validate relative path
    if (!relativePath || relativePath.trim().length === 0) {
      return Result.error({
        type: 'invalid_file_path',
        message: 'Relative path cannot be empty',
        filePath: relativePath
      });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create mock file content
    const mockLines = [
      '# Mock Documentation File',
      '',
      'This is a mock documentation file for testing purposes.',
      '',
      '## Section 1',
      '',
      'This section contains some sample content.',
      '',
      '```typescript',
      'function example() {',
      '  console.log("Hello, World!");',
      '}',
      '```',
      '',
      '## Section 2',
      '',
      'Another section with more content.',
      '',
      '### Subsection',
      '',
      'This is a subsection with additional information.',
      '',
      '## Section 3',
      '',
      'Final section with concluding remarks.',
      '',
      'End of mock file.'
    ];

    const totalLines = mockLines.length;
    const offset = options?.offset || 0;
    const lineCount = options?.lineCount || totalLines;

    // Validate offset
    if (offset < 0) {
      return Result.error({
        type: 'invalid_file_path',
        message: 'Offset cannot be negative',
        filePath: relativePath
      });
    }

    // Validate line count
    if (lineCount < 0) {
      return Result.error({
        type: 'invalid_file_path',
        message: 'Line count cannot be negative',
        filePath: relativePath
      });
    }

    // Check if offset is beyond file size
    if (offset >= totalLines) {
      return Result.error({
        type: 'file_read_error',
        message: 'Offset is beyond file size',
        filePath: relativePath,
        details: `File has ${totalLines} lines, but offset is ${offset}`
      });
    }

    // Calculate actual lines to read
    const actualLinesRead = Math.min(lineCount, totalLines - offset);
    const lines = mockLines.slice(offset, offset + actualLinesRead);

    const mockContent: DocFileContent = {
      relativePath,
      fullPath: `${this.config.docsRepositoryPath}/docs/${relativePath}`,
      lines,
      totalLines,
      linesRead: actualLinesRead,
      offset
    };

    return Result.success(mockContent);
  }
} 