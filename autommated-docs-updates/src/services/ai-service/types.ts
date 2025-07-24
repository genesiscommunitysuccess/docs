import { Result } from '../../types/result';
import { Services } from '../../types/services';

/**
 * AI Service interface for automated documentation updates
 * This service wraps the AI repository and provides business logic
 */
export interface AIService {
  /**
   * Analyzes a commit hash to determine if documentation updates are needed
   * @param services - The services object containing git and ai services
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<Result<boolean, string>> - Success with boolean indicating if docs should be updated, or error with failure reason
   */
  shouldUpdateDocs(services: Services, commitHash: string): Promise<Result<boolean, string>>;
}

/**
 * Configuration options for AI services
 */
export interface AIServiceConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
} 