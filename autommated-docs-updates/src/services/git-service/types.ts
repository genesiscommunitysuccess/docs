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
   * @param repositoryType - The type of repository to analyze ('docs' | 'foundation-ui')
   * @returns Promise<Result<CommitInfo, GitError>> - Commit information and diffs or error
   */
  getCommitInfo(commitHash: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<CommitInfo, GitError>>;

  /**
   * Pulls the latest changes from the remote repository
   * @param repositoryType - The type of repository to pull from ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  pullLatest(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>>;
}

/**
 * Configuration options for git services
 */
export interface GitServiceConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
} 