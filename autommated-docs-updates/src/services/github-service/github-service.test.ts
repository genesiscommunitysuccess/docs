import { createGitHubService } from './index';
import { Result } from '../../types/result';

/**
 * Test function for GitHub service functionality
 * 
 * This function tests the GitHub service with both mock and real implementations.
 * It demonstrates how to use the service and validates its functionality.
 */
export async function testGitHubService(): Promise<void> {
  console.log('\n🧪 Testing GitHub Service...');

  // Test with mock implementation
  console.log('\n🔧 Testing with mock GitHub service...');
  await testMockGitHubService();

  // Test with real implementation (if API token is available)
  console.log('\n🔧 Testing with real GitHub service...');
  await testRealGitHubService();
}

/**
 * Tests the mock GitHub service implementation
 */
async function testMockGitHubService(): Promise<void> {
  try {
    const mockGitHubService = createGitHubService({
      useMock: true,
      owner: 'test-owner',
      repo: 'test-repo'
    });

    console.log('✅ Mock GitHub service created successfully');

    // Test configuration validation
    console.log('\n🔍 Testing configuration validation...');
    const validationResult = await mockGitHubService.validateConfiguration();
    if (Result.isSuccess(validationResult)) {
      console.log('✅ Configuration validation successful');
    } else {
      console.error(`❌ Configuration validation failed: ${validationResult.message.message}`);
    }

    // Test branch existence check
    console.log('\n🔍 Testing branch existence check...');
    const branchExistsResult = await mockGitHubService.branchExists('main');
    if (Result.isSuccess(branchExistsResult)) {
      console.log(`✅ Branch existence check successful: ${branchExistsResult.value}`);
    } else {
      console.error(`❌ Branch existence check failed: ${branchExistsResult.message.message}`);
    }

    // Test pull request creation
    console.log('\n🔍 Testing pull request creation...');
    const createPRResult = await mockGitHubService.createPullRequest(
      'Test Pull Request',
      'This is a test pull request created by the automated docs updates script.',
      'feature/test-branch',
      'main',
      {
        draft: false, // This will be ignored - always creates as draft for safety
        labels: ['documentation', 'test'],
        assignees: ['test-user']
      }
    );

    if (Result.isSuccess(createPRResult)) {
      const pr = createPRResult.value;
      console.log(`✅ Pull request created successfully: #${pr.number} - ${pr.title}`);
      console.log(`   URL: ${pr.url}`);
      console.log(`   Head: ${pr.head} -> Base: ${pr.base}`);
      console.log(`   Draft: ${pr.draft} (always true for safety)`);
      console.log(`   Labels: ${pr.labels.join(', ')}`);
      console.log(`   Assignees: ${pr.assignees.join(', ')}`);

      // Test getting the pull request
      console.log('\n🔍 Testing pull request retrieval...');
      const getPRResult = await mockGitHubService.getPullRequest(pr.number);
      if (Result.isSuccess(getPRResult)) {
        console.log(`✅ Pull request retrieved successfully: #${getPRResult.value.number}`);
      } else {
        console.error(`❌ Pull request retrieval failed: ${getPRResult.message.message}`);
      }

      // Test updating the pull request
      console.log('\n🔍 Testing pull request update...');
      const updatePRResult = await mockGitHubService.updatePullRequest(pr.number, {
        title: 'Updated Test Pull Request',
        labels: ['documentation', 'test', 'updated']
      });

      if (Result.isSuccess(updatePRResult)) {
        console.log(`✅ Pull request updated successfully: #${updatePRResult.value.number}`);
        console.log(`   New title: ${updatePRResult.value.title}`);
        console.log(`   New labels: ${updatePRResult.value.labels.join(', ')}`);
      } else {
        console.error(`❌ Pull request update failed: ${updatePRResult.message.message}`);
      }

    } else {
      console.error(`❌ Pull request creation failed: ${createPRResult.message.message}`);
    }

    // Test error handling with non-existent branch
    console.log('\n🔍 Testing error handling with non-existent branch...');
    const nonExistentBranchResult = await mockGitHubService.createPullRequest(
      'Test PR with Non-existent Branch',
      'This should fail.',
      'non-existent-branch',
      'main'
    );

    if (Result.isError(nonExistentBranchResult)) {
      console.log(`✅ Error handling working correctly: ${nonExistentBranchResult.message.message}`);
    } else {
      console.error('❌ Error handling failed - should have returned an error');
    }

  } catch (error) {
    console.error('❌ Mock GitHub service test failed:', error);
  }
}

/**
 * Tests the real GitHub service implementation
 */
async function testRealGitHubService(): Promise<void> {
  try {
    // Check if GitHub API token is available
    const apiToken = process.env.GITHUB_API_TOKEN;
    if (!apiToken) {
      console.log('⏭️ Skipping real GitHub service test - GITHUB_API_TOKEN not set');
      console.log('💡 To test with real GitHub API:');
      console.log('   1. Set the GITHUB_API_TOKEN environment variable');
      console.log('   2. Set the GITHUB_OWNER environment variable (defaults to genesiscommunitysuccess)');
      console.log('   3. Set the GITHUB_REPO environment variable (defaults to docs)');
      return;
    }

    const realGitHubService = createGitHubService({
      useMock: false,
      apiToken,
      owner: process.env.GITHUB_OWNER || 'genesiscommunitysuccess',
      repo: process.env.GITHUB_REPO || 'docs'
    });

    console.log('✅ Real GitHub service created successfully');

    // Test configuration validation
    console.log('\n🔍 Testing configuration validation...');
    const validationResult = await realGitHubService.validateConfiguration();
    if (Result.isSuccess(validationResult)) {
      console.log('✅ Configuration validation successful');
    } else {
      console.error(`❌ Configuration validation failed: ${validationResult.message.message}`);
      console.log('💡 This might be due to:');
      console.log('   - Invalid API token');
      console.log('   - Repository not found or access denied');
      console.log('   - Network connectivity issues');
      return;
    }

    // Test branch existence check
    console.log('\n🔍 Testing branch existence check...');
    const branchExistsResult = await realGitHubService.branchExists('preprod');
    if (Result.isSuccess(branchExistsResult)) {
      console.log(`✅ Branch existence check successful: preprod branch ${branchExistsResult.value ? 'exists' : 'does not exist'}`);
    } else {
      console.error(`❌ Branch existence check failed: ${branchExistsResult.message.message}`);
    }

    console.log('\n✅ Real GitHub service test completed successfully');

  } catch (error) {
    console.error('❌ Real GitHub service test failed:', error);
    
    if (error instanceof Error && error.message.includes('GITHUB_API_TOKEN')) {
      console.log('\n💡 To fix this error:');
      console.log('   1. Set the GITHUB_API_TOKEN environment variable');
      console.log('   2. Ensure the token has appropriate permissions for the repository');
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGitHubService().catch(console.error);
} 