// Export types
export * from './types';

// Export implementations
export { MockGitRepositoryService } from './mock';
export { RealGitRepositoryService } from './repository';

// Factory function to create git repository service instances
import { GitRepositoryService, GitRepositoryConfig } from './types';
import { MockGitRepositoryService } from './mock';
import { RealGitRepositoryService } from './repository';

/**
 * Factory function to create a git repository service instance
 * @param config - Configuration options for the git repository service
 * @returns GitRepositoryService instance
 */
export function createGitRepositoryService(config: GitRepositoryConfig): GitRepositoryService {
  if (config.useMock) {
    console.log('📁 Using mock git repository service');
    return new MockGitRepositoryService(config.docsRepositoryPath, config.foundationUiRepositoryPath);
  }
  
  console.log('📁 Using real git repository service');
  return new RealGitRepositoryService(config.docsRepositoryPath, config.foundationUiRepositoryPath);
} 