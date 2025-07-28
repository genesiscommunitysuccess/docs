import { Result } from '../../types/result';

/**
 * Pull Request information
 */
export interface PullRequest {
  /** The pull request number */
  number: number;
  /** The pull request title */
  title: string;
  /** The pull request body/description */
  body: string;
  /** The head branch (source branch) */
  head: string;
  /** The base branch (target branch) */
  base: string;
  /** The pull request URL */
  url: string;
  /** The pull request state (open, closed, merged) */
  state: string;
  /** Whether the pull request is a draft */
  draft: boolean;
  /** The pull request labels */
  labels: string[];
  /** The pull request assignees */
  assignees: string[];
  /** The pull request creation date */
  createdAt: string;
  /** The pull request update date */
  updatedAt: string;
}

/**
 * GitHub repository configuration
 */
export interface GitHubRepositoryConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** GitHub API token for authentication */
  apiToken?: string;
  /** GitHub organization/owner name */
  owner?: string;
  /** GitHub repository name */
  repo?: string;
  /** GitHub API base URL (for GitHub Enterprise) */
  baseUrl?: string;
}

/**
 * GitHub repository error types
 */
export type GitHubError = 
  | { type: 'invalid_token'; message: string }
  | { type: 'repository_not_found'; message: string }
  | { type: 'branch_not_found'; message: string }
  | { type: 'pull_request_creation_failed'; message: string }
  | { type: 'api_rate_limit_exceeded'; message: string }
  | { type: 'invalid_pull_request_data'; message: string }
  | { type: 'authentication_failed'; message: string }
  | { type: 'unknown'; message: string };

/**
 * GitHub repository interface
 * 
 * This interface defines the contract for GitHub repository operations.
 */
export interface GitHubRepository {
  /**
   * Creates a pull request
   * @param title - The pull request title
   * @param body - The pull request body/description
   * @param headBranch - The source branch name
   * @param baseBranch - The target branch name
   * @param options - Additional options for the pull request (draft is always true for safety)
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with pull request data, or error with failure reason
   */
  createPullRequest(
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string,
    options?: {
      draft?: boolean; // Ignored - always creates as draft for safety
      labels?: string[];
      assignees?: string[];
    }
  ): Promise<Result<PullRequest, GitHubError>>;

  /**
   * Gets a pull request by number
   * @param pullRequestNumber - The pull request number
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with pull request data, or error with failure reason
   */
  getPullRequest(pullRequestNumber: number): Promise<Result<PullRequest, GitHubError>>;

  /**
   * Updates a pull request
   * @param pullRequestNumber - The pull request number
   * @param updates - The updates to apply
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with updated pull request data, or error with failure reason
   */
  updatePullRequest(
    pullRequestNumber: number,
    updates: {
      title?: string;
      body?: string;
      state?: 'open' | 'closed';
      labels?: string[];
      assignees?: string[];
    }
  ): Promise<Result<PullRequest, GitHubError>>;

  /**
   * Checks if a branch exists
   * @param branchName - The branch name to check
   * @returns Promise<Result<boolean, GitHubError>> - Success with boolean indicating if branch exists, or error with failure reason
   */
  branchExists(branchName: string): Promise<Result<boolean, GitHubError>>;

  /**
   * Validates the GitHub configuration
   * @returns Promise<Result<true, GitHubError>> - Success if configuration is valid, or error with failure reason
   */
  validateConfiguration(): Promise<Result<true, GitHubError>>;
} 