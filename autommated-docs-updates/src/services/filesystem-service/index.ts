import { FilesystemService, FilesystemServiceConfig } from './types';
import { createFilesystemRepository } from '../../repositories/filesystem';
import { ReadDocFileOptions, DocFileContent } from '../../repositories/filesystem/types';

/**
 * Filesystem service implementation
 *
 * This service wraps the filesystem repository and provides business logic
 * for filesystem operations related to documentation updates.
 */
export class FilesystemServiceImpl implements FilesystemService {
  private repository: ReturnType<typeof createFilesystemRepository>;

  constructor(config: FilesystemServiceConfig) {
    this.repository = createFilesystemRepository({
      useMock: config.useMock,
      docsRepositoryPath: config.docsRepositoryPath,
      foundationUiRepositoryPath: config.foundationUiRepositoryPath
    });
  }

  /**
   * Searches for a string pattern in all files within the docs directory
   * @param searchPattern - The string pattern to search for
   * @returns Promise<Result<GrepResult[], FilesystemError>> - Search results or error
   */
  async grepDocs(searchPattern: string) {
    return this.repository.grepDocs(searchPattern);
  }

  /**
   * Reads a doc file with optional line count and offset parameters
   * @param relativePath - The file path relative to docsRepoPath/docs
   * @param options - Optional parameters for reading the file
   * @returns Promise<Result<DocFileContent, FilesystemError>> - File content or error
   */
  async readDocFile(relativePath: string, options?: ReadDocFileOptions) {
    return this.repository.readDocFile(relativePath, options);
  }
}

/**
 * Factory function to create a filesystem service
 *
 * @param config - Configuration options for the filesystem service
 * @returns FilesystemService - The filesystem service implementation
 */
export function createFilesystemService(config: FilesystemServiceConfig): FilesystemService {
  return new FilesystemServiceImpl(config);
}

// Export types for external use
export * from './types';
