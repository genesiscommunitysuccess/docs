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

  /**
   * Finds documentation files that need to be edited based on a commit
   * @param services - The services object containing git, ai, and filesystem services
   * @param commitInfo - The commit information to analyze
   * @returns Promise<Result<string[], string>> - Success with array of filepaths relative to docsDir/root, or error with failure reason
   */
  findDocsFilesToEdit(services: Services, commitInfo: CommitInfo): Promise<Result<string[], string>>;
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