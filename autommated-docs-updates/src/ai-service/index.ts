// Export types
export * from './types';

// Export implementations
export { MockAIService } from './mock';

// Factory function to create AI service instances
import { AIService, AIServiceConfig } from './types';
import { MockAIService } from './mock';

/**
 * Factory function to create an AI service instance
 * @param config - Configuration options for the AI service
 * @returns AIService instance
 */
export function createAIService(config: AIServiceConfig = {}): AIService {
  if (config.useMock) {
    console.log('🤖 Using mock AI service');
    return new MockAIService();
  }
  
  // TODO: Return real AI service implementation when available
  console.log('🤖 Using real AI service (implementation not yet available, falling back to mock)');
  return new MockAIService();
} 