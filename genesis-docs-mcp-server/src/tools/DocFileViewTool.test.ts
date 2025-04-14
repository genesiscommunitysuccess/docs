import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import DocFileViewTool from './DocFileViewTool.js';
import { fileSystem } from '../services/FileSystem.js';

describe('DocFileViewTool', () => {
  let tool: DocFileViewTool;

  beforeEach(() => {
    // Create a fresh instance for each test
    tool = new DocFileViewTool();

    // Mock console.error to avoid test output noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return file contents for a valid path', async () => {
      // Mock the readDocFile method to return predictable content
      const mockContent = '# Test Markdown\n\nThis is a test file.';
      jest.spyOn(fileSystem, 'readDocFile').mockResolvedValueOnce(mockContent);

      // Execute the tool with a mock file path
      const result = await tool.execute({ filePath: 'docs/test-file.md' });

      // Verify the result
      expect(result).toEqual({
        content: mockContent,
        isTruncated: false,
        offset: undefined,
        maxLines: undefined,
        filePath: 'docs/test-file.md',
      });

      // Verify the file system service was called correctly
      expect(fileSystem.readDocFile).toHaveBeenCalledWith(
        'docs/test-file.md',
        undefined,
        undefined
      );
    });

    it('should handle offset and maxLines parameters', async () => {
      // Mock readDocFile to return a subset of content
      const mockTruncatedContent = 'Line 3\nLine 4\nLine 5';
      jest.spyOn(fileSystem, 'readDocFile').mockResolvedValueOnce(mockTruncatedContent);

      // Execute with offset and maxLines
      const result = await tool.execute({
        filePath: 'docs/test-file.md',
        offset: 2,
        maxLines: 3,
      });

      // Verify result
      expect(result).toEqual({
        content: mockTruncatedContent,
        isTruncated: true,
        offset: 2,
        maxLines: 3,
        filePath: 'docs/test-file.md',
      });

      // Verify file system was called with correct parameters
      expect(fileSystem.readDocFile).toHaveBeenCalledWith('docs/test-file.md', 2, 3);
    });

    it('should handle errors when reading files', async () => {
      // Mock readDocFile to throw an error
      const errorMessage = 'Failed to read documentation file: docs/nonexistent.md';
      jest.spyOn(fileSystem, 'readDocFile').mockRejectedValueOnce(new Error(errorMessage));

      // Execute with a non-existent file
      const result = await tool.execute({ filePath: 'docs/nonexistent.md' });

      // Verify we get back an error object
      expect(result).toEqual({
        error: true,
        message: errorMessage,
        filePath: 'docs/nonexistent.md',
      });
    });
  });
});
