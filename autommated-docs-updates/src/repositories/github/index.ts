import { GitHubRepository, GitHubRepositoryConfig } from './types';
import { MockGitHubRepository } from './mock';
import { OctokitGitHubRepository } from './api';

/**
 * Factory function to create a GitHub repository
 * @param config - Configuration for the GitHub repository
 * @returns GitHubRepository - The configured GitHub repository
 */
export function createGitHubRepository(config: GitHubRepositoryConfig): GitHubRepository {
  if (config.useMock) {
    console.log('🔧 Using mock GitHub repository');
    return new MockGitHubRepository(config);
  } else {
    console.log('🔧 Using Octokit GitHub repository');
    return new OctokitGitHubRepository(config);
  }
}

// Export types for convenience
export type { GitHubRepository, GitHubRepositoryConfig } from './types';
export type { PullRequest, GitHubError } from './types'; 