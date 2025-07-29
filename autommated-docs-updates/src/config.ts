/**
 * Configuration for automated documentation updates
 */
export const config = {
  /**
   * Default paths for repositories
   */
  repositories: {
    docs: '/tmp/repos/docs',
    foundationUi: '/tmp/repos/foundation-ui'
  }
} as const;

export type Config = typeof config; 