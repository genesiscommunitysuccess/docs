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
} 