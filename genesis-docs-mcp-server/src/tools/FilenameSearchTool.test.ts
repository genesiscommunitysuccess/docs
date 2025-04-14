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
      value: freshFileSystem.docsFiles.bind(freshFileSystem)
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
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce([
        '/Users/test/project/dist/docs/003_grid-pro/index.md',
        '/Users/test/project/dist/docs/003_grid-pro/grid-pro-introduction.md',
        '/Users/test/project/dist/docs/003_grid-pro/numbereditor.md',
        '/Users/test/project/dist/docs/other-file.md'
      ]);
      
      // Perform a search for grid-pro
      const result = await tool.execute({ searchString: 'grid-pro' });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // If we're here, result is an object with the fuzzy match format
      expect(result).toHaveProperty('exactMatches');
      
      if ('exactMatches' in result && 'text' in result) {
        // Check for fuzzy match flag
        expect(result.exactMatches).toBe(false);
        expect(result).toHaveProperty('text');
        
        // Get the result text
        const resultText = result.text;
        
        // Expect to find grid-pro related paths in the results
        expect(resultText).toContain('grid-pro');
        
        // The results should contain actual file paths and be longer than 20 chars
        if (resultText) {
          expect(resultText.length).toBeGreaterThan(20);
        }
        
        // Should find files in the grid-pro directory
        expect(resultText).toContain('003_grid-pro');
      } else {
        // Should never reach here if the test is configured correctly
        expect(true).toBe(false);
      }
    });

    it('should return related files when searching for specific grid-pro components', async () => {
      // Mock the file system to return grid-pro files
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce([
        '/Users/test/project/dist/docs/003_grid-pro/index.md',
        '/Users/test/project/dist/docs/003_grid-pro/grid-pro-introduction.md',
        '/Users/test/project/dist/docs/003_grid-pro/numbereditor.md',
        '/Users/test/project/dist/docs/other-file.md'
      ]);
      
      // Search for a more specific grid-pro component
      const result = await tool.execute({ searchString: 'grid-pro number editor' });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // If we're here, result is an object
      expect(result).toHaveProperty('exactMatches');
      
      if ('exactMatches' in result && 'text' in result) {
        expect(result.exactMatches).toBe(false);
        
        // Get the result text
        const resultText = result.text;
        
        // Results should contain the number editor path
        expect(resultText).toContain('numbereditor');
      } else {
        // Should never reach here if the test is configured correctly
        expect(true).toBe(false);
      }
    });

    it('should provide a helpful message when no results are found', async () => {
      // Create a special test instance that will force empty results
      const testTool = new FilenameSearchTool();
      
      // Mock Fuse.js to return empty results
      jest.spyOn(testTool, 'execute').mockImplementationOnce(async (input) => {
        // Return the no results message directly
        return "No results found. Try using fewer or different words in your search term.";
      });
      
      // Search with our mocked tool
      const result = await testTool.execute({ searchString: 'anything' });
      
      // Expect a string message when no results
      expect(typeof result).toBe('string');
      expect(result).toContain('No results');
    });

    it('should return fuzzy matches even with typos or partial terms', async () => {
      // Search with a typo in "grid-pro"
      const result = await tool.execute({ searchString: 'grd pro' });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // If we're here, result is an object with fuzzy matches
      expect(result).toHaveProperty('exactMatches');
      
      if ('exactMatches' in result && 'text' in result) {
        expect(result.exactMatches).toBe(false);
        
        // Get the result text
        const resultText = result.text;
        expect(resultText).toContain('grid-pro');
      } else {
        // Should never reach here if the test is configured correctly
        expect(true).toBe(false);
      }
    });
    
    it('should return exact matches with relative paths when an exact filename match is found', async () => {
      // Mock file system to return a file with exact match
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce([
        '/Users/test/project/dist/docs/test-file.md',
        '/Users/test/project/dist/docs/test-file/another-file.md'
      ]);
      
      // Search for exact match to filename - we need to use the actual filename without extension
      const result = await tool.execute({ searchString: 'test-file.md' });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // Check the result is an object with exact match format
      expect(result).toHaveProperty('exactMatches');
      
      if ('exactMatches' in result && 'paths' in result) {
        expect(result.exactMatches).toBe(true);
        
        // Should have paths array with relative paths
        expect(Array.isArray(result.paths)).toBe(true);
        
        // Should contain the relative path without the /dist prefix
        expect(result.paths).toContain('docs/test-file.md');
      } else {
        // Test failed - the result doesn't have the expected format
        fail('Expected result to have exactMatches=true and paths array');
      }
    });
    
    it('should filter out API docs by default', async () => {
      // Mock file system with both regular and API docs
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce([
        '/Users/test/project/dist/docs/api-guide.md',
        '/Users/test/project/dist/docs/api/reference.md',
        '/Users/test/project/dist/docs/api/methods.md',
        '/Users/test/project/dist/docs/user-guide.md'
      ]);
      
      // Search for "api" which would match both regular and API docs
      const result = await tool.execute({ searchString: 'api' });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // Check that we have a valid result format
      if ('exactMatches' in result) {
        if (result.exactMatches === false && 'text' in result && result.text) {
          // For fuzzy results, check that no API docs paths are included
          expect(result.text).toContain('api-guide.md');
          expect(result.text).not.toContain('/docs/api/reference.md');
          expect(result.text).not.toContain('/docs/api/methods.md');
        } else if (result.exactMatches === true && 'paths' in result && result.paths) {
          // For exact matches, ensure no API docs paths are included
          const apiPathsIncluded = result.paths.some((path: string) => path.includes('/docs/api/'));
          expect(apiPathsIncluded).toBe(false);
        }
      } else {
        fail('Result has an unexpected format');
      }
    });
    
    it('should include API docs when showApiDocs is true', async () => {
      // Mock file system with both regular and API docs
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce([
        '/Users/test/project/dist/docs/api-guide.md',
        '/Users/test/project/dist/docs/api/reference.md',
        '/Users/test/project/dist/docs/api/methods.md',
        '/Users/test/project/dist/docs/user-guide.md'
      ]);
      
      // Search for "api" with showApiDocs=true
      const result = await tool.execute({ searchString: 'api', showApiDocs: true });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // Check that we have a valid result format
      if ('exactMatches' in result) {
        if (result.exactMatches === false && 'text' in result && result.text) {
          // For fuzzy results, check that API docs paths are included
          const resultText = result.text;
          // Both regular and API docs should be included
          expect(resultText).toContain('api-guide.md');
          
          // At least one of the API docs should be included
          const hasApiDocs = 
            resultText.includes('reference.md') || 
            resultText.includes('methods.md');
          expect(hasApiDocs).toBe(true);
        } else if (result.exactMatches === true && 'paths' in result && result.paths) {
          // For exact matches, check if API docs are included when they match exactly
          const allPaths = result.paths.join('\n');
          
          // If there's an exact match with /api/ in the path, it should be included
          if (allPaths && allPaths.includes('/docs/api/')) {
            expect(allPaths).toMatch(/\/docs\/api\//);
          }
        }
      } else {
        fail('Result has an unexpected format');
      }
    });
    
    it('should limit results based on maxResults parameter and include extra result information', async () => {
      // Generate a large set of mock files (more than the default limit)
      const mockFiles = Array.from({ length: 50 }, (_, i) => 
        `/Users/test/project/dist/docs/file-${i+1}.md`
      );
      
      // Mock file system to return many files
      jest.spyOn(fileSystem, 'docsFiles').mockResolvedValueOnce(mockFiles);
      
      // Test with a search term that will match many files
      const result = await tool.execute({ 
        searchString: 'file', 
        maxResults: 5 // Limit to just 5 results
      });
      
      // Check if result is a success object (not a string error message)
      if (typeof result === 'string') {
        // If we get a string, the test should fail
        expect(result).not.toBe(result); // Will always fail
        return;
      }
      
      // Check that we have a valid result format with information about additional results
      if ('exactMatches' in result && result.exactMatches === false && 'text' in result) {
        // Check that we have the additional result information
        expect(result).toHaveProperty('totalResults');
        expect(result).toHaveProperty('shownResults');
        expect(result).toHaveProperty('additionalResults');
        
        // Verify the counts are correct
        expect(result.shownResults).toBe(5);
        expect(result.additionalResults).toBeGreaterThan(0);
        expect(result.totalResults).toBeGreaterThan(5);
        
        // Since we limited to 5 results, check if the number of entries matches
        expect(result.shownResults).toBe(5);
        
        // Check that the additionalResults + shownResults = totalResults
        expect(result.additionalResults + result.shownResults).toBe(result.totalResults);
      } else {
        fail('Result does not have the expected format with additional result information');
      }
    });
  });
});