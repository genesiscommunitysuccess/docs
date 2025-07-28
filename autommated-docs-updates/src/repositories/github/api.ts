import { GitHubRepository, GitHubRepositoryConfig, PullRequest, GitHubError } from './types';
import { Result } from '../../types/result';
import { Octokit } from '@octokit/rest';

/**
 * Real GitHub repository implementation using Octokit
 * 
 * This implementation provides actual GitHub API integration for pull request operations.
 */
export class OctokitGitHubRepository implements GitHubRepository {
  private config: GitHubRepositoryConfig;
  private octokit: Octokit;

  constructor(config: GitHubRepositoryConfig = {}) {
    this.config = config;
    
    // Get configuration from environment or constructor
    const apiToken = config.apiToken || process.env.GITHUB_API_TOKEN || '';
    const owner = config.owner || process.env.GITHUB_OWNER || 'genesiscommunitysuccess';
    const repo = config.repo || process.env.GITHUB_REPO || 'docs';
    const baseUrl = config.baseUrl || process.env.GITHUB_API_BASE_URL;

    // Validate API token during initialization
    this.validateApiToken(apiToken);

    // Initialize Octokit client
    this.octokit = new Octokit({
      auth: apiToken,
      baseUrl,
      userAgent: 'automated-docs-updates/1.0.0'
    });

    // Update config with resolved values
    this.config = {
      ...this.config,
      apiToken,
      owner,
      repo
    };

    console.log(`🔧 Octokit GitHub Repository initialized for ${owner}/${repo}`);
  }

  /**
   * Validates that the GitHub API token is available
   * @throws Error if API token is not found
   */
  private validateApiToken(apiToken: string): void {
    if (!apiToken) {
      throw new Error('GITHUB_API_TOKEN environment variable is required for Octokit GitHub repository');
    }

    console.log('🔑 Validating GitHub API token...');
    console.log('✅ GitHub API token validated successfully');
  }

  /**
   * Creates a pull request using the GitHub API
   * @param title - The pull request title
   * @param body - The pull request body/description
   * @param headBranch - The source branch name
   * @param baseBranch - The target branch name
   * @param options - Additional options for the pull request
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with pull request data, or error with failure reason
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
    console.log(`🔧 GitHub API: Creating pull request "${title}" from ${headBranch} to ${baseBranch}`);

    try {
      // Validate required fields
      if (!title || !body || !headBranch || !baseBranch) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'Title, body, head branch, and base branch are required'
        });
      }

      // Check if head branch exists
      const branchExistsResult = await this.branchExists(headBranch);
      if (Result.isError(branchExistsResult)) {
        return branchExistsResult;
      }
      if (!branchExistsResult.value) {
        return Result.error({
          type: 'branch_not_found',
          message: `Branch '${headBranch}' not found`
        });
      }

      // Create pull request - always create as draft for safety
      const response = await this.octokit.pulls.create({
        owner: this.config.owner!,
        repo: this.config.repo!,
        title,
        body,
        head: headBranch,
        base: baseBranch,
        draft: true // Always create as draft for safety
      });

      const pullRequest = response.data;

      // Add labels if specified
      if (options.labels && options.labels.length > 0) {
        await this.octokit.issues.addLabels({
          owner: this.config.owner!,
          repo: this.config.repo!,
          issue_number: pullRequest.number,
          labels: options.labels
        });
      }

      // Add assignees if specified
      if (options.assignees && options.assignees.length > 0) {
        await this.octokit.issues.addAssignees({
          owner: this.config.owner!,
          repo: this.config.repo!,
          issue_number: pullRequest.number,
          assignees: options.assignees
        });
      }

      // Convert to our PullRequest interface
      const result: PullRequest = {
        number: pullRequest.number,
        title: pullRequest.title,
        body: pullRequest.body || '',
        head: pullRequest.head.ref,
        base: pullRequest.base.ref,
        url: pullRequest.html_url,
        state: pullRequest.state,
        draft: pullRequest.draft || false,
        labels: pullRequest.labels?.map((label: any) => label.name) || [],
        assignees: pullRequest.assignees?.map((assignee: any) => assignee.login) || [],
        createdAt: pullRequest.created_at,
        updatedAt: pullRequest.updated_at
      };

      console.log(`✅ GitHub API: Successfully created pull request #${result.number}`);
      return Result.success(result);

    } catch (error: any) {
      console.error('❌ GitHub API: Error creating pull request:', error);
      
      // Handle specific error types
      if (error.status === 401) {
        return Result.error({
          type: 'authentication_failed',
          message: 'GitHub authentication failed. Please check your API token.'
        });
      } else if (error.status === 404) {
        return Result.error({
          type: 'repository_not_found',
          message: `Repository ${this.config.owner}/${this.config.repo} not found or access denied`
        });
      } else if (error.status === 422) {
        return Result.error({
          type: 'pull_request_creation_failed',
          message: 'Pull request creation failed. The branch may not exist or there may be conflicts.'
        });
      } else if (error.status === 403 && error.message.includes('rate limit')) {
        return Result.error({
          type: 'api_rate_limit_exceeded',
          message: 'GitHub API rate limit exceeded. Please try again later.'
        });
      } else {
        return Result.error({
          type: 'unknown',
          message: `Unexpected error creating pull request: ${error.message}`
        });
      }
    }
  }

  /**
   * Gets a pull request by number using the GitHub API
   * @param pullRequestNumber - The pull request number
   * @returns Promise<Result<PullRequest, GitHubError>> - Success with pull request data, or error with failure reason
   */
  async getPullRequest(pullRequestNumber: number): Promise<Result<PullRequest, GitHubError>> {
    console.log(`🔧 GitHub API: Getting pull request #${pullRequestNumber}`);

    try {
      const response = await this.octokit.pulls.get({
        owner: this.config.owner!,
        repo: this.config.repo!,
        pull_number: pullRequestNumber
      });

      const pullRequest = response.data;

      // Convert to our PullRequest interface
      const result: PullRequest = {
        number: pullRequest.number,
        title: pullRequest.title,
        body: pullRequest.body || '',
        head: pullRequest.head.ref,
        base: pullRequest.base.ref,
        url: pullRequest.html_url,
        state: pullRequest.state,
        draft: pullRequest.draft || false,
        labels: pullRequest.labels?.map((label: any) => label.name) || [],
        assignees: pullRequest.assignees?.map((assignee: any) => assignee.login) || [],
        createdAt: pullRequest.created_at,
        updatedAt: pullRequest.updated_at
      };

      console.log(`✅ GitHub API: Successfully retrieved pull request #${result.number}`);
      return Result.success(result);

    } catch (error: any) {
      console.error('❌ GitHub API: Error getting pull request:', error);
      
      if (error.status === 404) {
        return Result.error({
          type: 'repository_not_found',
          message: `Pull request #${pullRequestNumber} not found`
        });
      } else if (error.status === 401) {
        return Result.error({
          type: 'authentication_failed',
          message: 'GitHub authentication failed. Please check your API token.'
        });
      } else {
        return Result.error({
          type: 'unknown',
          message: `Unexpected error getting pull request: ${error.message}`
        });
      }
    }
  }

