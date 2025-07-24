import { Result } from '../../types/result';

/**
 * Filesystem Repository Service interface for automated documentation updates
 */
export interface FilesystemRepositoryService {
  /**
   * Searches for a string pattern in all files within the docs directory
   * @param searchPattern - The string pattern to search for
   * @returns Promise<Result<GrepResult[], FilesystemError>> - Search results or error
   */
  grepDocs(searchPattern: string): Promise<Result<GrepResult[], FilesystemError>>;

  /**
   * Reads a doc file with optional line count and offset parameters
   * @param relativePath - The file path relative to docsRepoPath/docs
   * @param options - Optional parameters for reading the file
   * @returns Promise<Result<DocFileContent, FilesystemError>> - File content or error
   */
  readDocFile(relativePath: string, options?: ReadDocFileOptions): Promise<Result<DocFileContent, FilesystemError>>;
}

/**
 * Filesystem-specific error types
 */
export interface FilesystemError {
  /** Type of filesystem error */
  type: 'docs_directory_not_found' | 'search_pattern_invalid' | 'file_read_error' | 'file_not_found' | 'invalid_file_path' | 'unknown';
  /** Human-readable error message */
  message: string;
  /** Original error details if available */
  details?: string;
  /** File path where the error occurred */
  filePath?: string;
  /** Search pattern that caused the error */
  searchPattern?: string;
}

/**
 * Result of a grep search operation
 */
export interface GrepResult {
  /** The matched line content */
  line: string;
  /** Line number (1-indexed) */
  lineNumber: number;
  /** File path relative to docsRepoPath/docs (can be used directly with readDocFile) */
  filePath: string;
  /** Full file path */
  fullPath: string;
}

/**
 * Options for reading a doc file
 */
export interface ReadDocFileOptions {
  /** Number of lines to read (default: all lines) */
  lineCount?: number;
  /** Number of lines to skip from the beginning (default: 0) */
  offset?: number;
}

/**
 * Content of a doc file
 */
export interface DocFileContent {
  /** The file path relative to docs repository root */
  relativePath: string;
  /** The full file path */
  fullPath: string;
  /** The file content as an array of lines */
  lines: string[];
  /** Total number of lines in the file */
  totalLines: number;
  /** Number of lines actually read */
  linesRead: number;
  /** Line offset used for reading */
  offset: number;
}

/**
 * Configuration options for filesystem repository services
 */
export interface FilesystemRepositoryConfig {
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
} 