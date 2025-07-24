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
    
    // Check for indicators that suggest docs updates are needed
    if (message.includes('feature') || message.includes('api') || message.includes('breaking')) {
      return Result.success(true); // New features, API changes, or breaking changes need docs
    }
    
    if (message.includes('fix') || message.includes('bug') || message.includes('typo')) {
      return Result.success(false); // Bug fixes and typos typically don't need doc updates
    }
    
    // Check file patterns
    if (files.includes('api') || files.includes('docs') || files.includes('readme')) {
      return Result.success(true); // Changes to API or documentation files suggest updates needed
    }
    
    if (files.includes('test') || files.includes('spec') || files.includes('internal')) {
      return Result.success(false); // Test files and internal changes don't need docs
    }
    
    // Default behavior: random but consistent for same commit hash
    const hashSum = commitInfo.hash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const needsUpdate = hashSum % 3 === 0; // 33% chance of needing updates
    return Result.success(needsUpdate);
  }
} 