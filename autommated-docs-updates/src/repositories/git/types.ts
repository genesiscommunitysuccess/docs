/**
 * Git Repository Service interface for automated documentation updates
 */
export interface GitRepositoryService {
  /**
   * Gets commit information and diffs for a specific commit hash
   * @param commitHash - The git commit hash to analyze
   * @param repositoryType - Which repository to query (docs or foundation-ui)
   * @returns Promise<CommitInfo> - Commit information and diffs
   */
  getCommitInfo(commitHash: string, repositoryType: RepositoryType): Promise<CommitInfo>;
}

/**
 * Repository types that can be queried
 */
export enum RepositoryType {
  DOCS = 'docs',
  FOUNDATION_UI = 'foundation-ui'
}

/**
 * Commit information and diffs
 */
export interface CommitInfo {
  /** The commit hash */
  hash: string;
  /** Commit author name */
  author: string;
  /** Commit author email */
  authorEmail: string;
  /** Commit date */
  date: Date;
  /** Commit message */
  message: string;
  /** List of files changed in the commit */
  filesChanged: string[];
  /** Diffs for each changed file */
  diffs: FileDiff[];
  /** Which repository this commit info came from */
  repositoryType: RepositoryType;
}

/**
 * File diff information
 */
export interface FileDiff {
  /** File path */
  filePath: string;
  /** Type of change (added, modified, deleted) */
  changeType: 'added' | 'modified' | 'deleted';
  /** The actual diff content */
  diff: string;
  /** Number of lines added */
  linesAdded: number;
  /** Number of lines deleted */
  linesDeleted: number;
}

/**
 * Configuration options for git repository services
 */
export interface GitRepositoryConfig {
  /** Path to the docs repository */
  docsRepositoryPath: string;
  /** Path to the foundation-ui repository */
  foundationUiRepositoryPath: string;
  /** Whether to use mock implementation for testing */
  useMock?: boolean;
} 