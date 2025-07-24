import { Result } from '../../types/result';
import { CommitInfo, GitError } from '../../repositories/git/types';

/**
 * Git Service interface for automated documentation updates
 * This service wraps the git repository service
 */
export interface GitService {
  /**
   * Gets commit information and diffs for a specific commit hash
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<Result<CommitInfo, GitError>> - Commit information and diffs or error
   */
  getCommitInfo(commitHash: string): Promise<Result<CommitInfo, GitError>>;
}

/**
 * Configuration options for git services
 */
export interface GitServiceConfig {
  /** Which repository to use */
  repositoryType: 'docs' | 'foundation-ui';
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
} 