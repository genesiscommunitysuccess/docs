#!/usr/bin/env node

import { rmSync, existsSync } from 'fs';
import { config } from '../config';

/**
 * Cleanup script to remove cloned repository directories
 * Uses centralized paths from config and works cross-platform
 */
function cleanupRepos(): void {
  console.log('🧹 Cleaning up repository directories...');
  
  const repoPaths = [
    config.repositories.docs,
    config.repositories.foundationUi
  ];

  let deletedCount = 0;
  let skippedCount = 0;

  for (const repoPath of repoPaths) {
    try {
      if (existsSync(repoPath)) {
        console.log(`🗑️  Deleting: ${repoPath}`);
        rmSync(repoPath, { recursive: true, force: true });
        console.log(`✅ Deleted: ${repoPath}`);
        deletedCount++;
      } else {
        console.log(`⏭️  Skipped (not found): ${repoPath}`);
        skippedCount++;
      }
    } catch (error) {
      console.log(`⚠️  Failed to delete ${repoPath}:`, error instanceof Error ? error.message : error);
      // Don't exit with error code - continue cleanup
    }
  }

  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   • Deleted: ${deletedCount} directories`);
  console.log(`   • Skipped: ${skippedCount} directories`);
  console.log(`✨ Cleanup completed successfully!`);
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupRepos();
} 