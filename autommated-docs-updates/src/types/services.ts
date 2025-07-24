import { GitService } from '../services/git-service/types';
import { AIService } from '../services/ai-service/types';

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
} 