import { AIRepository, AIRepositoryConfig } from './types';
import { MockAIRepository } from './mock';
import { LangChainAIRepository } from './langchain';

/**
 * Factory function to create an AI repository
 * @param config - Configuration for the AI repository
 * @returns AIRepository - The configured AI repository
 */
export function createAIRepository(config: AIRepositoryConfig): AIRepository {
  if (config.useMock) {
    console.log('🤖 Using mock AI repository');
    return new MockAIRepository();
  } else {
    console.log('🤖 Using LangChain AI repository');
    return new LangChainAIRepository({
      apiKey: config.apiKey,
      model: config.model,
      temperature: config.temperature
    });
  }
} 