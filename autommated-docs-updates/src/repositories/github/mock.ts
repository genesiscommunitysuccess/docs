import { GitHubRepository, GitHubRepositoryConfig, PullRequest, GitHubError } from './types';
import { Result } from '../../types/result';

/**
 * Mock implementation of the GitHub repository
 * 
 * This implementation provides predictable responses for testing and development.
 */
export class MockGitHubRepository implements GitHubRepository {
  private config: GitHubRepositoryConfig;
  private pullRequestCounter: number = 1;

  constructor(config: GitHubRepositoryConfig = {}) {
    this.config = config;
    console.log('🔧 Mock GitHub Repository initialized');
  }

  /**
   * Creates a mock pull request
   * @param title - The pull request title
   * @param body - The pull request body/description
   * @param headBranch - The source branch name
   * @param baseBranch - The target branch name
   * @param options - Additional options for the pull request
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with mock pull request data, or error with failure reason
   */
  async createPullRequest(
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string,
    options: {
      draft?: boolean;
      labels?: string[];
      assignees?: string[];
    } = {}
  ): Promise<Result<PullRequest, GitHubError>> {
    console.log(`🤖 Mock GitHub: Creating pull request "${title}" from ${headBranch} to ${baseBranch}`);

    // Simulate validation
    if (!title || !body || !headBranch || !baseBranch) {
      return Result.error({
        type: 'invalid_pull_request_data',
        message: 'Title, body, head branch, and base branch are required'
      });
    }

    // Simulate branch existence check
    if (headBranch === 'non-existent-branch') {
      return Result.error({
        type: 'branch_not_found',
        message: `Branch '${headBranch}' not found`
      });
    }

    // Create mock pull request - always create as draft for safety
    const pullRequest: PullRequest = {
      number: this.pullRequestCounter++,
      title,
      body,
      head: headBranch,
      base: baseBranch,
      url: `https://github.com/${this.config.owner || 'mock-owner'}/${this.config.repo || 'mock-repo'}/pull/${this.pullRequestCounter - 1}`,
      state: 'open',
      draft: true, // Always create as draft for safety
      labels: options.labels || ['documentation'],
      assignees: options.assignees || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log(`✅ Mock GitHub: Successfully created pull request #${pullRequest.number}`);
    return Result.success(pullRequest);
  }

  /**
   * Gets a mock pull request by number
   * @param pullRequestNumber - The pull request number
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with mock pull request data, or error with failure reason
   */
  async getPullRequest(pullRequestNumber: number): Promise<Result<PullRequest, GitHubError>> {
    console.log(`🤖 Mock GitHub: Getting pull request #${pullRequestNumber}`);

    // Simulate pull request not found
    if (pullRequestNumber <= 0 || pullRequestNumber > 1000) {
      return Result.error({
        type: 'repository_not_found',
        message: `Pull request #${pullRequestNumber} not found`
      });
    }

    // Create mock pull request
    const pullRequest: PullRequest = {
      number: pullRequestNumber,
      title: `Mock Pull Request #${pullRequestNumber}`,
      body: 'This is a mock pull request for testing purposes.',
      head: 'feature/mock-branch',
      base: 'main',
      url: `https://github.com/${this.config.owner || 'mock-owner'}/${this.config.repo || 'mock-repo'}/pull/${pullRequestNumber}`,
      state: 'open',
      draft: false,
      labels: ['documentation', 'mock'],
      assignees: ['mock-user'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log(`✅ Mock GitHub: Successfully retrieved pull request #${pullRequestNumber}`);
    return Result.success(pullRequest);
  }

  /**
   * Updates a mock pull request
   * @param pullRequestNumber - The pull request number
   * @param updates - The updates to apply
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with updated mock pull request data, or error with failure reason
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
    console.log(`🤖 Mock GitHub: Updating pull request #${pullRequestNumber}`);

    // Simulate pull request not found
    if (pullRequestNumber <= 0 || pullRequestNumber > 1000) {
      return Result.error({
        type: 'repository_not_found',
        message: `Pull request #${pullRequestNumber} not found`
      });
    }

    // Get existing pull request and apply updates
    const existingResult = await this.getPullRequest(pullRequestNumber);
    if (Result.isError(existingResult)) {
      return existingResult;
    }

    const updatedPullRequest: PullRequest = {
      ...existingResult.value,
      title: updates.title || existingResult.value.title,
      body: updates.body || existingResult.value.body,
      state: updates.state || existingResult.value.state,
      labels: updates.labels || existingResult.value.labels,
      assignees: updates.assignees || existingResult.value.assignees,
      updatedAt: new Date().toISOString()
    };

    console.log(`✅ Mock GitHub: Successfully updated pull request #${pullRequestNumber}`);
    return Result.success(updatedPullRequest);
  }

  /**
   * Checks if a mock branch exists
   * @param branchName - The branch name to check
   * @returns Promise<Result<boolean, GitHubError>> - Success with boolean indicating if branch exists, or error with failure reason
   */
  async branchExists(branchName: string): Promise<Result<boolean, GitHubError>> {
    console.log(`🤖 Mock GitHub: Checking if branch '${branchName}' exists`);

    // Simulate validation
    if (!branchName) {
      return Result.error({
        type: 'invalid_pull_request_data',
        message: 'Branch name is required'
      });
    }

    // Mock branch existence logic
    const exists = !branchName.includes('non-existent') && branchName.length > 0;
    
    console.log(`✅ Mock GitHub: Branch '${branchName}' ${exists ? 'exists' : 'does not exist'}`);
    return Result.success(exists);
  }

  /**
   * Validates the mock GitHub configuration
   * @returns Promise<Result<true, GitHubError>> - Success if configuration is valid, or error with failure reason
   */
  async validateConfiguration(): Promise<Result<true, GitHubError>> {
    console.log('🤖 Mock GitHub: Validating configuration');

    // Mock validation - always succeeds
    console.log('✅ Mock GitHub: Configuration validated successfully');
    return Result.success(true);
  }
} 