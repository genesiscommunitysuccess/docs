// Export types
export * from './types';

// Export implementations
export { MockAIService } from './mock';
export { LangChainAIService } from './langchain';

// Factory function to create AI service instances
import { AIService, AIServiceConfig } from './types';
import { MockAIService } from './mock';
import { LangChainAIService } from './langchain';

/**
 * Factory function to create an AI service
 * @param config - Configuration for the AI service
 * @returns AIService - The configured AI service
 */
export function createAIService(config: AIServiceConfig): AIService {
  if (config.useMock) {
    console.log('🤖 Using mock AI service');
    return new MockAIService();
  } else {
    console.log('🤖 Using LangChain AI service');
    return new LangChainAIService();
  }
} 