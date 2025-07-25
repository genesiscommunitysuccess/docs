import { GitRepositoryService, CommitInfo, FileDiff, RepositoryType, GitError } from './types';
import { Result } from '../../types/result';

/**
 * Mock implementation of the git repository service for testing
 * 
 * This service provides predictable responses for testing scenarios:
 * - Returns mock commit information based on commit hash patterns
 * - Simulates different types of file changes
 * - Supports both docs and foundation-ui repositories
 * - Simulates various error conditions
 */
export class MockGitRepositoryService implements GitRepositoryService {
  private docsRepositoryPath: string;
  private foundationUiRepositoryPath: string;

  constructor(docsRepositoryPath: string, foundationUiRepositoryPath: string) {
    this.docsRepositoryPath = docsRepositoryPath;
    this.foundationUiRepositoryPath = foundationUiRepositoryPath;
  }

  /**
   * Mock implementation that simulates git commit analysis
   * @param commitHash - The git commit hash to analyze
   * @param repositoryType - Which repository to query
   * @returns Promise<Result<CommitInfo, GitError>> - Mock commit information and diffs or error
   */
  async getCommitInfo(commitHash: string, repositoryType: RepositoryType): Promise<Result<CommitInfo, GitError>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate invalid commit hash error
    if (commitHash === 'invalid' || commitHash.length < 7) {
      return Result.error({
        type: 'invalid_commit_hash',
        message: `Invalid commit hash: ${commitHash}. Commit hashes must be at least 7 characters long.`,
        repositoryType,
        commitHash
      });
    }
    
    // Simulate repository not found error
    if (commitHash === 'repo_not_found') {
      return Result.error({
        type: 'repository_not_found',
        message: `Repository not found for ${repositoryType}`,
        repositoryType,
        commitHash
      });
    }
    
    // Mock logic based on commit hash patterns and repository type
    if (repositoryType === RepositoryType.DOCS) {
      return Result.success(this.createMockDocsCommit(commitHash));
    } else if (repositoryType === RepositoryType.FOUNDATION_UI) {
      return Result.success(this.createMockFoundationUiCommit(commitHash));
    }
    
