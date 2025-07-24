import { FileEditingRepositoryService, FileUpdateResult, FileEditingError, FileEditingRepositoryConfig } from './types';
import { Result } from '../../types/result';
import { CommitInfo, RepositoryType } from '../git/types';
import { RealGitRepositoryService } from '../git/repository';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';

/**
 * Real file editing repository service implementation
 * 
 * This service provides actual file editing capabilities with safety checks:
 * - Validates files are within the docs directory
 * - Prevents editing when on preprod branch
 * - Creates backups before editing
 * - Uses AI-generated content for updates
 */
export class RealFileEditingRepositoryService implements FileEditingRepositoryService {
  private docsRepositoryPath: string;
  private foundationUiRepositoryPath: string;
  private createBackups: boolean;
  private backupDirectory: string;
  private gitService: RealGitRepositoryService;

  constructor(config: FileEditingRepositoryConfig) {
    this.docsRepositoryPath = config.docsRepositoryPath;
    this.foundationUiRepositoryPath = config.foundationUiRepositoryPath;
    this.createBackups = config.createBackups ?? true;
    this.backupDirectory = config.backupDirectory ?? '.backups';
    this.gitService = new RealGitRepositoryService(this.docsRepositoryPath, this.foundationUiRepositoryPath);
  }

  /**
   * Updates a documentation file with AI-generated content based on commit information
   * @param filePath - The file path relative to docsRepoPath/docs
   * @param commitInfo - Information about the commit that triggered the update
   * @param updateInstructions - Instructions for what content to generate
   * @returns Promise<Result<FileUpdateResult, FileEditingError>> - Update result or error
   */
  async updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): Promise<Result<FileUpdateResult, FileEditingError>> {
    try {
      // Validate file path is within docs directory
      const validationResult = this.validateFilePath(filePath);
      if (Result.isError(validationResult)) {
        return validationResult;
      }

      // Check current branch - prevent editing on preprod
      const branchResult = await this.gitService.getCurrentBranch(RepositoryType.DOCS);
      if (Result.isError(branchResult)) {
        return Result.error({
          type: 'unknown',
          message: `Failed to get current branch: ${branchResult.message.message}`,
          filePath,
          details: branchResult.message.details
        });
      }

      const currentBranch = branchResult.value;
      if (currentBranch === 'preprod') {
        return Result.error({
          type: 'preprod_branch_active',
          message: 'Cannot edit files while on preprod branch',
          filePath,
          currentBranch,
          details: 'File editing is disabled on preprod branch for safety'
        });
      }

      // Check if file exists
      const fullPath = join(this.docsRepositoryPath, 'docs', filePath);
      if (!existsSync(fullPath)) {
        return Result.error({
          type: 'file_not_found',
          message: `File not found: ${filePath}`,
          filePath,
          details: `File does not exist at: ${fullPath}`
        });
      }

      // Read original content
      const originalContent = readFileSync(fullPath, 'utf8');

      // Create backup if enabled
      let backupPath: string | undefined;
      if (this.createBackups) {
        const backupResult = this.createBackup(filePath, originalContent);
        if (Result.isError(backupResult)) {
          return backupResult;
        }
        backupPath = backupResult.value;
      }

      // Generate new content using AI (placeholder for now)
      const newContent = await this.generateContent(originalContent, commitInfo, updateInstructions);

      // Write new content to file
      try {
        writeFileSync(fullPath, newContent, 'utf8');
      } catch (error) {
        return Result.error({
          type: 'file_write_error',
          message: `Failed to write file: ${filePath}`,
          filePath,
          details: error instanceof Error ? error.message : 'Unknown write error'
        });
      }

      // Calculate lines changed
      const linesChanged = this.calculateLinesChanged(originalContent, newContent);

      const result: FileUpdateResult = {
        filePath,
        fullPath,
        originalContent,
        newContent,
        backupPath,
        linesChanged,
        timestamp: new Date()
      };

      return Result.success(result);

    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: `Unexpected error updating file: ${filePath}`,
        filePath,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Validates that the file path is within the docs directory
   */
  private validateFilePath(filePath: string): Result<string, FileEditingError> {
    if (!filePath || filePath.trim() === '') {
      return Result.error({
        type: 'invalid_file_path',
        message: 'File path cannot be empty',
        filePath
      });
    }

    // Normalize path separators
    const normalizedPath = filePath.replace(/\\/g, '/');
    
    // Check for directory traversal attempts
    if (normalizedPath.startsWith('../') || 
        normalizedPath.includes('/../') || 
        normalizedPath.startsWith('/')) {
      return Result.error({
        type: 'file_not_in_docs_directory',
        message: `File path is not within the docs directory: ${filePath}`,
        filePath,
        details: `File must be within ${this.docsRepositoryPath}/docs directory`
      });
    }

    return Result.success(normalizedPath);
  }

  /**
   * Creates a backup of the original file content
   */
  private createBackup(filePath: string, content: string): Result<string, FileEditingError> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = filePath.split('/').pop() || 'unknown';
      const backupFileName = `${fileName}.backup.${timestamp}`;
      const backupPath = join(this.docsRepositoryPath, this.backupDirectory, backupFileName);

      // Ensure backup directory exists
      const backupDir = dirname(backupPath);
      if (!existsSync(backupDir)) {
        mkdirSync(backupDir, { recursive: true });
      }

      // Write backup file
      writeFileSync(backupPath, content, 'utf8');

      return Result.success(backupPath);
    } catch (error) {
      return Result.error({
        type: 'backup_failed',
        message: `Failed to create backup for file: ${filePath}`,
        filePath,
        details: error instanceof Error ? error.message : 'Unknown backup error'
      });
    }
  }

  /**
   * Generates new content using AI (placeholder implementation)
   * This will be replaced with actual AI integration
   */
  private async generateContent(
    originalContent: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): Promise<string> {
    // TODO: Integrate with AI service for content generation
    // For now, return a simple modification
    
    const timestamp = new Date().toISOString();
    const updateSection = `\n## AI-Generated Update (${timestamp})

This section was automatically generated based on commit: **${commitInfo.hash}**

**Commit Message:** ${commitInfo.message}

**Update Instructions:** ${updateInstructions}

### Changes Made
- Content updated based on commit analysis
- Maintained existing structure and formatting
- Added timestamp for tracking

---

`;

    return originalContent + updateSection;
  }

  /**
   * Calculates the number of lines changed between original and new content
   */
  private calculateLinesChanged(originalContent: string, newContent: string): number {
    const originalLines = originalContent.split('\n').length;
    const newLines = newContent.split('\n').length;
    return Math.abs(newLines - originalLines);
  }
} 