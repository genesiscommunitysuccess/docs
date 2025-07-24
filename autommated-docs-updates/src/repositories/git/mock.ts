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
    return {
      hash: commitHash,
      author: 'Jane Smith',
      authorEmail: 'jane.smith@example.com',
      date: new Date('2024-01-14T15:45:00Z'),
      message: 'feat: add new user authentication system',
      filesChanged: ['src/auth.ts', 'src/types.ts', 'tests/auth.test.ts'],
      diffs: [
        {
          filePath: 'src/auth.ts',
          changeType: 'added',
          diff: '@@ -0,0 +1,50 @@\n+export class AuthService {\n+  private apiKey: string;\n+\n+  constructor(apiKey: string) {\n+    this.apiKey = apiKey;\n+  }\n+\n+  async authenticate(): Promise<boolean> {\n+    // Authentication logic here\n+    return true;\n+  }\n+}',
          linesAdded: 50,
          linesDeleted: 0
        },
        {
          filePath: 'src/types.ts',
          changeType: 'modified',
          diff: '@@ -5,8 +5,12 @@\n export interface User {\n   id: string;\n   name: string;\n+  email: string;\n+  permissions: string[];\n }\n+\n+export interface AuthConfig {\n+  apiKey: string;\n+  timeout: number;\n+}',
          linesAdded: 4,
          linesDeleted: 0
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