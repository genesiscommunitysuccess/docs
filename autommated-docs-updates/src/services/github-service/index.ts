import { GitHubService, GitHubServiceConfig } from './types';
import { createGitHubRepository, GitHubRepository } from '../../repositories/github';
import { Result } from '../../types/result';
import { PullRequest, GitHubError } from '../../repositories/github/types';

/**
 * GitHub Service implementation
 * 
 * This service wraps the GitHub repository and provides business logic
 * for GitHub operations like pull request creation and management.
 */
export class RealGitHubService implements GitHubService {
  private githubRepository: GitHubRepository;

  constructor(config: GitHubServiceConfig) {
    // Create the underlying GitHub repository
    this.githubRepository = createGitHubRepository({
      useMock: config.useMock,
      apiToken: config.apiToken,
      owner: config.owner,
      repo: config.repo,
      baseUrl: config.baseUrl
    });

    console.log(`🔧 GitHub Service initialized`);
  }

  /**
   * Creates a pull request
   * @param title - The pull request title
   * @param body - The pull request body/description
   * @param headBranch - The source branch name
   * @param baseBranch - The target branch name
   * @param options - Additional options for the pull request (draft is always true for safety)
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with pull request data, or error with failure reason
   */
  async createPullRequest(
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string,
    options: {
      draft?: boolean; // Ignored - always creates as draft for safety
      labels?: string[];
      assignees?: string[];
    } = {}
  ): Promise<Result<PullRequest, GitHubError>> {
    try {
      console.log(`🔧 GitHub Service: Creating pull request "${title}"`);

      // Validate required fields
      if (!title || !body || !headBranch || !baseBranch) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'Title, body, head branch, and base branch are required'
        });
      }

      // Delegate to the repository
      const result = await this.githubRepository.createPullRequest(
        title,
        body,
        headBranch,
        baseBranch,
        options
      );

      if (Result.isSuccess(result)) {
        console.log(`✅ GitHub Service: Successfully created pull request #${result.value.number}`);
      } else {
        console.error(`❌ GitHub Service: Failed to create pull request: ${result.message.message}`);
      }

      return result;

    } catch (error) {
      console.error('❌ GitHub Service: Unexpected error creating pull request:', error);
      return Result.error({
        type: 'unknown',
        message: `Unexpected error creating pull request: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  /**
   * Gets a pull request by number
   * @param pullRequestNumber - The pull request number
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with pull request data, or error with failure reason
   */
  async getPullRequest(pullRequestNumber: number): Promise<Result<PullRequest, GitHubError>> {
    try {
      console.log(`🔧 GitHub Service: Getting pull request #${pullRequestNumber}`);

      // Validate pull request number
      if (!pullRequestNumber || pullRequestNumber <= 0) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'Valid pull request number is required'
        });
      }

      // Delegate to the repository
      const result = await this.githubRepository.getPullRequest(pullRequestNumber);

      if (Result.isSuccess(result)) {
        console.log(`✅ GitHub Service: Successfully retrieved pull request #${result.value.number}`);
      } else {
        console.error(`❌ GitHub Service: Failed to get pull request: ${result.message.message}`);
      }

      return result;

    } catch (error) {
      console.error('❌ GitHub Service: Unexpected error getting pull request:', error);
      return Result.error({
        type: 'unknown',
        message: `Unexpected error getting pull request: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  /**
   * Updates a pull request
   * @param pullRequestNumber - The pull request number
   * @param updates - The updates to apply
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with updated pull request data, or error with failure reason
   */
  async updatePullRequest(
    pullRequestNumber: number,
    updates: {
      title?: string;
      body?: string;
      state?: 'open' | 'closed';
      labels?: string[];
      assignees?: string[];
    }
  ): Promise<Result<PullRequest, GitHubError>> {
    try {
      console.log(`🔧 GitHub Service: Updating pull request #${pullRequestNumber}`);

      // Validate pull request number
      if (!pullRequestNumber || pullRequestNumber <= 0) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'Valid pull request number is required'
        });
      }

      // Validate that at least one update is provided
      if (!updates.title && !updates.body && !updates.state && !updates.labels && !updates.assignees) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'At least one update field is required'
        });
      }

      // Delegate to the repository
      const result = await this.githubRepository.updatePullRequest(pullRequestNumber, updates);

      if (Result.isSuccess(result)) {
        console.log(`✅ GitHub Service: Successfully updated pull request #${result.value.number}`);
      } else {
        console.error(`❌ GitHub Service: Failed to update pull request: ${result.message.message}`);
      }

      return result;

    } catch (error) {
      console.error('❌ GitHub Service: Unexpected error updating pull request:', error);
      return Result.error({
        type: 'unknown',
        message: `Unexpected error updating pull request: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  /**
   * Checks if a branch exists
   * @param branchName - The branch name to check
   * @returns Promise<Result<boolean, GitHubError>> - Success with boolean indicating if branch exists, or error with failure reason
   */
  async branchExists(branchName: string): Promise<Result<boolean, GitHubError>> {
    try {
      console.log(`🔧 GitHub Service: Checking if branch '${branchName}' exists`);

      // Validate branch name
      if (!branchName) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'Branch name is required'
        });
      }

      // Delegate to the repository
      const result = await this.githubRepository.branchExists(branchName);

      if (Result.isSuccess(result)) {
        console.log(`✅ GitHub Service: Branch '${branchName}' ${result.value ? 'exists' : 'does not exist'}`);
      } else {
        console.error(`❌ GitHub Service: Failed to check branch existence: ${result.message.message}`);
      }

      return result;

    } catch (error) {
      console.error('❌ GitHub Service: Unexpected error checking branch existence:', error);
      return Result.error({
        type: 'unknown',
        message: `Unexpected error checking branch existence: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  /**
   * Validates the GitHub configuration
   * @returns Promise<Result<true, GitHubError>> - Success if configuration is valid, or error with failure reason
   */
  async validateConfiguration(): Promise<Result<true, GitHubError>> {
    try {
      console.log('🔧 GitHub Service: Validating configuration');

      // Delegate to the repository
      const result = await this.githubRepository.validateConfiguration();

      if (Result.isSuccess(result)) {
        console.log('✅ GitHub Service: Configuration validated successfully');
      } else {
        console.error(`❌ GitHub Service: Configuration validation failed: ${result.message.message}`);
      }

      return result;

    } catch (error) {
      console.error('❌ GitHub Service: Unexpected error validating configuration:', error);
      return Result.error({
        type: 'unknown',
        message: `Unexpected error validating configuration: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
}

/**
 * Factory function to create a GitHub service
 * @param config - Configuration for the GitHub service
 * @returns GitHubService - The configured GitHub service
 */
export function createGitHubService(config: GitHubServiceConfig): GitHubService {
  return new RealGitHubService(config);
}

// Export types for convenience
export type { GitHubService, GitHubServiceConfig } from './types'; 