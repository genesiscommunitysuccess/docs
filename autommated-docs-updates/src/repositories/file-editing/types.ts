import { Result } from '../../types/result';
import { CommitInfo, GitRepositoryService } from '../git/types';

/**
 * File Editing Repository Service interface for automated documentation updates
 */
export interface FileEditingRepositoryService {
  /**
   * Updates a documentation file with AI-generated content based on commit information
   * @param filePath - The file path relative to docsRepoPath/docs
   * @param commitInfo - Information about the commit that triggered the update
   * @param updateInstructions - Instructions for what content to generate
   * @param gitRepositoryService - Git repository service to use for branch checking
   * @returns Promise<Result<FileUpdateResult, FileEditingError>> - Update result or error
   */
  updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string,
    gitRepositoryService: GitRepositoryService
  ): Promise<Result<FileUpdateResult, FileEditingError>>;
}

/**
 * File editing-specific error types
 */
export interface FileEditingError {
  /** Type of file editing error */
  type: 'file_not_in_docs_directory' | 'preprod_branch_active' | 'file_not_found' | 'file_read_error' | 'file_write_error' | 'backup_failed' | 'invalid_file_path' | 'unknown';
  /** Human-readable error message */
  message: string;
  /** Original error details if available */
  details?: string;
  /** File path where the error occurred */
  filePath?: string;
  /** Current branch when the error occurred */
  currentBranch?: string;
}

/**
 * Result of a file update operation
 */
export interface FileUpdateResult {
  /** The file path that was updated */
  filePath: string;
  /** The full file path */
  fullPath: string;
  /** Original content before the update */
  originalContent: string;
  /** New content after the update */
  newContent: string;
  /** Backup file path if backup was created */
  backupPath?: string;
  /** Number of lines changed */
  linesChanged: number;
  /** Timestamp of the update */
  timestamp: Date;
}

/**
 * Configuration options for file editing repository services
 */
export interface FileEditingRepositoryConfig {
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** Whether to create backups before editing */
  createBackups?: boolean;
  /** Backup directory path (relative to docs repository) */
  backupDirectory?: string;
} 