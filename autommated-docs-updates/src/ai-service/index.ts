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
    return new MockAIService();
  }
  
  // TODO: Return real AI service implementation when available
  // For now, default to mock service
  console.log('Using mock AI service (real implementation not yet available)');
  return new MockAIService();
} 