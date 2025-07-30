import { AIRepository } from './types';
import { Services } from '../../types/services';
import { CommitInfo } from '../git/types';
import { Result } from '../../types/result';

/**
 * Mock implementation of the AI repository for testing
 * 
 * This repository provides predictable responses for testing scenarios:
 * - Returns consistent results based on commit hash patterns
 * - Simulates AI analysis without requiring external API calls
 * - Supports both positive and negative documentation update scenarios
 */
export class MockAIRepository implements AIRepository {
  /**
   * Mock implementation that simulates AI analysis
   * @param services - The services object containing git and ai services
   * @param commitInfo - The commit information to analyze
   * @returns Promise<Result<boolean, string>> - Mock determination of whether docs need updates
   */
  async shouldUpdateDocs(services: Services, commitInfo: CommitInfo): Promise<Result<boolean, string>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock logic based on commit message and files changed
    const message = commitInfo.message.toLowerCase();
    const files = commitInfo.filesChanged.join(' ').toLowerCase();
    
    console.log(`🤖 Mock AI analyzing commit: "${commitInfo.message}"`);
    console.log(`🤖 Files changed: ${commitInfo.filesChanged.join(', ')}`);
    
    // Check for indicators that suggest docs updates are needed
    if (message.includes('feature') || message.includes('feat:') || message.includes('api') || message.includes('breaking')) {
      console.log(`🤖 Mock AI: Found feature/api/breaking indicator in message`);
      return Result.success(true); // New features, API changes, or breaking changes need docs
    }
    
    if (message.includes('fix') || message.includes('bug') || message.includes('typo')) {
      console.log(`🤖 Mock AI: Found fix/bug/typo indicator in message`);
      return Result.success(false); // Bug fixes and typos typically don't need doc updates
    }
    
    // Check file patterns
    if (files.includes('api') || files.includes('docs') || files.includes('readme')) {
      console.log(`🤖 Mock AI: Found api/docs/readme indicator in files`);
      return Result.success(true); // Changes to API or documentation files suggest updates needed
    }
    
    if (files.includes('test') || files.includes('spec') || files.includes('internal')) {
      console.log(`🤖 Mock AI: Found test/spec/internal indicator in files`);
      return Result.success(false); // Test files and internal changes don't need docs
    }
    
