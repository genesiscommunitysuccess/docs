import { FileEditingService, FileEditingServiceConfig } from './types';
import { FileEditingRepositoryService } from '../../repositories/file-editing/types';
import { createFileEditingRepository } from '../../repositories/file-editing';
import { CommitInfo } from '../../repositories/git/types';
import { Result } from '../../types/result';
import { FileUpdateResult, FileEditingError } from '../../repositories/file-editing/types';

/**
 * File Editing Service implementation
 * 
 * This service wraps the file editing repository and provides business logic
 * for file editing operations.
 */
export class FileEditingServiceImpl implements FileEditingService {
  private repository: FileEditingRepositoryService;

  constructor(config: FileEditingServiceConfig) {
    this.repository = createFileEditingRepository({
      useMock: config.useMock,
      docsRepositoryPath: config.docsRepositoryPath,
      foundationUiRepositoryPath: config.foundationUiRepositoryPath,
      createBackups: config.createBackups,
      backupDirectory: config.backupDirectory
    });
  }

  /**
   * Updates a documentation file with AI-generated content based on commit information
   * @param filePath - The file path relative to docsRepoPath/docs
   * @param commitInfo - Information about the commit that triggered the update
   * @param updateInstructions - Instructions for what content to generate
   * @returns Promise<Result<FileUpdateResult, FileEditingError>> - Update result or error
   */
  async updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): Promise<Result<FileUpdateResult, FileEditingError>> {
    // Delegate to the repository implementation
    return this.repository.updateDocFile(filePath, commitInfo, updateInstructions);
  }
}

/**
 * Factory function to create a file editing service
 * @param config - Configuration options for the file editing service
 * @returns FileEditingService - The configured file editing service
 */
export function createFileEditingService(config: FileEditingServiceConfig): FileEditingService {
  return new FileEditingServiceImpl(config);
}

// Export types for external use
export * from './types'; 