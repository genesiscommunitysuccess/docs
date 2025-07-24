import { Services } from '../../types/services';
import { CommitInfo } from '../git/types';
import { Result } from '../../types/result';

/**
 * AI Repository interface for automated documentation updates
 */
export interface AIRepository {
  /**
   * Analyzes a commit to determine if documentation updates are needed
   * @param services - The services object containing git and ai services
   * @param commitInfo - The commit information to analyze
   * @returns Promise<Result<boolean, string>> - Success with boolean indicating if docs should be updated, or error with failure reason
   */
  shouldUpdateDocs(services: Services, commitInfo: CommitInfo): Promise<Result<boolean, string>>;
}

/**
 * Configuration options for AI repositories
 */
export interface AIRepositoryConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** Additional configuration options for real AI repository */
  apiKey?: string;
  model?: string;
  temperature?: number;
} 