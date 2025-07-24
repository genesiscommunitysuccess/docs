import { AIService, AIServiceConfig } from './types';
import { createAIRepository, AIRepository } from '../../repositories/ai';

/**
 * AI Service implementation
 * 
 * This service wraps the AI repository and provides business logic
 * for AI-powered documentation analysis.
 */
export class RealAIService implements AIService {
  private aiRepository: AIRepository;

  constructor(config: AIServiceConfig) {
    // Create the underlying AI repository
    this.aiRepository = createAIRepository({
      useMock: config.useMock
    });

    console.log(`🤖 AI Service initialized`);
  }

  /**
   * Analyzes a commit hash to determine if documentation updates are needed
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<boolean> - True if documentation updates are needed, false otherwise
   */
  async shouldUpdateDocs(commitHash: string): Promise<boolean> {
    // Delegate to the underlying AI repository
    return this.aiRepository.shouldUpdateDocs(commitHash);
  }
}

/**
 * Factory function to create an AI service
 * @param config - Configuration for the AI service
 * @returns AIService - The configured AI service
 */
export function createAIService(config: AIServiceConfig): AIService {
  return new RealAIService(config);
} 