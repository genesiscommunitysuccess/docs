import { GitRepositoryService, CommitInfo, FileDiff, RepositoryType } from './types';
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
    this.docsRepositoryPath = this.validateRepositoryPath(docsRepositoryPath, 'docs');
    this.foundationUiRepositoryPath = this.validateRepositoryPath(foundationUiRepositoryPath, 'foundation-ui');
  }

  /**
   * Validates that the repository path exists and is a git repository
   * @param repositoryPath - Path to the git repository
   * @param repositoryName - Name of the repository for error messages
   * @returns string - Validated repository path
   * @throws Error if repository doesn't exist or is not a git repository
   */
  private validateRepositoryPath(repositoryPath: string, repositoryName: string): string {
    if (!existsSync(repositoryPath)) {
      throw new Error(`${repositoryName} repository path does not exist: ${repositoryPath}`);
    }

    const gitDir = `${repositoryPath}/.git`;
    if (!existsSync(gitDir)) {
      throw new Error(`Path is not a git repository (${repositoryName}): ${repositoryPath}`);
    }

    return repositoryPath;
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
   * @returns string - Command output
   */
  private executeGitCommand(command: string, repositoryType: RepositoryType): string {
    const repositoryPath = this.getRepositoryPath(repositoryType);
    
    try {
      return execSync(`git -C "${repositoryPath}" ${command}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      }).trim();
    } catch (error) {
      throw new Error(`Git command failed in ${repositoryType} repository: ${command}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
   * @returns Promise<CommitInfo> - Commit information and diffs
   */
  async getCommitInfo(commitHash: string, repositoryType: RepositoryType): Promise<CommitInfo> {
    try {
      // Get commit details
      const commitDetails = this.executeGitCommand(`show --format=format:"%H%n%an%n%ae%n%aI%n%s" --no-patch ${commitHash}`, repositoryType);
      const [hash, author, authorEmail, dateString, message] = commitDetails.split('\n');

      // Get list of files changed
      const filesChanged = this.executeGitCommand(`show --name-only --format=format: ${commitHash}`, repositoryType)
        .split('\n')
        .filter(file => file.trim() !== '');

      // Get the full diff
      const diffOutput = this.executeGitCommand(`show --no-color ${commitHash}`, repositoryType);
      const diffs = this.parseDiffs(diffOutput);

      return {
        hash,
        author,
        authorEmail,
        date: new Date(dateString),
        message,
        filesChanged,
        diffs,
        repositoryType
      };
    } catch (error) {
      throw new Error(`Failed to get commit info for ${commitHash} in ${repositoryType} repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 