  /**
   * Updates a pull request using the GitHub API
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
    console.log(`🔧 GitHub API: Updating pull request #${pullRequestNumber}`);

    try {
      // Update pull request fields
      if (updates.title || updates.body || updates.state) {
        await this.octokit.pulls.update({
          owner: this.config.owner!,
          repo: this.config.repo!,
          pull_number: pullRequestNumber,
          title: updates.title,
          body: updates.body,
          state: updates.state
        });
      }

      // Update labels if specified
      if (updates.labels) {
        await this.octokit.issues.setLabels({
          owner: this.config.owner!,
          repo: this.config.repo!,
          issue_number: pullRequestNumber,
          labels: updates.labels
        });
      }

      // Update assignees if specified
      if (updates.assignees) {
        await this.octokit.issues.addAssignees({
          owner: this.config.owner!,
          repo: this.config.repo!,
          issue_number: pullRequestNumber,
          assignees: updates.assignees
        });
      }

      // Get the updated pull request
      return await this.getPullRequest(pullRequestNumber);

    } catch (error: any) {
      console.error('❌ GitHub API: Error updating pull request:', error);
      
      if (error.status === 404) {
        return Result.error({
          type: 'repository_not_found',
          message: `Pull request #${pullRequestNumber} not found`
        });
      } else if (error.status === 401) {
        return Result.error({
          type: 'authentication_failed',
          message: 'GitHub authentication failed. Please check your API token.'
        });
      } else {
        return Result.error({
          type: 'unknown',
          message: `Unexpected error updating pull request: ${error.message}`
        });
      }
    }
  }

  /**
   * Checks if a branch exists using the GitHub API
   * @param branchName - The branch name to check
   * @returns Promise<Result<boolean, GitHubError>> - Success with boolean indicating if branch exists, or error with failure reason
   */
  async branchExists(branchName: string): Promise<Result<boolean, GitHubError>> {
    console.log(`🔧 GitHub API: Checking if branch '${branchName}' exists`);

    try {
      // Validate branch name
      if (!branchName) {
        return Result.error({
          type: 'invalid_pull_request_data',
          message: 'Branch name is required'
        });
      }

      await this.octokit.repos.getBranch({
        owner: this.config.owner!,
        repo: this.config.repo!,
        branch: branchName
      });

      console.log(`✅ GitHub API: Branch '${branchName}' exists`);
      return Result.success(true);

    } catch (error: any) {
      if (error.status === 404) {
        console.log(`✅ GitHub API: Branch '${branchName}' does not exist`);
        return Result.success(false);
      } else if (error.status === 401) {
        return Result.error({
          type: 'authentication_failed',
          message: 'GitHub authentication failed. Please check your API token.'
        });
      } else {
        return Result.error({
          type: 'unknown',
          message: `Unexpected error checking branch existence: ${error.message}`
        });
      }
    }
  }

  /**
   * Validates the GitHub configuration by testing API access
   * @returns Promise<Result<true, GitHubError>> - Success if configuration is valid, or error with failure reason
   */
  async validateConfiguration(): Promise<Result<true, GitHubError>> {
    console.log('🔧 GitHub API: Validating configuration');

    try {
      // Test API access by getting repository information
      await this.octokit.repos.get({
        owner: this.config.owner!,
        repo: this.config.repo!
      });

      console.log('✅ GitHub API: Configuration validated successfully');
      return Result.success(true);

    } catch (error: any) {
      console.error('❌ GitHub API: Configuration validation failed:', error);
      
      if (error.status === 401) {
        return Result.error({
          type: 'authentication_failed',
          message: 'GitHub authentication failed. Please check your API token.'
        });
      } else if (error.status === 404) {
        return Result.error({
          type: 'repository_not_found',
          message: `Repository ${this.config.owner}/${this.config.repo} not found or access denied`
        });
      } else {
        return Result.error({
          type: 'unknown',
          message: `Configuration validation failed: ${error.message}`
        });
      }
    }
  }
} 