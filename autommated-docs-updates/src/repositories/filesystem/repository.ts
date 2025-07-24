import { FilesystemRepositoryService, FilesystemRepositoryConfig, GrepResult, FilesystemError, ReadDocFileOptions, DocFileContent } from './types';
import { Result } from '../../types/result';
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, normalize } from 'path';
import { existsSync } from 'fs';

/**
 * Real filesystem repository service for automated documentation updates
 * 
 * This implementation provides actual filesystem operations for searching
 * through documentation files.
 */
export class FilesystemRepository implements FilesystemRepositoryService {
  private config: FilesystemRepositoryConfig;

  constructor(config: FilesystemRepositoryConfig) {
    this.config = config;
  }

  /**
   * Searches for a string pattern in all files within the docs directory
   * @param searchPattern - The string pattern to search for
   * @returns Promise<Result<GrepResult[], FilesystemError>> - Search results or error
   */
  async grepDocs(searchPattern: string): Promise<Result<GrepResult[], FilesystemError>> {
    // Validate search pattern
    if (!searchPattern || searchPattern.trim().length === 0) {
      return Result.error({
        type: 'search_pattern_invalid',
        message: 'Search pattern cannot be empty',
        searchPattern
      });
    }

    const docsPath = join(this.config.docsRepositoryPath, 'docs');

    // Check if docs directory exists
    if (!existsSync(docsPath)) {
      return Result.error({
        type: 'docs_directory_not_found',
        message: `Docs directory not found at: ${docsPath}`,
        filePath: docsPath
      });
    }

    try {
      const results: GrepResult[] = [];
      await this.searchDirectory(docsPath, searchPattern, results, docsPath);
      return Result.success(results);
    } catch (error) {
      return Result.error({
        type: 'unknown',
        message: 'An unexpected error occurred during search',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Recursively searches a directory for files containing the search pattern
   * @param dirPath - Directory path to search
   * @param searchPattern - Pattern to search for
   * @param results - Array to collect results
   * @param basePath - Base repository path for relative path calculation
   */
  private async searchDirectory(
    dirPath: string, 
    searchPattern: string, 
    results: GrepResult[], 
    basePath: string
  ): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Skip common directories that shouldn't be searched
          if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
            continue;
          }
          // Recursively search subdirectories
          await this.searchDirectory(fullPath, searchPattern, results, basePath);
        } else if (entry.isFile()) {
          // Search in file content
          await this.searchFile(fullPath, searchPattern, results, basePath);
        }
      }
    } catch (error) {
      // Log error but continue with other files
      console.warn(`Warning: Could not read directory ${dirPath}:`, error);
    }
  }

  /**
   * Searches a single file for the search pattern
   * @param filePath - Path to the file to search
   * @param searchPattern - Pattern to search for
   * @param results - Array to collect results
   * @param basePath - Base repository path for relative path calculation
   */
  private async searchFile(
    filePath: string, 
    searchPattern: string, 
    results: GrepResult[], 
    basePath: string
  ): Promise<void> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(searchPattern)) {
          const relativePath = relative(basePath, filePath);
          results.push({
            line: line.trim(),
            lineNumber: i + 1, // 1-indexed line numbers
            filePath: relativePath,
            fullPath: filePath
          });
        }
      }
    } catch (error) {
      // Log error but continue with other files
      console.warn(`Warning: Could not read file ${filePath}:`, error);
    }
  }

  /**
   * Reads a doc file with optional line count and offset parameters
   * @param relativePath - The file path relative to docsRepoPath/docs
   * @param options - Optional parameters for reading the file
   * @returns Promise<Result<DocFileContent, FilesystemError>> - File content or error
   */
  async readDocFile(relativePath: string, options?: ReadDocFileOptions): Promise<Result<DocFileContent, FilesystemError>> {
    // Validate relative path
    if (!relativePath || relativePath.trim().length === 0) {
      return Result.error({
        type: 'invalid_file_path',
        message: 'Relative path cannot be empty',
        filePath: relativePath
      });
    }

    // Normalize the path to prevent directory traversal attacks
    const normalizedPath = normalize(relativePath);
    if (normalizedPath.startsWith('..') || normalizedPath.includes('..')) {
      return Result.error({
        type: 'invalid_file_path',
        message: 'Path contains invalid directory traversal',
        filePath: relativePath
      });
    }

    const docsPath = join(this.config.docsRepositoryPath, 'docs');
    const fullPath = join(docsPath, normalizedPath);

    // Check if docs directory exists
    if (!existsSync(docsPath)) {
      return Result.error({
        type: 'docs_directory_not_found',
        message: `Docs directory not found at: ${docsPath}`,
        filePath: docsPath
      });
    }

    // Check if file exists
    if (!existsSync(fullPath)) {
      return Result.error({
        type: 'file_not_found',
        message: `File not found: ${relativePath}`,
        filePath: fullPath
      });
    }

    try {
      // Read the entire file
      const content = await readFile(fullPath, 'utf-8');
      const allLines = content.split('\n');
      const totalLines = allLines.length;

      const offset = options?.offset || 0;
      const lineCount = options?.lineCount || totalLines;

      // Validate offset
      if (offset < 0) {
        return Result.error({
          type: 'invalid_file_path',
          message: 'Offset cannot be negative',
          filePath: relativePath
        });
      }

      // Validate line count
      if (lineCount < 0) {
        return Result.error({
          type: 'invalid_file_path',
          message: 'Line count cannot be negative',
          filePath: relativePath
        });
      }

      // Check if offset is beyond file size
      if (offset >= totalLines) {
        return Result.error({
          type: 'file_read_error',
          message: 'Offset is beyond file size',
          filePath: relativePath,
          details: `File has ${totalLines} lines, but offset is ${offset}`
        });
      }

      // Calculate actual lines to read
      const actualLinesRead = Math.min(lineCount, totalLines - offset);
      const lines = allLines.slice(offset, offset + actualLinesRead);

      const fileContent: DocFileContent = {
        relativePath: normalizedPath,
        fullPath,
        lines,
        totalLines,
        linesRead: actualLinesRead,
        offset
      };

      return Result.success(fileContent);
    } catch (error) {
      return Result.error({
        type: 'file_read_error',
        message: 'Failed to read file',
        filePath: fullPath,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }
} 