import { createFileEditingService } from './index';
import { Result } from '../../types/result';
import { RepositoryType } from '../../repositories/git/types';
import { createGitService } from '../git-service';

/**
 * Test the file editing service functionality
 */
async function testFileEditingService() {
  console.log("🧪 Testing File Editing Service...\n");

  const mockConfig = {
    useMock: true,
    docsRepositoryPath: '/mock/docs/path',
    foundationUiRepositoryPath: '/mock/foundation-ui/path',
    createBackups: true,
    backupDirectory: '.backups'
  };

  const mockCommitInfo = {
    hash: 'abc12345',
    author: 'Test Author',
    authorEmail: 'test@example.com',
    date: new Date('2024-01-15T10:30:00Z'),
    message: 'feat: add new authentication system',
    filesChanged: ['src/auth.ts', 'src/types.ts'],
    diffs: [
      {
        filePath: 'src/auth.ts',
        changeType: 'added' as const,
        diff: '@@ -0,0 +1,50 @@\n+export class AuthService {\n+  // ...\n+}',
        linesAdded: 50,
        linesDeleted: 0
      }
    ],
    repositoryType: RepositoryType.FOUNDATION_UI
  };

  // Create mock git service for testing
  const mockGitService = createGitService({ 
    useMock: true,
    docsRepositoryPath: '/mock/docs',
    foundationUiRepositoryPath: '/mock/foundation-ui'
  });

  // Test with mock service
  console.log("1. Testing Mock File Editing Service:");
  const mockFileEditingService = createFileEditingService(mockConfig);

  try {
    const mockResult = await mockFileEditingService.updateDocFile(
      'test-file.md',
      mockCommitInfo,
      'Add documentation for the new authentication system',
      mockGitService
    );
    
    if (Result.isSuccess(mockResult)) {
      const update = mockResult.value;
      console.log(`✅ Mock file editing successful:`);
      console.log(`   File: ${update.filePath}`);
      console.log(`   Full path: ${update.fullPath}`);
      console.log(`   Lines changed: ${update.linesChanged}`);
      console.log(`   Backup created: ${update.backupPath ? 'Yes' : 'No'}`);
      console.log(`   Timestamp: ${update.timestamp.toISOString()}`);
      console.log(`   Content preview (first 200 chars):`);
      console.log(`   "${update.newContent.substring(0, 200)}..."`);
    } else {
      console.log(`❌ Mock file editing failed: ${mockResult.message.message}`);
      console.log(`   Type: ${mockResult.message.type}`);
      if (mockResult.message.details) {
        console.log(`   Details: ${mockResult.message.details}`);
      }
    }
  } catch (error) {
    console.error("❌ Error with mock file editing service:", error);
  }

  console.log("\n2. Testing File Path Validation:");
  try {
    const invalidPathResult = await mockFileEditingService.updateDocFile(
      '../invalid-path.md',
      mockCommitInfo,
      'Test instructions',
      mockGitService
    );
    
    if (Result.isError(invalidPathResult)) {
      console.log(`✅ Invalid path validation working: ${invalidPathResult.message.message}`);
      console.log(`   Type: ${invalidPathResult.message.type}`);
    } else {
      console.log(`❌ Invalid path should have failed`);
    }
  } catch (error) {
    console.error("❌ Error with path validation test:", error);
  }

  console.log("\n3. Testing Empty File Path:");
  try {
    const emptyPathResult = await mockFileEditingService.updateDocFile(
      '',
      mockCommitInfo,
      'Test instructions',
      mockGitService
    );
    
    if (Result.isError(emptyPathResult)) {
      console.log(`✅ Empty path validation working: ${emptyPathResult.message.message}`);
      console.log(`   Type: ${emptyPathResult.message.type}`);
    } else {
      console.log(`❌ Empty path should have failed`);
    }
  } catch (error) {
    console.error("❌ Error with empty path test:", error);
  }

  console.log("\n4. Testing Non-existent Files:");
  try {
    const nonExistentResult = await mockFileEditingService.updateDocFile(
      'non-existent.txt',
      mockCommitInfo,
      'Test instructions',
      mockGitService
    );
    
    if (Result.isError(nonExistentResult)) {
      console.log(`✅ Non-existent file validation working: ${nonExistentResult.message.message}`);
      console.log(`   Type: ${nonExistentResult.message.type}`);
    } else {
      console.log(`❌ Non-existent file should have failed`);
    }
  } catch (error) {
    console.error("❌ Error with non-existent file test:", error);
  }

  console.log("\n5. Testing Backup Creation:");
  try {
    const backupResult = await mockFileEditingService.updateDocFile(
      'test-file.md',
      mockCommitInfo,
      'Test backup functionality',
      mockGitService
    );
    
    if (Result.isSuccess(backupResult)) {
      const update = backupResult.value;
      console.log(`✅ Backup creation working:`);
      console.log(`   Backup path: ${update.backupPath}`);
      console.log(`   Backup enabled: ${update.backupPath ? 'Yes' : 'No'}`);
    } else {
      console.log(`❌ Backup creation failed: ${backupResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with backup test:", error);
  }

  console.log("\n6. Testing Content Generation:");
  try {
    const contentResult = await mockFileEditingService.updateDocFile(
      'test-file.md',
      mockCommitInfo,
      'Add comprehensive documentation for authentication',
      mockGitService
    );
    
    if (Result.isSuccess(contentResult)) {
      const update = contentResult.value;
      const content = update.newContent;
      console.log(`✅ Content generation working:`);
      console.log(`   Contains commit hash: ${content.includes('abc12345')}`);
      console.log(`   Contains commit message: ${content.includes('feat: add new authentication system')}`);
      console.log(`   Contains update instructions: ${content.includes('Add comprehensive documentation for authentication')}`);
      console.log(`   Contains AI marker: ${content.includes('AI-Generated Update')}`);
    } else {
      console.log(`❌ Content generation failed: ${contentResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with content generation test:", error);
  }
}

// Export for use in other test files
export { testFileEditingService }; 