import { Result } from '../../types/result';
import { GrepResult, FilesystemError, DocFileContent, ReadDocFileOptions } from '../../repositories/filesystem/types';

/**
 * Filesystem Service interface for automated documentation updates
 * This service wraps the filesystem repository service
 */
export interface FilesystemService {
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
 * Configuration options for filesystem services
 */
export interface FilesystemServiceConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
} 