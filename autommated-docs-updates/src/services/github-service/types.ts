import { PullRequest, GitHubError } from '../../repositories/github/types';
import { Result } from '../../types/result';

/**
 * GitHub service configuration
 */
export interface GitHubServiceConfig {
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
 * GitHub service interface
 * 
 * This interface defines the contract for GitHub service operations.
 */
export interface GitHubService {
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