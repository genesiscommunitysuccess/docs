import { FilesystemRepositoryService, FilesystemRepositoryConfig } from './types';
import { MockFilesystemRepository } from './mock';
import { FilesystemRepository } from './repository';

/**
 * Factory function to create a filesystem repository service
 * 
 * @param config - Configuration options for the filesystem repository
 * @returns FilesystemRepositoryService - The appropriate filesystem repository implementation
 */
export function createFilesystemRepository(config: FilesystemRepositoryConfig): FilesystemRepositoryService {
  if (config.useMock) {
    return new MockFilesystemRepository(config);
  }
  
  return new FilesystemRepository(config);
}

// Export types for external use
export * from './types'; 