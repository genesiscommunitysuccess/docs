import { Result } from '../../types/result';
import { FileEditingService, FileEditingServiceConfig } from './types';
import { FileUpdateResult, FileEditingError } from '../../repositories/file-editing/types';
import { CommitInfo } from '../../repositories/git/types';
import { GitService } from '../git-service/types';
import { RealFileEditingRepositoryService } from '../../repositories/file-editing/repository';
import { MockFileEditingRepositoryService } from '../../repositories/file-editing/mock';

/**
 * Real implementation of FileEditingService
 */
export class RealFileEditingService implements FileEditingService {
  private fileEditingRepositoryService: RealFileEditingRepositoryService | MockFileEditingRepositoryService;

  constructor(config: FileEditingServiceConfig) {
    // Choose implementation based on config
    if (config.useMock) {
      this.fileEditingRepositoryService = new MockFileEditingRepositoryService({
        docsRepositoryPath: config.docsRepositoryPath,
        foundationUiRepositoryPath: config.foundationUiRepositoryPath,
        createBackups: config.createBackups,
        backupDirectory: config.backupDirectory
      });
    } else {
      this.fileEditingRepositoryService = new RealFileEditingRepositoryService({
        docsRepositoryPath: config.docsRepositoryPath,
        foundationUiRepositoryPath: config.foundationUiRepositoryPath,
        createBackups: config.createBackups,
        backupDirectory: config.backupDirectory
      });
    }
  }

  /**
   * Updates a documentation file with AI-generated content based on commit information
   * @param filePath - The file path relative to docsRepoPath/docs
   * @param commitInfo - Information about the commit that triggered the update
   * @param updateInstructions - Instructions for what content to generate
   * @param gitService - Git service to use for branch checking and repository operations
   * @returns Promise<Result<FileUpdateResult, FileEditingError>> - Update result or error
   */
  async updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string,
    gitService: GitService
  ): Promise<Result<FileUpdateResult, FileEditingError>> {
    console.log(`📝 File Editing Service: Updating ${filePath}...`);
    
    // Get the underlying git repository service from the git service
    // We need to access the repository service to pass to the file editing repository
    const gitRepositoryService = (gitService as any).gitRepositoryService;
    
    // Delegate to the underlying file editing repository service
    return this.fileEditingRepositoryService.updateDocFile(
      filePath, 
      commitInfo, 
      updateInstructions,
      gitRepositoryService
    );
  }
}

/**
 * Factory function to create a file editing service
 * @param config - Configuration options for the file editing service
 * @returns FileEditingService - The configured file editing service
 */
export function createFileEditingService(config: FileEditingServiceConfig): FileEditingService {
  return new RealFileEditingService(config);
}

// Export types for external use
export * from './types'; 