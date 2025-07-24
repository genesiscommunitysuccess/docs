import { AIService } from './types';

/**
 * Mock implementation of the AI service for testing
 * 
 * This service provides predictable responses for testing scenarios:
 * - Commits starting with 'docs' will return true
 * - Commits starting with 'feat' will return true 50% of the time
 * - All other commits will return false
 */
export class MockAIService implements AIService {
  /**
   * Mock implementation that simulates AI analysis of commit hashes
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<boolean> - Simulated result based on commit hash pattern
   */
  async shouldUpdateDocs(commitHash: string): Promise<boolean> {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock logic based on commit hash patterns
    if (commitHash.startsWith('docs')) {
      return true; // Documentation-related commits always need updates
    }
    
    if (commitHash.startsWith('feat')) {
      // Feature commits have 50% chance of needing docs updates
      return Math.random() > 0.5;
    }
    
    // Default case: no docs updates needed
    return false;
  }
} 