    // Fallback to generic commit
    return Result.success(this.createMockGenericCommit(commitHash, repositoryType));
  }

  /**
   * Mock implementation that simulates git pull
   * @param repositoryType - Which repository to pull from
   * @returns Promise<Result<true, GitError>> - Mock pull result
   */
  async pullLatest(repositoryType: RepositoryType): Promise<Result<true, GitError>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate network error
    if (repositoryType === RepositoryType.DOCS && Math.random() < 0.1) {
      return Result.error({
        type: 'git_command_failed',
        message: `Failed to pull latest changes from ${repositoryType} repository`,
        repositoryType,
        details: 'Network timeout'
      });
    }
    
    // Simulate successful pull
    console.log(`📥 Mock git pull successful for ${repositoryType} repository`);
    return Result.success(true);
  }

  /**
   * Mock implementation that simulates getting the current branch
   * @param repositoryType - Which repository to get the current branch for
   * @returns Promise<Result<string, GitError>> - Mock current branch name
   */
  async getCurrentBranch(repositoryType: RepositoryType): Promise<Result<string, GitError>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return different branches based on repository type for testing
    switch (repositoryType) {
      case RepositoryType.DOCS:
        return Result.success('main'); // Could be 'preprod' for testing
      case RepositoryType.FOUNDATION_UI:
        return Result.success('master');
      default:
        return Result.success('main');
    }
  }

  /**
   * Mock implementation that simulates checking if a branch exists
   * @param branchName - Name of the branch to check
   * @param repositoryType - Which repository to check
   * @returns Promise<Result<boolean, GitError>> - Mock branch existence result
   */
  async branchExists(branchName: string, repositoryType: RepositoryType): Promise<Result<boolean, GitError>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Simulate invalid branch name error
    if (branchName === 'invalid/branch/name' || branchName.includes('..')) {
      return Result.error({
        type: 'invalid_branch_name',
        message: `Invalid branch name: ${branchName}`,
        branchName,
        repositoryType,
        details: 'Branch name contains invalid characters or pattern'
      });
    }
    
    // Mock logic: return true for common branch names, false for others
    const existingBranches = ['main', 'master', 'preprod', 'develop', 'feature/test-branch'];
    const exists = existingBranches.includes(branchName);
    
    console.log(`🔍 Mock branch check: '${branchName}' ${exists ? 'exists' : 'does not exist'} in ${repositoryType} repository`);
    return Result.success(exists);
  }

  /**
   * Mock implementation that simulates creating a new branch
   * @param branchName - Name of the new branch to create
   * @param baseBranch - Name of the base branch to create from
   * @param repositoryType - Which repository to create the branch in
   * @returns Promise<Result<true, GitError>> - Mock branch creation result
   */
  async createBranch(branchName: string, baseBranch: string, repositoryType: RepositoryType): Promise<Result<true, GitError>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate invalid branch name error
    if (branchName === 'invalid/branch/name' || branchName.includes('..')) {
      return Result.error({
        type: 'invalid_branch_name',
        message: `Invalid branch name: ${branchName}`,
        branchName,
        repositoryType,
        details: 'Branch name contains invalid characters or pattern'
      });
    }
    
    // Simulate branch already exists error
    if (branchName === 'existing-branch') {
      return Result.error({
        type: 'branch_already_exists',
        message: `Branch '${branchName}' already exists in ${repositoryType} repository`,
        branchName,
        repositoryType,
        details: 'Cannot create a branch that already exists'
      });
    }
    
    // Simulate base branch not found error
    if (baseBranch === 'non-existent-base') {
      return Result.error({
        type: 'branch_not_found',
        message: `Base branch '${baseBranch}' does not exist in ${repositoryType} repository`,
        branchName: baseBranch,
        repositoryType,
        details: 'Cannot create branch from non-existent base branch'
      });
    }
    
    // Simulate successful branch creation
    console.log(`🌿 Mock branch creation successful: '${branchName}' from '${baseBranch}' in ${repositoryType} repository`);
    return Result.success(true);
  }

  private createMockDocsCommit(commitHash: string): CommitInfo {
    return {
      hash: commitHash,
      author: 'John Doe',
      authorEmail: 'john.doe@example.com',
      date: new Date('2024-01-15T10:30:00Z'),
      message: 'docs: update API documentation',
      filesChanged: ['docs/api.md', 'docs/README.md'],
      diffs: [
        {
          filePath: 'docs/api.md',
          changeType: 'modified',
          diff: '@@ -10,7 +10,9 @@\n ## API Reference\n \n ### Authentication\n-Requires API key\n+Requires API key with proper permissions\n+See [Authentication Guide](./auth.md) for details\n \n ### Endpoints',
          linesAdded: 2,
          linesDeleted: 1
        },
        {
          filePath: 'docs/README.md',
          changeType: 'modified',
          diff: '@@ -5,6 +5,8 @@\n # Project Documentation\n \n ## Overview\n+This project provides automated documentation updates.\n+\n ## Features\n - API documentation\n - User guides\n - Examples',
          linesAdded: 2,
          linesDeleted: 0
        }
      ],
      repositoryType: RepositoryType.DOCS
    };
  }

  private createMockFoundationUiCommit(commitHash: string): CommitInfo {
    // Generate different commit messages based on hash patterns for testing
    let message: string;
    let filesChanged: string[];
    
    if (commitHash.startsWith('fix')) {
      message = 'fix: resolve authentication bug';
      filesChanged = ['src/auth.ts', 'src/bugfix.ts'];
    } else if (commitHash.startsWith('bug')) {
      message = 'bug: fix user login issue';
      filesChanged = ['src/login.ts', 'src/validation.ts'];
    } else if (commitHash.startsWith('typo')) {
      message = 'fix: correct typo in error message';
      filesChanged = ['src/errors.ts'];
    } else {
      message = 'feat: add new user authentication system';
      filesChanged = ['src/auth.ts', 'src/types.ts', 'tests/auth.test.ts'];
    }
    
    return {
      hash: commitHash,
      author: 'Jane Smith',
      authorEmail: 'jane.smith@example.com',
      date: new Date('2024-01-14T15:45:00Z'),
      message,
      filesChanged,
      diffs: [
        {
          filePath: filesChanged[0],
          changeType: 'modified',
          diff: '@@ -25,7 +25,7 @@\n   try {\n-    return JSON.parse(data);\n+    return JSON.parse(data.trim());\n   } catch (error) {\n     console.error(\'Failed to parse JSON\', error);\n     return null;\n   }',
          linesAdded: 1,
          linesDeleted: 1
        }
      ],
      repositoryType: RepositoryType.FOUNDATION_UI
    };
  }

  private createMockGenericCommit(commitHash: string, repositoryType: RepositoryType): CommitInfo {
    return {
      hash: commitHash,
      author: 'Developer',
      authorEmail: 'dev@example.com',
      date: new Date('2024-01-13T09:15:00Z'),
      message: 'fix: resolve minor bug in data processing',
      filesChanged: ['src/utils.ts'],
      diffs: [
        {
          filePath: 'src/utils.ts',
          changeType: 'modified',
          diff: '@@ -25,7 +25,7 @@\n   try {\n-    return JSON.parse(data);\n+    return JSON.parse(data.trim());\n   } catch (error) {\n     console.error(\'Failed to parse JSON\', error);\n     return null;\n   }',
          linesAdded: 1,
          linesDeleted: 1
        }
      ],
      repositoryType
    };
  }
} 