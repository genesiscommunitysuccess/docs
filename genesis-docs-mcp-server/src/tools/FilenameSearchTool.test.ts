import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import FilenameSearchTool from './FilenameSearchTool.js';
import { fileSystem, fileSystemBuilder } from '../services/FileSystem.js';

describe('FilenameSearchTool', () => {
  let tool: FilenameSearchTool;

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

    // Create a fresh tool instance for each test
    tool = new FilenameSearchTool();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return matching files for "grid-pro" search', async () => {
      // Mock the file system to return grid-pro files
      jest
        .spyOn(fileSystem, 'docsFiles')
        .mockResolvedValueOnce([
          '/Users/test/project/dist/docs/003_grid-pro/index.md',
          '/Users/test/project/dist/docs/003_grid-pro/grid-pro-introduction.md',
          '/Users/test/project/dist/docs/003_grid-pro/numbereditor.md',
          '/Users/test/project/dist/docs/other-file.md',
        ]);

      // Perform a search for grid-pro
      const result = await tool.execute({ searchString: 'grid-pro' });

      // Check if result is a string message (error case)
      expect(typeof result).not.toBe('string');

      // If we're here, result should be an array of file paths
      expect(Array.isArray(result)).toBe(true);

      // Expect to find grid-pro related paths in the results
      const results = result as string[];
      expect(results.some(path => path.includes('grid-pro'))).toBe(true);
      
      // All matching files should be included
      expect(results).toContain('docs/003_grid-pro/index.md');
      expect(results).toContain('docs/003_grid-pro/grid-pro-introduction.md');
      expect(results).toContain('docs/003_grid-pro/numbereditor.md');
    });

    it('should return related files when searching for specific grid-pro components', async () => {
      // Mock the file system to return grid-pro files
      jest
        .spyOn(fileSystem, 'docsFiles')
        .mockResolvedValueOnce([
          '/Users/test/project/dist/docs/003_grid-pro/index.md',
          '/Users/test/project/dist/docs/003_grid-pro/grid-pro-introduction.md',
          '/Users/test/project/dist/docs/003_grid-pro/numbereditor.md',
          '/Users/test/project/dist/docs/other-file.md',
        ]);

      // Search for a more specific grid-pro component
      const result = await tool.execute({ searchString: 'number editor' });

      // Check if result is a string message (error case)
      expect(typeof result).not.toBe('string');

      // If we're here, result should be an array of file paths
      expect(Array.isArray(result)).toBe(true);

      // Results should contain the number editor path
      const results = result as string[];
      expect(results).toContain('docs/003_grid-pro/numbereditor.md');
    });

    it('should return empty array when no results are found', async () => {
      // Mock the file system to return empty results
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce([]);

      // Search with no matching files
      const result = await tool.execute({ searchString: 'nonexistent' });

      // Expect an empty array when no results
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should accept strictWordBoundaries parameter', async () => {
      // Mock the file system with test files
      jest
        .spyOn(fileSystem, 'docsFiles')
        .mockResolvedValue([
          '/Users/test/project/dist/docs/test-directory/index.md',
          '/Users/test/project/dist/docs/another-directory/file.md',
        ]);

      // Test with strictWordBoundaries as 'true'
      const result1 = await tool.execute({ 
        searchString: 'test',
        strictWordBoundaries: 'true'
      });

      // Test with strictWordBoundaries as 'false'
      const result2 = await tool.execute({ 
        searchString: 'test',
        strictWordBoundaries: 'false'
      });

      // Just verify the tool accepts the parameter and returns arrays
      expect(Array.isArray(result1)).toBe(true);
      expect(Array.isArray(result2)).toBe(true);
    });

    it('should filter out API docs by default', async () => {
      // Mock file system with both regular and API docs
      jest
        .spyOn(fileSystem, 'docsFiles')
        .mockResolvedValueOnce([
          '/Users/test/project/dist/docs/api-guide.md',
          '/Users/test/project/dist/docs/api/reference.md',
          '/Users/test/project/dist/docs/api/methods.md',
          '/Users/test/project/dist/docs/user-guide.md',
        ]);

      // Search for "api" which would match both regular and API docs
      const result = await tool.execute({ searchString: 'api' });

      // Result should be array excluding the API directory files
      expect(Array.isArray(result)).toBe(true);
      const results = result as string[];
      expect(results).toContain('docs/api-guide.md');
      expect(results).not.toContain('docs/api/reference.md');
      expect(results).not.toContain('docs/api/methods.md');
    });

    it('should include API docs when showApiDocs is true', async () => {
      // Mock file system with both regular and API docs
      jest
        .spyOn(fileSystem, 'docsFiles')
        .mockResolvedValueOnce([
          '/Users/test/project/dist/docs/api-guide.md',
          '/Users/test/project/dist/docs/api/reference.md',
          '/Users/test/project/dist/docs/api/methods.md',
          '/Users/test/project/dist/docs/user-guide.md',
        ]);

      // Search for "api" with showApiDocs=true
      const result = await tool.execute({ 
        searchString: 'api', 
        showApiDocs: 'true' 
      });

      // Result should include API directory files
      expect(Array.isArray(result)).toBe(true);
      const results = result as string[];
      expect(results).toContain('docs/api-guide.md');
      
      // API directory files should be included
      const hasApiDocs = results.some(path => path.includes('docs/api/'));
      expect(hasApiDocs).toBe(true);
    });

    it('should return siblings from the same directory', async () => {
      // Mock file system with files in different directories
      jest
        .spyOn(fileSystem, 'docsFiles')
        .mockResolvedValueOnce([
          '/Users/test/project/dist/docs/grid-pro/index.md',
          '/Users/test/project/dist/docs/grid-pro/features.md',
          '/Users/test/project/dist/docs/grid-pro/advanced.md',
          '/Users/test/project/dist/docs/charts/index.md',
          '/Users/test/project/dist/docs/charts/basic.md',
        ]);

      // Search that matches in one directory
      const result = await tool.execute({ searchString: 'advanced' });

      // Result should include all files from the grid-pro directory
      expect(Array.isArray(result)).toBe(true);
      const results = result as string[];
      
      expect(results).toContain('docs/grid-pro/advanced.md');
      expect(results).toContain('docs/grid-pro/index.md');
      expect(results).toContain('docs/grid-pro/features.md');
      
      // Should not include files from other directories
      expect(results).not.toContain('docs/charts/index.md');
      expect(results).not.toContain('docs/charts/basic.md');
    });
  });
});
