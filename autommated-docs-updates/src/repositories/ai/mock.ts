import { AIRepository } from './types';

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
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<boolean> - Mock determination of whether docs need updates
   */
  async shouldUpdateDocs(commitHash: string): Promise<boolean> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock logic based on commit hash patterns
    if (commitHash.includes('docs') || commitHash.includes('update')) {
      return true; // Commit suggests documentation updates
    }
    
    if (commitHash.includes('fix') || commitHash.includes('bug')) {
      return false; // Bug fixes typically don't need doc updates
    }
    
    // Default behavior: random but consistent for same commit hash
    const hashSum = commitHash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return hashSum % 3 === 0; // 33% chance of needing updates
  }
} 