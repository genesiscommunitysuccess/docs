import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import path from 'path';
import fs from 'fs/promises';
import { fileSystem, fileSystemBuilder, runGlobby } from './FileSystem.js';

describe('FileSystem', () => {
  // Reset the module cache between tests
  beforeEach(() => {
    // Create a fresh instance for each test with a clean docs cache
    const freshFileSystem = fileSystemBuilder();
    // Reset the docs cache for clean tests
    Object.defineProperty(fileSystem, 'docsFiles', {
      value: freshFileSystem.docsFiles.bind(freshFileSystem),
    });

    // Allow console.error to pass through for debugging
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('runGlobby', () => {
    it('should find MDX files when using the **/*.mdx pattern', async () => {
      const files = await runGlobby('**/*.mdx');

      // Verify we got some results
      expect(files.length).toBeGreaterThan(0);

      // Verify all files have .mdx extension
      files.forEach((file) => {
        expect(file.endsWith('.mdx')).toBe(true);
      });

      // Verify the paths contain expected structure
      expect(files.some((file) => file.includes('_includes'))).toBe(true);
      expect(files.some((file) => file.includes('002_how-to'))).toBe(true);
    });

    it('should find files in specific directories', async () => {
      const files = await runGlobby('002_how-to/*.mdx');

      // Verify we got some results
      expect(files.length).toBeGreaterThan(0);

      // Verify all files are in the how-to directory and are mdx files
      files.forEach((file) => {
        expect(file.includes('002_how-to/')).toBe(true);
        expect(file.endsWith('.mdx')).toBe(true);
      });
    });

    it('should return empty array for non-matching patterns', async () => {
      const files = await runGlobby('non_existing_directory/*.xyz');
      expect(files).toEqual([]);
    });

    it('should find files regardless of current working directory', async () => {
      // Save original cwd
      const originalCwd = process.cwd();

      try {
        // Change working directory to parent directory
        process.chdir('..');

        // Should still find files using the correct path resolution
        const files = await runGlobby('**/*.mdx');

        // Verify we got some results
        expect(files.length).toBeGreaterThan(0);

        // Verify all files have .mdx extension
        files.forEach((file) => {
          expect(file.endsWith('.mdx')).toBe(true);
        });
      } finally {
        // Restore original working directory
        process.chdir(originalCwd);
      }
    });
  });

  describe('docsFiles', () => {
    it('should return markdown files (.md and .mdx)', async () => {
      const files = await fileSystem.docsFiles();

      // Verify we got results
      expect(files.length).toBeGreaterThan(0);

      // Verify all files have either .md or .mdx extension
      files.forEach((file) => {
        expect(file.endsWith('.md') || file.endsWith('.mdx')).toBe(true);
      });
    });

    it('should cache results after first call', async () => {
      // Spy on console.error to see how many times globby is called
      const spy = jest.spyOn(console, 'error');

      // First call
      const firstCallFiles = await fileSystem.docsFiles();
      expect(firstCallFiles.length).toBeGreaterThan(0);

      // Reset the spy to count only second call
      spy.mockClear();

      // Second call should use cache
      const secondCallFiles = await fileSystem.docsFiles();

      // Should be same results
      expect(secondCallFiles).toEqual(firstCallFiles);

      // Should not have logged any additional globby calls
      const lookingLogs = spy.mock.calls.filter(
        (call) => typeof call[0] === 'string' && call[0].includes('Looking for docs in')
      );

      // If cache works, shouldn't be any logs from running globby again
      expect(lookingLogs.length).toBe(0);
    });
  });

  describe('readDocFile', () => {
    // Create a mock file system for reading file tests
    let mockFs: any;

    beforeEach(() => {
      // Create a fresh file system for each test
      mockFs = fileSystemBuilder();

      // Mock the fs.readFile function to avoid actual file system access
      jest.spyOn(fs, 'readFile').mockImplementation(
        // Use a generic typed function to satisfy TypeScript
        (path: unknown, ...args: unknown[]) => {
          // Check if the path is a nonexistent file
          if (typeof path === 'string' && path.includes('nonexistent')) {
            return Promise.reject(new Error('ENOENT: no such file or directory'));
          }

          // Otherwise return mock content
          return Promise.resolve('# Test Markdown\nLine 2\nLine 3\nLine 4\nLine 5');
        }
      );
    });

    it('should read a file with proper path resolution', async () => {
      const content = await mockFs.readDocFile('docs/test-file.md');

      // Verify content returned correctly
      expect(content).toBe('# Test Markdown\nLine 2\nLine 3\nLine 4\nLine 5');
    });

    it('should handle paths that already include dist/', async () => {
      const content = await mockFs.readDocFile('dist/docs/test-file.md');

      // Verify content returned correctly
      expect(content).toBe('# Test Markdown\nLine 2\nLine 3\nLine 4\nLine 5');
    });

    it('should read specific lines with offset and maxLines', async () => {
      // Request lines 2-4 (0-based index)
      const content = await mockFs.readDocFile('docs/test-file.md', 1, 3);

      // Expect lines 2, 3, and 4
      expect(content).toBe('Line 2\nLine 3\nLine 4');
    });

    it('should handle offset beyond file length', async () => {
      // Request lines beyond the end of the file
      const content = await mockFs.readDocFile('docs/test-file.md', 10, 3);

      // Expect empty string since offset is beyond file length
      expect(content).toBe('');
    });

    it('should throw an error for nonexistent files', async () => {
      // Try to read a nonexistent file
      await expect(mockFs.readDocFile('docs/nonexistent.md')).rejects.toThrow(
        'Failed to read documentation file: docs/nonexistent.md'
      );
    });
  });
});
