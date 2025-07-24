import { GitService, GitServiceConfig } from './types';
import { createGitRepositoryService } from '../../repositories/git';
import { RepositoryType, GitRepositoryService } from '../../repositories/git/types';
import { Result } from '../../types/result';
import { CommitInfo, GitError } from '../../repositories/git/types';

/**
 * Git Service implementation
 * 
 * This service wraps the git repository service and can work with any repository type.
 */
export class RealGitService implements GitService {
  private gitRepositoryService: GitRepositoryService;

  constructor(config: GitServiceConfig) {
    // Get repository paths from environment or use defaults
    const docsRepoPath = process.env.DOCS_REPOSITORY_PATH || '/Users/matt.walker/genesis/docs';
    const foundationUiRepoPath = process.env.FOUNDATION_UI_REPOSITORY_PATH || '/Users/matt.walker/genesis/foundation-ui';

    // Create the underlying git repository service
    this.gitRepositoryService = createGitRepositoryService({
      docsRepositoryPath: docsRepoPath,
      foundationUiRepositoryPath: foundationUiRepoPath,
      useMock: config.useMock
    });

    console.log(`🔧 Git Service initialized - can work with both docs and foundation-ui repositories`);
  }

  /**
   * Gets commit information and diffs for a specific commit hash
   * @param commitHash - The git commit hash to analyze
   * @param repositoryType - The type of repository to analyze ('docs' | 'foundation-ui')
   * @returns Promise<Result<CommitInfo, GitError>> - Commit information and diffs or error
   */
  async getCommitInfo(commitHash: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<CommitInfo, GitError>> {
    console.log(`📁 Using ${repositoryType} repository for commit analysis`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.getCommitInfo(commitHash, repoType);
  }

  /**
   * Pulls the latest changes from the remote repository
   * @param repositoryType - The type of repository to pull from ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async pullLatest(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>> {
    console.log(`📥 Pulling latest changes from ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.pullLatest(repoType);
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