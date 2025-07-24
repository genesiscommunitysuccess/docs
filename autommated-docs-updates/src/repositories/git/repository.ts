import { GitRepositoryService, CommitInfo, FileDiff, RepositoryType, GitError } from './types';
import { Result } from '../../types/result';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

/**
 * Real git repository service implementation
 * 
 * This service uses actual git commands to retrieve commit information
 * and diffs from a git repository.
 */
export class RealGitRepositoryService implements GitRepositoryService {
  private docsRepositoryPath: string;
  private foundationUiRepositoryPath: string;

  constructor(docsRepositoryPath: string, foundationUiRepositoryPath: string) {
    const docsResult = this.validateRepositoryPath(docsRepositoryPath, 'docs');
    const fuiResult = this.validateRepositoryPath(foundationUiRepositoryPath, 'foundation-ui');
    
    if (Result.isError(docsResult)) {
      throw new Error(docsResult.message.message);
    }
    if (Result.isError(fuiResult)) {
      throw new Error(fuiResult.message.message);
    }
    
    this.docsRepositoryPath = docsResult.value;
    this.foundationUiRepositoryPath = fuiResult.value;
  }

  /**
   * Validates that the repository path exists and is a git repository
   * @param repositoryPath - Path to the git repository
   * @param repositoryName - Name of the repository for error messages
   * @returns Result<string, GitError> - Validated repository path or error
   */
  private validateRepositoryPath(repositoryPath: string, repositoryName: string): Result<string, GitError> {
    if (!existsSync(repositoryPath)) {
      return Result.error({
        type: 'repository_not_found',
        message: `${repositoryName} repository path does not exist: ${repositoryPath}`,
        repositoryType: repositoryName === 'docs' ? RepositoryType.DOCS : RepositoryType.FOUNDATION_UI,
        details: `Path not found: ${repositoryPath}`
      });
    }

    const gitDir = `${repositoryPath}/.git`;
    if (!existsSync(gitDir)) {
      return Result.error({
        type: 'repository_not_git',
        message: `Path is not a git repository (${repositoryName}): ${repositoryPath}`,
        repositoryType: repositoryName === 'docs' ? RepositoryType.DOCS : RepositoryType.FOUNDATION_UI,
        details: `No .git directory found at: ${gitDir}`
      });
    }

    return Result.success(repositoryPath);
  }

  /**
   * Gets the repository path for the specified repository type
   * @param repositoryType - Which repository to use
   * @returns string - Repository path
   */
  private getRepositoryPath(repositoryType: RepositoryType): string {
    switch (repositoryType) {
      case RepositoryType.DOCS:
        return this.docsRepositoryPath;
      case RepositoryType.FOUNDATION_UI:
        return this.foundationUiRepositoryPath;
      default:
        throw new Error(`Unknown repository type: ${repositoryType}`);
    }
  }

