import { GitService, GitServiceConfig } from './types';
import { createGitRepositoryService } from '../../repositories/git';
import { RepositoryType, GitRepositoryService } from '../../repositories/git/types';
import { Result } from '../../types/result';
import { CommitInfo, GitError } from '../../repositories/git/types';

/**
 * Git Service implementation
 * 
 * This service wraps the git repository service and uses the specified repository.
 */
export class RealGitService implements GitService {
  private gitRepositoryService: GitRepositoryService;
  private repositoryType: 'docs' | 'foundation-ui';

  constructor(config: GitServiceConfig) {
    this.repositoryType = config.repositoryType;

    // Get repository paths from environment or use defaults
    const docsRepoPath = process.env.DOCS_REPOSITORY_PATH || '/Users/matt.walker/genesis/docs';
    const foundationUiRepoPath = process.env.FOUNDATION_UI_REPOSITORY_PATH || '/Users/matt.walker/genesis/foundation-ui';

    // Create the underlying git repository service
    this.gitRepositoryService = createGitRepositoryService({
      docsRepositoryPath: docsRepoPath,
      foundationUiRepositoryPath: foundationUiRepoPath,
      useMock: config.useMock
    });

    console.log(`🔧 Git Service initialized with repository type: ${this.repositoryType}`);
  }

  /**
   * Gets commit information and diffs for a specific commit hash
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<Result<CommitInfo, GitError>> - Commit information and diffs or error
   */
  async getCommitInfo(commitHash: string): Promise<Result<CommitInfo, GitError>> {
    // Map our repository type to the underlying repository service type
    const repoType = this.repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.getCommitInfo(commitHash, repoType);
  }
}

/**
 * Factory function to create a git service
 * @param config - Configuration for the git service
 * @returns GitService - The configured git service
 */
export function createGitService(config: GitServiceConfig): GitService {
  return new RealGitService(config);
} 