    // Default behavior: random but consistent for same commit hash
    const hashSum = commitInfo.hash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const needsUpdate = hashSum % 3 === 0; // 33% chance of needing updates
    console.log(`🤖 Mock AI: Using hash-based fallback, needsUpdate: ${needsUpdate}`);
    return Result.success(needsUpdate);
  }

  /**
   * Mock implementation that simulates finding docs files to edit
   * @param services - The services object containing git, ai, and filesystem services
   * @param commitInfo - The commit information to analyze
   * @returns Promise<Result<string[], string>> - Mock array of filepaths to edit
   */
  async findDocsFilesToEdit(services: Services, commitInfo: CommitInfo): Promise<Result<string[], string>> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock logic based on commit message and files changed
    const message = commitInfo.message.toLowerCase();
    const files = commitInfo.filesChanged.join(' ').toLowerCase();
    
    // Generate mock file paths based on commit characteristics
    const mockFiles: string[] = [];
    
    // Check for different types of changes and suggest relevant docs
    if (message.includes('component') || files.includes('component')) {
      mockFiles.push('001_develop/01_development-environment/007_genx/components.mdx');
      mockFiles.push('001_develop/01_development-environment/007_genx/component-api.mdx');
    }
    
    if (message.includes('api') || files.includes('api')) {
      mockFiles.push('001_develop/01_development-environment/007_genx/api-reference.mdx');
      mockFiles.push('001_develop/01_development-environment/007_genx/rest-api.mdx');
    }
    
    if (message.includes('form') || files.includes('form')) {
      mockFiles.push('001_develop/01_development-environment/007_genx/forms.mdx');
      mockFiles.push('001_develop/01_development-environment/007_genx/form-validation.mdx');
    }
    
    if (message.includes('table') || files.includes('table')) {
      mockFiles.push('001_develop/01_development-environment/007_genx/tables.mdx');
      mockFiles.push('001_develop/01_development-environment/007_genx/data-tables.mdx');
    }
    
    if (message.includes('config') || message.includes('configuration')) {
      mockFiles.push('001_develop/01_development-environment/007_genx/configuration.mdx');
      mockFiles.push('001_develop/01_development-environment/007_genx/settings.mdx');
    }
    
    // If no specific patterns match, provide some default files
    if (mockFiles.length === 0) {
      // Use commit hash to generate consistent but varied results
      const hashSum = commitInfo.hash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const fileIndex = hashSum % 5;
      
      const defaultFiles = [
        '001_develop/01_development-environment/007_genx/getting-started.mdx',
        '001_develop/01_development-environment/007_genx/components.mdx',
        '001_develop/01_development-environment/007_genx/api-reference.mdx',
        '001_develop/01_development-environment/007_genx/configuration.mdx',
        '001_develop/01_development-environment/007_genx/troubleshooting.mdx'
      ];
      
      mockFiles.push(defaultFiles[fileIndex]);
    }
    
    // Limit to 3 files maximum for mock
    return Result.success(mockFiles.slice(0, 3));
  }

  /**
   * Mock implementation that simulates updating a documentation file
   * @param services - The services object containing all required services
   * @param commitInfo - The commit information that triggered this update
   * @param filePath - The documentation file path to update (relative to docs directory)
   * @returns Promise<Result<boolean, string>> - Mock result of file update
   */
  async updateDocFile(services: Services, commitInfo: CommitInfo, filePath: string): Promise<Result<boolean, string>> {
    // Simulate some processing time for AI analysis
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`🤖 Mock AI updating documentation file: ${filePath} for commit: ${commitInfo.hash}`);
    console.log(`📝 Commit message: "${commitInfo.message}"`);
    console.log(`📁 Files changed: ${commitInfo.filesChanged.join(', ')}`);

    try {
      // Step 1: Read the current file content (simulated)
      console.log('📖 Step 1: Reading current file content...');
      const fileReadResult = await services.filesystem.readDocFile(filePath);
      if (Result.isError(fileReadResult)) {
        console.log(`❌ Could not read file ${filePath}: ${fileReadResult.message.message}`);
        return Result.error(`Failed to read file ${filePath}: ${fileReadResult.message.message}`);
      }

      const currentContent = fileReadResult.value.lines.join('\n');
      console.log(`📄 Current file has ${fileReadResult.value.linesRead} lines`);

      // Step 2: Simulate file type detection
      console.log('🔍 Step 2: Determining file type...');
      const isAutogenerated = this.mockDetermineFileType(filePath, currentContent);
      console.log(`📋 File type determined: ${isAutogenerated ? 'autogenerated' : 'manual'}`);

      // Step 3: Generate mock update instructions
      console.log('🔍 Step 3: Generating update instructions...');
      const updateInstructions = this.generateMockUpdateInstructions(commitInfo, filePath, isAutogenerated);
      console.log(`📝 Generated instructions: ${updateInstructions}`);

      // Step 4: Generate mock updated content and write it directly
      console.log('🔍 Step 4: Generating mock updated content...');
      
      const mockUpdatedContent = this.generateMockUpdatedContent(currentContent, commitInfo, updateInstructions);
      
      // For mock implementation, we'll simulate the file writing
      // In a real scenario, this would write to the actual file system
      console.log('📝 Mock: Writing updated content to file...');
      console.log(`✅ Mock file updated successfully`);
      console.log(`📊 Mock lines changed: ${Math.abs(mockUpdatedContent.split('\n').length - currentContent.split('\n').length)}`);
      console.log(`💾 Mock backup created: ${filePath}.backup.${Date.now()}`)

      return Result.success(true);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Error in mock updateDocFile:', errorMessage);
      return Result.error(`Mock file update failed: ${errorMessage}`);
    }
  }

  /**
   * Mock implementation of file type detection
   * @param filePath - The file path
   * @param content - The file content
   * @returns boolean - True if considered autogenerated
   */
  private mockDetermineFileType(filePath: string, content: string): boolean {
    const pathLower = filePath.toLowerCase();
    const contentLower = content.toLowerCase();

    // Simple mock logic for file type detection
    if (pathLower.includes('api-') || pathLower.includes('/api/') || pathLower.includes('-api.')) {
      return true; // autogenerated
    }

    if (contentLower.includes('autogenerated') || contentLower.includes('auto-generated')) {
      return true; // autogenerated
    }

    return false; // manual
  }

  /**
   * Generates mock update instructions based on commit and file info
   * @param commitInfo - The commit information
   * @param filePath - The file path
   * @param isAutogenerated - Whether the file is autogenerated
   * @returns string - Mock update instructions
   */
  private generateMockUpdateInstructions(commitInfo: CommitInfo, filePath: string, isAutogenerated: boolean): string {
    const message = commitInfo.message.toLowerCase();
    const files = commitInfo.filesChanged.join(' ').toLowerCase();

    if (isAutogenerated) {
      // Mock instructions for autogenerated files
      if (message.includes('api') || files.includes('api')) {
        return `Update API documentation to reflect changes in ${commitInfo.filesChanged.join(', ')}. Replace outdated method signatures and parameters with new ones from the commit.`;
      }
      return `Update autogenerated documentation to exactly match the code changes in commit ${commitInfo.hash}.`;
    } else {
      // Mock instructions for manual documentation
      if (message.includes('feature') || message.includes('feat:')) {
        return `Add documentation for new feature introduced in commit "${commitInfo.message}". Include usage examples and configuration details.`;
      }
      
      if (message.includes('component') || files.includes('component')) {
        return `Update component documentation to reflect changes in ${commitInfo.filesChanged.join(', ')}. Add examples showing the new component functionality.`;
      }
      
      if (message.includes('config') || message.includes('configuration')) {
        return `Update configuration documentation to include new settings and options introduced in this commit.`;
      }
      
      return `Update documentation to reflect the changes made in commit "${commitInfo.message}". Ensure users understand the new functionality.`;
    }
  }

  /**
   * Generates mock updated content for the documentation file
   * @param currentContent - The current file content
   * @param commitInfo - The commit information
   * @param updateInstructions - The update instructions
   * @returns string - Mock updated content
   */
  private generateMockUpdatedContent(currentContent: string, commitInfo: CommitInfo, updateInstructions: string): string {
    // For mock implementation, we'll make some simple content changes
    // to simulate what the AI would do
    
    const message = commitInfo.message.toLowerCase();
    
    if (message.includes('position') && message.includes('select')) {
      // If the commit is about adding a position attribute to select editors,
      // add a mock property to the documentation
      const mockPropertyLine = '| position | (rowData: any) => string | Optional positioning function |';
      
      // Find the last property line and add the new one after it
      const lines = currentContent.split('\n');
      let lastPropertyIndex = -1;
      for (let i = lines.length - 1; i >= 0; i--) {
        const line: string = lines[i];
        if (line.startsWith('|') && line.includes('|') && line.trim() !== '|---|---|---|') {
          lastPropertyIndex = i;
          break;
        }
      }
      
      if (lastPropertyIndex !== -1) {
        lines.splice(lastPropertyIndex + 1, 0, mockPropertyLine);
        return lines.join('\n');
      }
    }
    
    if (message.includes('feature') || message.includes('feat:')) {
      // For new features, add a note about the new functionality
      return currentContent + `\n\n## New Feature\n\nThis documentation has been updated to reflect new functionality added in commit ${commitInfo.hash.substring(0, 8)}.\n\n`;
    }
    
    if (message.includes('api')) {
      // For API changes, add a note about API updates
      return currentContent + `\n\n## API Update\n\nAPI documentation updated based on changes in commit ${commitInfo.hash.substring(0, 8)}.\n\n`;
    }
    
    // Default: just add a small update note
    return currentContent + `\n\n*Documentation updated for commit ${commitInfo.hash.substring(0, 8)}*\n`;
  }
} 