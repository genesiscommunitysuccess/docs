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
    // Use repository paths directly from config (always provided from args.ts)
    const docsRepoPath = config.docsRepositoryPath;
    const foundationUiRepoPath = config.foundationUiRepositoryPath;

    console.log(`🔧 Git Service: Using docs repository path: ${docsRepoPath}`);
    console.log(`🔧 Git Service: Using foundation-ui repository path: ${foundationUiRepoPath}`);

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

  /**
   * Gets the current branch name for the specified repository
   * @param repositoryType - The type of repository to get the current branch for ('docs' | 'foundation-ui')
   * @returns Promise<Result<string, GitError>> - Current branch name or error
   */
  async getCurrentBranch(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<string, GitError>> {
    console.log(`🌿 Getting current branch for ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.getCurrentBranch(repoType);
  }

  /**
   * Creates a new branch from the specified base branch
   * @param branchName - Name of the new branch to create
   * @param baseBranch - Name of the base branch to create from (defaults to primary branch)
   * @param repositoryType - The type of repository to create the branch in ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async createBranch(branchName: string, baseBranch: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>> {
    console.log(`🌿 Creating branch '${branchName}' from '${baseBranch}' in ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.createBranch(branchName, baseBranch, repoType);
  }

  /**
   * Checks if a branch exists in the specified repository
   * @param branchName - Name of the branch to check
   * @param repositoryType - The type of repository to check ('docs' | 'foundation-ui')
   * @returns Promise<Result<boolean, GitError>> - True if branch exists, false if not, error if failed
   */
  async branchExists(branchName: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<boolean, GitError>> {
    console.log(`🔍 Checking if branch '${branchName}' exists in ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.branchExists(branchName, repoType);
  }

  /**
   * Removes backup files from the staging area
   * @param repositoryType - The type of repository to clean up ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async removeBackupFilesFromStaging(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>> {
    console.log(`🗑️ Removing backup files from staging area in ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.removeBackupFilesFromStaging(repoType);
  }

  /**
   * Stages all changes for commit
   * @param repositoryType - The type of repository to stage changes in ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async stageAllChanges(repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>> {
    console.log(`📦 Staging all changes in ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.stageAllChanges(repoType);
  }

  /**
   * Commits all staged changes with a commit message
   * @param message - Commit message
   * @param repositoryType - The type of repository to commit in ('docs' | 'foundation-ui')
   * @returns Promise<Result<string, GitError>> - Commit hash if successful, error if failed
   */
  async commitChanges(message: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<string, GitError>> {
    console.log(`💾 Committing changes in ${repositoryType} repository with message: "${message}"...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.commitChanges(message, repoType);
  }

  /**
   * Pushes the current branch to the remote repository
   * @param branchName - Name of the branch to push
   * @param repositoryType - The type of repository to push from ('docs' | 'foundation-ui')
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async pushBranch(branchName: string, repositoryType: 'docs' | 'foundation-ui'): Promise<Result<true, GitError>> {
    console.log(`🚀 Pushing branch '${branchName}' to remote in ${repositoryType} repository...`);
    
    // Map our repository type to the underlying repository service type
    const repoType = repositoryType === 'docs' 
      ? RepositoryType.DOCS 
      : RepositoryType.FOUNDATION_UI;

    // Delegate to the underlying git repository service
    return this.gitRepositoryService.pushBranch(branchName, repoType);
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