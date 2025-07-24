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
      // Mock the sibling files
      const mockSiblings = ['docs/test-file.md', 'docs/other-file.md'];
      jest.spyOn(fileSystem, 'listSiblingDocFiles').mockResolvedValueOnce(mockSiblings);

      // Execute the tool with a mock file path
      const result = await tool.execute({ filePath: 'docs/test-file.md' });

      // Expected header
      const expectedHeader = 'File: docs/test-file.md\nTruncated: No';

      // Expected formatted response
      const expectedResponse = `${expectedHeader}\n\n---\n\n${mockContent}`;

      // Verify the result
      expect(result).toEqual({ fileContent: expectedResponse, siblingFiles: mockSiblings });

      // Verify the file system service was called correctly
      expect(fileSystem.readDocFile).toHaveBeenCalledWith(
        'docs/test-file.md',
        undefined,
        undefined
      );
      expect(fileSystem.listSiblingDocFiles).toHaveBeenCalledWith('docs/test-file.md');
    });

    it('should handle offset and maxLines parameters', async () => {
      // Mock readDocFile to return a subset of content
      const mockTruncatedContent = 'Line 3\nLine 4\nLine 5';
      jest.spyOn(fileSystem, 'readDocFile').mockResolvedValueOnce(mockTruncatedContent);
      // Mock the sibling files
      const mockSiblings = ['docs/test-file.md', 'docs/other-file.md'];
      jest.spyOn(fileSystem, 'listSiblingDocFiles').mockResolvedValueOnce(mockSiblings);

      // Execute with offset and maxLines
      const result = await tool.execute({
        filePath: 'docs/test-file.md',
        offset: 2,
        maxLines: 3,
      });

      // Expected header
      const expectedHeader = 'File: docs/test-file.md\nTruncated: Yes\nOffset: 2\nMax Lines: 3';

      // Expected formatted response
      const expectedResponse = `${expectedHeader}\n\n---\n\n${mockTruncatedContent}`;

      // Verify result
      expect(result).toEqual({ fileContent: expectedResponse, siblingFiles: mockSiblings });

      // Verify file system was called with correct parameters
      expect(fileSystem.readDocFile).toHaveBeenCalledWith('docs/test-file.md', 2, 3);
      expect(fileSystem.listSiblingDocFiles).toHaveBeenCalledWith('docs/test-file.md');
    });

    it('should handle errors when reading files', async () => {
      // Mock readDocFile to throw an error
      const errorMessage = 'Failed to read documentation file: docs/nonexistent.md';
      jest.spyOn(fileSystem, 'readDocFile').mockRejectedValueOnce(new Error(errorMessage));
      // Mock sibling files (should not be called, but mock just in case)
      jest.spyOn(fileSystem, 'listSiblingDocFiles').mockResolvedValueOnce([]);

      // Execute with a non-existent file
      const result = await tool.execute({ filePath: 'docs/nonexistent.md' });

      // Expected error message
      const expectedResponse = { error: `ERROR: ${errorMessage}` };

      // Verify we get back a properly formatted error message
      expect(result).toEqual(expectedResponse);
    });
  });
});
