import { FileEditingRepositoryService, FileEditingRepositoryConfig } from './types';
import { MockFileEditingRepositoryService } from './mock';
import { RealFileEditingRepositoryService } from './repository';

/**
 * Factory function to create a file editing repository service
 * @param config - Configuration options for the file editing repository
 * @returns FileEditingRepositoryService - The configured file editing repository service
 */
export function createFileEditingRepository(config: FileEditingRepositoryConfig): FileEditingRepositoryService {
  if (config.useMock) {
    return new MockFileEditingRepositoryService(config);
  } else {
    return new RealFileEditingRepositoryService(config);
  }
}

// Export types for external use
export * from './types'; 