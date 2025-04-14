import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import path from 'path';
import { fileSystem, fileSystemBuilder, runGlobby } from './FileSystem.js';

describe('FileSystem', () => {
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
      files.forEach(file => {
        expect(file.endsWith('.mdx')).toBe(true);
      });
      
      // Verify the paths contain expected structure
      expect(files.some(file => file.includes('_includes'))).toBe(true);
      expect(files.some(file => file.includes('002_how-to'))).toBe(true);
    });
    
    it('should find files in specific directories', async () => {
      const files = await runGlobby('002_how-to/*.mdx');
      
      // Verify we got some results
      expect(files.length).toBeGreaterThan(0);
      
      // Verify all files are in the how-to directory and are mdx files
      files.forEach(file => {
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
        files.forEach(file => {
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
      files.forEach(file => {
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
      const lookingLogs = spy.mock.calls.filter(call => 
        typeof call[0] === 'string' && call[0].includes('Looking for docs in')
      );
      
      // If cache works, shouldn't be any logs from running globby again
      expect(lookingLogs.length).toBe(0);
    });
  });
});