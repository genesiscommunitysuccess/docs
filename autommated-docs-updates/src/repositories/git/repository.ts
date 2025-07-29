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

  /**
   * Gets the primary branch name for the specified repository type
   * @param repositoryType - Which repository to get the branch for
   * @returns string - Primary branch name
   */
  private getPrimaryBranch(repositoryType: RepositoryType): string {
    switch (repositoryType) {
      case RepositoryType.DOCS:
        return 'preprod';
      case RepositoryType.FOUNDATION_UI:
        return 'master';
      default:
        throw new Error(`Unknown repository type: ${repositoryType}`);
    }
  }

  /**
   * Pulls the latest changes from the remote repository
   * @param repositoryType - Which repository to pull from
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async pullLatest(repositoryType: RepositoryType): Promise<Result<true, GitError>> {
    try {
      const repositoryPath = this.getRepositoryPath(repositoryType);
      const primaryBranch = this.getPrimaryBranch(repositoryType);
      
      console.log(`📥 Pulling latest changes from ${repositoryType} repository (${primaryBranch} branch)...`);
      
      // Checkout the primary branch
      const checkoutResult = this.executeGitCommand(`checkout ${primaryBranch}`, repositoryType);
      if (Result.isError(checkoutResult)) {
        return checkoutResult;
      }
      
      // Pull the latest changes
      const pullResult = this.executeGitCommand('pull', repositoryType);
      if (Result.isError(pullResult)) {
        return pullResult;
      }
      
      console.log(`✅ Successfully pulled latest changes from ${repositoryType} repository`);
      return Result.success(true);
      
    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: `Unexpected error pulling latest changes from ${repositoryType} repository`,
        repositoryType,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Gets the current branch name for the specified repository
   * @param repositoryType - Which repository to get the current branch for
   * @returns Promise<Result<string, GitError>> - Current branch name or error
   */
  async getCurrentBranch(repositoryType: RepositoryType): Promise<Result<string, GitError>> {
    try {
      const branchResult = this.executeGitCommand('rev-parse --abbrev-ref HEAD', repositoryType);
      if (Result.isError(branchResult)) {
        return branchResult;
      }
      
      return Result.success(branchResult.value.trim());
    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: `Unexpected error getting current branch for ${repositoryType} repository`,
        repositoryType,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Validates a branch name for git compatibility
   * @param branchName - The branch name to validate
   * @param repositoryType - Which repository this validation is for (for error context)
   * @returns Result<string, GitError> - Validated branch name or error
   */
  private validateBranchName(branchName: string, repositoryType: RepositoryType): Result<string, GitError> {
    // Git branch name rules: https://git-scm.com/docs/git-check-ref-format
    const invalidPatterns = [
      /^\./, // Cannot start with a dot
      /\.\./, // Cannot contain consecutive dots
      /[~^:?*[\\]/, // Cannot contain certain special characters
      /\/$/, // Cannot end with a slash
      /^-/, // Cannot start with a dash
      /\.lock$/, // Cannot end with .lock
      /@{/, // Cannot contain @{
      /\/\//, // Cannot contain consecutive slashes
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(branchName)) {
        return Result.error({
          type: 'invalid_branch_name',
          message: `Invalid branch name: ${branchName}`,
          branchName,
          repositoryType,
          details: `Branch name contains invalid characters or pattern`
        });
      }
    }

    if (branchName.length === 0) {
      return Result.error({
        type: 'invalid_branch_name',
        message: 'Branch name cannot be empty',
        branchName,
        repositoryType,
        details: 'Branch name must be at least 1 character long'
      });
    }

    return Result.success(branchName);
  }

  /**
   * Checks if a branch exists in the specified repository
   * @param branchName - Name of the branch to check
   * @param repositoryType - Which repository to check
   * @returns Promise<Result<boolean, GitError>> - True if branch exists, false if not, error if failed
   */
  async branchExists(branchName: string, repositoryType: RepositoryType): Promise<Result<boolean, GitError>> {
    try {
      // Validate branch name first
      const validationResult = this.validateBranchName(branchName, repositoryType);
      if (Result.isError(validationResult)) {
        return validationResult;
      }

      // Check if branch exists locally
      const localBranchResult = this.executeGitCommand(`show-ref --verify --quiet refs/heads/${branchName}`, repositoryType);
      if (Result.isSuccess(localBranchResult)) {
        return Result.success(true);
      }

      // Check if branch exists remotely
      const remoteBranchResult = this.executeGitCommand(`show-ref --verify --quiet refs/remotes/origin/${branchName}`, repositoryType);
      if (Result.isSuccess(remoteBranchResult)) {
        return Result.success(true);
      }

      // Branch doesn't exist
      return Result.success(false);
    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: `Unexpected error checking if branch exists: ${branchName} in ${repositoryType} repository`,
        repositoryType,
        branchName,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Creates a new branch from the specified base branch
   * @param branchName - Name of the new branch to create
   * @param baseBranch - Name of the base branch to create from
   * @param repositoryType - Which repository to create the branch in
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async createBranch(branchName: string, baseBranch: string, repositoryType: RepositoryType): Promise<Result<true, GitError>> {
    try {
      // Validate branch name
      const validationResult = this.validateBranchName(branchName, repositoryType);
      if (Result.isError(validationResult)) {
        return validationResult;
      }

      // Check if branch already exists
      const existsResult = await this.branchExists(branchName, repositoryType);
      if (Result.isError(existsResult)) {
        return existsResult;
      }

      if (existsResult.value) {
        return Result.error({
          type: 'branch_already_exists',
          message: `Branch '${branchName}' already exists in ${repositoryType} repository`,
          repositoryType,
          branchName,
          details: 'Cannot create a branch that already exists'
        });
      }

      // Check if base branch exists
      const baseExistsResult = await this.branchExists(baseBranch, repositoryType);
      if (Result.isError(baseExistsResult)) {
        return baseExistsResult;
      }

      if (!baseExistsResult.value) {
        return Result.error({
          type: 'branch_not_found',
          message: `Base branch '${baseBranch}' does not exist in ${repositoryType} repository`,
          repositoryType,
          branchName: baseBranch,
          details: 'Cannot create branch from non-existent base branch'
        });
      }

      console.log(`🌿 Creating branch '${branchName}' from '${baseBranch}' in ${repositoryType} repository...`);

      // Checkout the base branch first
      const checkoutResult = this.executeGitCommand(`checkout ${baseBranch}`, repositoryType);
      if (Result.isError(checkoutResult)) {
        return checkoutResult;
      }

      // Pull latest changes to ensure we're up to date (ignore failures for now)
      console.log(`📥 Attempting to pull latest changes from ${repositoryType} repository...`);
      const pullResult = this.executeGitCommand('pull', repositoryType);
      if (Result.isError(pullResult)) {
        console.log(`⚠️ Pull failed, continuing with branch creation: ${pullResult.message.message}`);
        // Continue anyway - the pull failure shouldn't prevent branch creation
      } else {
        console.log(`✅ Successfully pulled latest changes from ${repositoryType} repository`);
      }

      // Create the new branch
      const createResult = this.executeGitCommand(`checkout -b ${branchName}`, repositoryType);
      if (Result.isError(createResult)) {
        return createResult;
      }

      console.log(`✅ Successfully created branch '${branchName}' from '${baseBranch}' in ${repositoryType} repository`);
      return Result.success(true);

    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: `Unexpected error creating branch '${branchName}' in ${repositoryType} repository`,
        repositoryType,
        branchName,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  /**
   * Stages all changes for commit
   * @param repositoryType - Which repository to stage changes in
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async stageAllChanges(repositoryType: RepositoryType): Promise<Result<true, GitError>> {
    try {
      console.log(`📦 Staging all changes in ${repositoryType} repository...`);
      
      const result = this.executeGitCommand('add -A', repositoryType);
      if (Result.isError(result)) {
        return result;
      }

      console.log(`✅ Successfully staged all changes in ${repositoryType} repository`);
      return Result.success(true);

    } catch (error) {
      return Result.error({
        type: 'git_command_failed',
        message: `Failed to stage changes in ${repositoryType} repository`,
        repositoryType,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Commits all staged changes with a commit message
   * @param message - Commit message
   * @param repositoryType - Which repository to commit in
   * @returns Promise<Result<string, GitError>> - Commit hash if successful, error if failed
   */
  async commitChanges(message: string, repositoryType: RepositoryType): Promise<Result<string, GitError>> {
    try {
      console.log(`💾 Committing changes in ${repositoryType} repository with message: "${message}"...`);
      
      // Escape quotes and handle multiline messages properly
      const escapedMessage = message.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const result = this.executeGitCommand(`commit -m "${escapedMessage}"`, repositoryType);
      if (Result.isError(result)) {
        return result;
      }

      // Get the commit hash of the new commit
      const hashResult = this.executeGitCommand('rev-parse HEAD', repositoryType);
      if (Result.isError(hashResult)) {
        return Result.error({
          type: 'git_command_failed',
          message: `Failed to get commit hash after commit in ${repositoryType} repository`,
          repositoryType,
          details: hashResult.message.details
        });
      }

      const commitHash = hashResult.value.trim();
      console.log(`✅ Successfully committed changes in ${repositoryType} repository. Commit hash: ${commitHash}`);
      return Result.success(commitHash);

    } catch (error) {
      return Result.error({
        type: 'git_command_failed',
        message: `Failed to commit changes in ${repositoryType} repository`,
        repositoryType,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Pushes the current branch to the remote repository
   * @param branchName - Name of the branch to push
   * @param repositoryType - Which repository to push from
   * @returns Promise<Result<true, GitError>> - True if successful, error if failed
   */
  async pushBranch(branchName: string, repositoryType: RepositoryType): Promise<Result<true, GitError>> {
    try {
      console.log(`🚀 Pushing branch '${branchName}' to remote in ${repositoryType} repository...`);
      
      const result = this.executeGitCommand(`push -u origin ${branchName}`, repositoryType);
      if (Result.isError(result)) {
        return result;
      }

      console.log(`✅ Successfully pushed branch '${branchName}' to remote in ${repositoryType} repository`);
      return Result.success(true);

    } catch (error) {
      return Result.error({
        type: 'git_command_failed',
        message: `Failed to push branch '${branchName}' in ${repositoryType} repository`,
        repositoryType,
        branchName,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 