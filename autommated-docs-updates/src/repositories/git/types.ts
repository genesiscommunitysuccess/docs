import { Result } from '../../types/result';

/**
 * Git Repository Service interface for automated documentation updates
 */
export interface GitRepositoryService {
  /**
   * Gets commit information and diffs for a specific commit hash
   * @param commitHash - The git commit hash to analyze
   * @param repositoryType - Which repository to query (docs or foundation-ui)
   * @returns Promise<Result<CommitInfo, GitError>> - Commit information and diffs or error
   */
  getCommitInfo(commitHash: string, repositoryType: RepositoryType): Promise<Result<CommitInfo, GitError>>;

  /**
   * Pulls the latest changes from the remote repository
   * @param repositoryType - Which repository to pull from (docs or foundation-ui)
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  pullLatest(repositoryType: RepositoryType): Promise<Result<true, GitError>>;

  /**
   * Gets the current branch name for the specified repository
   * @param repositoryType - Which repository to get the current branch for
   * @returns Promise<Result<string, GitError>> - Current branch name or error
   */
  getCurrentBranch(repositoryType: RepositoryType): Promise<Result<string, GitError>>;

  /**
   * Creates a new branch from the specified base branch
   * @param branchName - Name of the new branch to create
   * @param baseBranch - Name of the base branch to create from (defaults to primary branch)
   * @param repositoryType - Which repository to create the branch in
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  createBranch(branchName: string, baseBranch: string, repositoryType: RepositoryType): Promise<Result<true, GitError>>;

  /**
   * Checks if a branch exists in the specified repository
   * @param branchName - Name of the branch to check
   * @param repositoryType - Which repository to check
   * @returns Promise<Result<boolean, GitError>> - True if branch exists, false if not, error if failed
   */
  branchExists(branchName: string, repositoryType: RepositoryType): Promise<Result<boolean, GitError>>;

  /**
   * Commits all staged changes with a commit message
   * @param message - Commit message
   * @param repositoryType - Which repository to commit in
   * @returns Promise<Result<string, GitError>> - Commit hash if successful, error if failed
   */
  commitChanges(message: string, repositoryType: RepositoryType): Promise<Result<string, GitError>>;

  /**
   * Removes backup files from the staging area
   * @param repositoryType - Which repository to clean up
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  removeBackupFilesFromStaging(repositoryType: RepositoryType): Promise<Result<true, GitError>>;

  /**
   * Stages all changes for commit
   * @param repositoryType - Which repository to stage changes in
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  stageAllChanges(repositoryType: RepositoryType): Promise<Result<true, GitError>>;

  /**
   * Pushes the current branch to the remote repository
   * @param branchName - Name of the branch to push
   * @param repositoryType - Which repository to push from
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  pushBranch(branchName: string, repositoryType: RepositoryType): Promise<Result<true, GitError>>;
}

/**
 * Repository types that can be queried
 */
export enum RepositoryType {
  DOCS = 'docs',
  FOUNDATION_UI = 'foundation-ui'
}

/**
 * Git-specific error types
 */
export interface GitError {
  /** Type of git error */
  type: 'invalid_commit_hash' | 'repository_not_found' | 'git_command_failed' | 'repository_not_git' | 'branch_already_exists' | 'branch_not_found' | 'invalid_branch_name' | 'unknown';
  /** Human-readable error message */
  message: string;
  /** Original error details if available */
  details?: string;
  /** Repository type where the error occurred */
  repositoryType: RepositoryType;
  /** Commit hash that caused the error */
  commitHash?: string;
  /** Branch name that caused the error */
  branchName?: string;
}

/**
 * Commit information and diffs
 */
export interface CommitInfo {
  /** The commit hash */
  hash: string;
  /** Commit author name */
  author: string;
  /** Commit author email */
  authorEmail: string;
  /** Commit date */
  date: Date;
  /** Commit message */
  message: string;
  /** List of files changed in the commit */
  filesChanged: string[];
  /** Diffs for each changed file */
  diffs: FileDiff[];
  /** Which repository this commit info came from */
  repositoryType: RepositoryType;
}

/**
 * File diff information
 */
export interface FileDiff {
  /** File path */
  filePath: string;
  /** Type of change (added, modified, deleted) */
  changeType: 'added' | 'modified' | 'deleted';
  /** The actual diff content */
  diff: string;
  /** Number of lines added */
  linesAdded: number;
  /** Number of lines deleted */
  linesDeleted: number;
}

/**
 * Configuration options for git repository services
 */
export interface GitRepositoryConfig {
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
} 