  /**
   * Executes a git command in the specified repository
   * @param command - Git command to execute
   * @param repositoryType - Which repository to execute the command in
   * @returns Result<string, GitError> - Command output or error
   */
  private executeGitCommand(command: string, repositoryType: RepositoryType): Result<string, GitError> {
    const repositoryPath = this.getRepositoryPath(repositoryType);
    
    try {
      const output = execSync(`git -C "${repositoryPath}" ${command}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim();
      return Result.success(output);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check for specific git error patterns
      if (errorMessage.includes('fatal: bad object')) {
        return Result.error({
          type: 'invalid_commit_hash',
          message: `Invalid commit hash in ${repositoryType} repository`,
          repositoryType,
          details: errorMessage
        });
      }
      
      if (errorMessage.includes('fatal: not a git repository')) {
        return Result.error({
          type: 'repository_not_git',
          message: `Not a git repository: ${repositoryPath}`,
          repositoryType,
          details: errorMessage
        });
      }
      
      return Result.error({
        type: 'git_command_failed',
        message: `Git command failed in ${repositoryType} repository: ${command}`,
        repositoryType,
        details: errorMessage
      });
    }
  }

  /**
   * Parses git diff output to extract file diffs
   * @param diffOutput - Raw git diff output
   * @returns FileDiff[] - Parsed file diffs
   */
  private parseDiffs(diffOutput: string): FileDiff[] {
    if (!diffOutput) {
      return [];
    }

    const diffs: FileDiff[] = [];
    const fileSections = diffOutput.split('diff --git ').slice(1);

    for (const section of fileSections) {
      const lines = section.split('\n');
      const filePathMatch = lines[0].match(/a\/(.+) b\/(.+)/);
      
      if (!filePathMatch) continue;

      const filePath = filePathMatch[2]; // Use the 'b' path (new version)
      const changeType = this.determineChangeType(section);
      const { linesAdded, linesDeleted } = this.countLinesChanged(section);

      diffs.push({
        filePath,
        changeType,
        diff: section,
        linesAdded,
        linesDeleted
      });
    }

    return diffs;
  }

  /**
   * Determines the type of change for a file
   * @param diffSection - Git diff section for a file
   * @returns 'added' | 'modified' | 'deleted'
   */
  private determineChangeType(diffSection: string): 'added' | 'modified' | 'deleted' {
    if (diffSection.includes('new file mode')) {
      return 'added';
    }
    if (diffSection.includes('deleted file mode')) {
      return 'deleted';
    }
    return 'modified';
  }

  /**
   * Counts the number of lines added and deleted in a diff
   * @param diffSection - Git diff section for a file
   * @returns object with linesAdded and linesDeleted
   */
  private countLinesChanged(diffSection: string): { linesAdded: number; linesDeleted: number } {
    let linesAdded = 0;
    let linesDeleted = 0;

    const lines = diffSection.split('\n');
    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        linesAdded++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        linesDeleted++;
      }
    }

    return { linesAdded, linesDeleted };
  }

  /**
   * Gets commit information and diffs for a specific commit hash
   * @param commitHash - The git commit hash to analyze
   * @param repositoryType - Which repository to query
   * @returns Promise<Result<CommitInfo, GitError>> - Commit information and diffs or error
   */
  async getCommitInfo(commitHash: string, repositoryType: RepositoryType): Promise<Result<CommitInfo, GitError>> {
    try {
      // Validate commit hash format
      if (!commitHash || commitHash.length < 7) {
        return Result.error({
          type: 'invalid_commit_hash',
          message: `Invalid commit hash: ${commitHash}. Commit hashes must be at least 7 characters long.`,
          repositoryType,
          commitHash
        });
      }

      // Get commit details
      const commitDetailsResult = this.executeGitCommand(`show --format=format:"%H%n%an%n%ae%n%aI%n%s" --no-patch ${commitHash}`, repositoryType);
      if (Result.isError(commitDetailsResult)) {
        return commitDetailsResult;
      }
      
      const [hash, author, authorEmail, dateString, message] = commitDetailsResult.value.split('\n');

      // Get list of files changed
      const filesChangedResult = this.executeGitCommand(`show --name-only --format=format: ${commitHash}`, repositoryType);
      if (Result.isError(filesChangedResult)) {
        return filesChangedResult;
      }
      
      const filesChanged = filesChangedResult.value
        .split('\n')
        .filter(file => file.trim() !== '');

      // Get the full diff
      const diffOutputResult = this.executeGitCommand(`show --no-color ${commitHash}`, repositoryType);
      if (Result.isError(diffOutputResult)) {
        return diffOutputResult;
      }
      
      const diffs = this.parseDiffs(diffOutputResult.value);

      return Result.success({
        hash,
        author,
        authorEmail,
        date: new Date(dateString),
        message,
        filesChanged,
        diffs,
        repositoryType
      });
    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: `Unexpected error getting commit info for ${commitHash} in ${repositoryType} repository`,
        repositoryType,
        commitHash,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 