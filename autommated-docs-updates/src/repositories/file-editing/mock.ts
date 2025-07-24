import { FileEditingRepositoryService, FileUpdateResult, FileEditingError, FileEditingRepositoryConfig } from './types';
import { Result } from '../../types/result';
import { CommitInfo } from '../git/types';

/**
 * Mock file editing repository service implementation for testing
 * 
 * This service provides mock responses for file editing operations
 * without actually modifying any files.
 */
export class MockFileEditingRepositoryService implements FileEditingRepositoryService {
  private docsRepositoryPath: string;
  private foundationUiRepositoryPath: string;
  private createBackups: boolean;
  private backupDirectory: string;

  constructor(config: FileEditingRepositoryConfig) {
    this.docsRepositoryPath = config.docsRepositoryPath;
    this.foundationUiRepositoryPath = config.foundationUiRepositoryPath;
    this.createBackups = config.createBackups ?? true;
    this.backupDirectory = config.backupDirectory ?? '.backups';
  }

  /**
   * Mock implementation of updateDocFile
   * Simulates updating a documentation file with AI-generated content
   */
  async updateDocFile(
    filePath: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): Promise<Result<FileUpdateResult, FileEditingError>> {
    // Simulate validation checks
    if (!this.isFileInDocsDirectory(filePath)) {
      return Result.error({
        type: 'file_not_in_docs_directory',
        message: `File path is not within the docs directory: ${filePath}`,
        filePath,
        details: `File must be within ${this.docsRepositoryPath}/docs directory`
      });
    }

    // Simulate preprod branch check
    const currentBranch = this.getMockCurrentBranch(); // Mock current branch
    if (currentBranch === 'preprod') {
      return Result.error({
        type: 'preprod_branch_active',
        message: 'Cannot edit files while on preprod branch',
        filePath,
        currentBranch,
        details: 'File editing is disabled on preprod branch for safety'
      });
    }

    // Simulate file existence check
    if (!this.mockFileExists(filePath)) {
      return Result.error({
        type: 'file_not_found',
        message: `File not found: ${filePath}`,
        filePath,
        details: `Mock file does not exist: ${filePath}`
      });
    }

    // Generate mock content based on commit info and instructions
    const originalContent = this.generateMockOriginalContent(filePath);
    const newContent = this.generateMockNewContent(originalContent, commitInfo, updateInstructions);
    
    // Calculate lines changed
    const linesChanged = this.calculateLinesChanged(originalContent, newContent);
    
    // Generate backup path if backups are enabled
    const backupPath = this.createBackups ? this.generateBackupPath(filePath) : undefined;

    const result: FileUpdateResult = {
      filePath,
      fullPath: `${this.docsRepositoryPath}/docs/${filePath}`,
      originalContent,
      newContent,
      backupPath,
      linesChanged,
      timestamp: new Date()
    };

    return Result.success(result);
  }

  /**
   * Checks if the file path is within the docs directory
   */
  private isFileInDocsDirectory(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return !normalizedPath.startsWith('../') && !normalizedPath.includes('/../');
  }

  /**
   * Mock file existence check
   */
  private mockFileExists(filePath: string): boolean {
    // Mock that all .md and .mdx files exist
    return filePath.endsWith('.md') || filePath.endsWith('.mdx');
  }

  /**
   * Generates mock original content for a file
   */
  private generateMockOriginalContent(filePath: string): string {
    return `# Mock Documentation

This is mock original content for the file: ${filePath}

## Section 1
Some existing content here.

## Section 2
More existing content.

---
*Last updated: Mock Date*`;
  }

  /**
   * Generates mock new content based on commit info and instructions
   */
  private generateMockNewContent(
    originalContent: string, 
    commitInfo: CommitInfo, 
    updateInstructions: string
  ): string {
    const timestamp = new Date().toISOString();
    
    return `# Mock Documentation

This is mock updated content for the file based on commit: ${commitInfo.hash}

## Section 1
Some existing content here.

## Section 2
More existing content.

## New Section (AI Generated)
This section was generated based on the commit: "${commitInfo.message}"

The update instructions were: "${updateInstructions}"

### Changes Made
- Added new section based on commit analysis
- Updated content to reflect recent changes
- Maintained existing structure and formatting

---
*Last updated: ${timestamp}*`;
  }

  /**
   * Calculates the number of lines changed between original and new content
   */
  private calculateLinesChanged(originalContent: string, newContent: string): number {
    const originalLines = originalContent.split('\n').length;
    const newLines = newContent.split('\n').length;
    return Math.abs(newLines - originalLines);
  }

  /**
   * Generates a backup file path
   */
  private generateBackupPath(filePath: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = filePath.split('/').pop() || 'unknown';
    const backupFileName = `${fileName}.backup.${timestamp}`;
    return `${this.backupDirectory}/${backupFileName}`;
  }

  /**
   * Gets the mock current branch (for testing different scenarios)
   */
  private getMockCurrentBranch(): string {
    // In mock mode, we can simulate different branches for testing
    return 'main'; // Could be 'preprod' for testing the error case
  }
} 