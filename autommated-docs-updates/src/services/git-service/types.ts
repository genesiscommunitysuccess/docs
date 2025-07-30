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

  /**
   * Gets the current branch name for the specified repository
   * @param repositoryType - The type of repository to get the current branch for ('docs' | 'foundation-ui')
   * @returns Promise<Result<string, GitError>> - Current branch name or error
   */
  getCurrentBranch(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<string, GitError>>;

  /**
   * Creates a new branch from the specified base branch
   * @param branchName - Name of the new branch to create
   * @param baseBranch - Name of the base branch to create from (defaults to primary branch)
   * @param repositoryType - The type of repository to create the branch in ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  createBranch(branchName: string, baseBranch: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>>;

  /**
   * Checks if a branch exists in the specified repository
   * @param branchName - Name of the branch to check
   * @param repositoryType - The type of repository to check ('docs' | 'foundation-ui')
   * @returns Promise<Result<boolean, GitError>> - True if branch exists, false if not, error if failed
   */
  branchExists(branchName: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<boolean, GitError>>;

  /**
   * Commits all staged changes with a commit message
   * @param message - Commit message
   * @param repositoryType - The type of repository to commit in ('docs' | 'foundation-ui')
   * @returns Promise<Result<string, GitError>> - Commit hash if successful, error if failed
   */
  commitChanges(message: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<string, GitError>>;

  /**
   * Removes backup files from the staging area
   * @param repositoryType - The type of repository to clean up ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  removeBackupFilesFromStaging(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>>;

  /**
   * Stages all changes for commit
   * @param repositoryType - The type of repository to stage changes in ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  stageAllChanges(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>>;

  /**
   * Pushes the current branch to the remote repository
   * @param branchName - Name of the branch to push
   * @param repositoryType - The type of repository to push from ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  pushBranch(branchName: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>>;
}

/**
 * Configuration options for git services
 */
export interface GitServiceConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
} 