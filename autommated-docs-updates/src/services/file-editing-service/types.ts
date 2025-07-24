import { Result } from '../../types/result';
import { FileUpdateResult, FileEditingError } from '../../repositories/file-editing/types';
import { CommitInfo } from '../../repositories/git/types';

/**
 * File Editing Service interface for automated documentation updates
 * This service wraps the file editing repository service
 */
export interface FileEditingService {
  /**
   * Updates a documentation file with AI-generated content based on commit information
   * @param filePath - The file path relative to docsRepoPath/docs
   * @param commitInfo - Information about the commit that triggered the update
   * @param updateInstructions - Instructions for what content to generate
   * @returns Promise<Result<FileUpdateResult, FileEditingError>> - Update result or error
   */
  updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): Promise<Result<FileUpdateResult, FileEditingError>>;
}

/**
 * Configuration options for file editing services
 */
export interface FileEditingServiceConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
  /** Whether to create backups before editing */
  createBackups?: boolean;
  /** Backup directory path (relative to docs repository) */
  backupDirectory?: string;
} 