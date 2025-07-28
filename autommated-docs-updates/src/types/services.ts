import { GitService } from '../services/git-service/types';
import { AIService } from '../services/ai-service/types';
import { FilesystemService } from '../services/filesystem-service/types';
import { FileEditingService } from '../services/file-editing-service/types';
import { GitHubService } from '../services/github-service/types';

/**
 * Services container type
 * 
 * This type contains references to all initialized services used by the application.
 * It provides a centralized way to access and manage all services.
 */
export interface Services {
  /** Git service for repository operations */
  git: GitService;
  /** AI service for documentation analysis */
  ai: AIService;
  /** Filesystem service for file operations */
  filesystem: FilesystemService;
  /** File editing service for documentation updates */
  fileEditing: FileEditingService;
  /** GitHub service for pull request operations */
  github: GitHubService;
} 