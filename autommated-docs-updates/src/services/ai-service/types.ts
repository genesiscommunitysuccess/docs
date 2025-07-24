/**
 * AI Service interface for automated documentation updates
 */
export interface AIService {
  /**
   * Analyzes a commit hash to determine if documentation updates are needed
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<boolean> - True if documentation updates are needed, false otherwise
   */
  shouldUpdateDocs(commitHash: string): Promise<boolean>;
}

/**
 * Configuration options for AI services
 */
export interface AIServiceConfig {
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
  /** Additional configuration options for real AI service */
  apiKey?: string;
  model?: string;
  temperature?: number;
} 