import { createFilesystemService } from './index';
import { Result } from '../../types/result';

/**
 * Test the filesystem service functionality
 */
async function testFilesystemService() {
  console.log("🧪 Testing Filesystem Service...\n");

  // Test with mock service
  console.log("1. Testing Mock Filesystem Service:");
  const mockFilesystemService = createFilesystemService({
    useMock: true,
    docsRepositoryPath: '/mock/docs/path',
    foundationUiRepositoryPath: '/mock/foundation-ui/path'
  });

  try {
    const mockResult = await mockFilesystemService.grepDocs('test');
    
    if (Result.isSuccess(mockResult)) {
      console.log(`✅ Mock grep successful - found ${mockResult.value.length} matches`);
      mockResult.value.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.filePath}:${result.lineNumber} - "${result.line}"`);
      });
    } else {
      console.log(`❌ Mock grep failed: ${mockResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with mock filesystem service:", error);
  }

  console.log("\n2. Testing Empty Search Pattern:");
  try {
    const emptyResult = await mockFilesystemService.grepDocs('');
    
    if (Result.isSuccess(emptyResult)) {
      console.log(`✅ Empty search successful - found ${emptyResult.value.length} matches`);
    } else {
      console.log(`❌ Empty search failed as expected: ${emptyResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with empty search:", error);
  }

  console.log("\n3. Testing Real Filesystem Service (if paths exist):");
  const realFilesystemService = createFilesystemService({
    useMock: false,
    docsRepositoryPath: '/Users/matt.walker/genesis/docs',
    foundationUiRepositoryPath: '/Users/matt.walker/genesis/foundation-ui'
  });

  try {
    const realResult = await realFilesystemService.grepDocs('README');
    
    if (Result.isSuccess(realResult)) {
      console.log(`✅ Real grep successful - found ${realResult.value.length} matches`);
      realResult.value.slice(0, 3).forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.filePath}:${result.lineNumber} - "${result.line.substring(0, 50)}..."`);
      });
      if (realResult.value.length > 3) {
        console.log(`   ... and ${realResult.value.length - 3} more matches`);
      }
    } else {
      console.log(`❌ Real grep failed: ${realResult.message.message}`);
      if (realResult.message.details) {
        console.log(`   Details: ${realResult.message.details}`);
      }
    }
  } catch (error) {
    console.error("❌ Error with real filesystem service:", error);
  }

  console.log("\n4. Testing readDocFile functionality:");
  try {
    // Test reading entire file
    const fullFileResult = await mockFilesystemService.readDocFile('test-file.md');
    if (Result.isSuccess(fullFileResult)) {
      const content = fullFileResult.value;
      console.log(`✅ Full file read successful:`);
      console.log(`   File: ${content.relativePath}`);
      console.log(`   Total lines: ${content.totalLines}`);
      console.log(`   Lines read: ${content.linesRead}`);
    } else {
      console.log(`❌ Full file read failed: ${fullFileResult.message.message}`);
    }

    // Test reading with offset and line count
    const partialResult = await mockFilesystemService.readDocFile('test-file.md', { lineCount: 5, offset: 10 });
    if (Result.isSuccess(partialResult)) {
      const content = partialResult.value;
      console.log(`✅ Partial file read successful:`);
      console.log(`   File: ${content.relativePath}`);
      console.log(`   Total lines: ${content.totalLines}`);
      console.log(`   Lines read: ${content.linesRead} (offset: ${content.offset})`);
      console.log(`   Content preview:`);
      content.lines.forEach((line, index) => {
        console.log(`   ${content.offset + index + 1}: ${line}`);
      });
    } else {
      console.log(`❌ Partial file read failed: ${partialResult.message.message}`);
    }

    // Test error cases
    const emptyPathResult = await mockFilesystemService.readDocFile('');
    if (Result.isSuccess(emptyPathResult)) {
      console.log(`✅ Empty path read successful (unexpected)`);
    } else {
      console.log(`❌ Empty path read failed as expected: ${emptyPathResult.message.message}`);
    }

    const invalidOffsetResult = await mockFilesystemService.readDocFile('test-file.md', { offset: -1 });
    if (Result.isSuccess(invalidOffsetResult)) {
      console.log(`✅ Invalid offset read successful (unexpected)`);
    } else {
      console.log(`❌ Invalid offset read failed as expected: ${invalidOffsetResult.message.message}`);
    }

  } catch (error) {
    console.error("❌ Error with readDocFile tests:", error);
  }

  console.log("\n5. Testing grep + readDocFile integration:");
  try {
    // First, search for files containing "test"
    const grepResult = await mockFilesystemService.grepDocs('test');
    if (Result.isSuccess(grepResult)) {
      console.log(`✅ Grep found ${grepResult.value.length} matches`);
      
      // Use the first result's filePath to read the file
      if (grepResult.value.length > 0) {
        const firstMatch = grepResult.value[0];
        console.log(`📖 Reading file from grep result: ${firstMatch.filePath}`);
        
        const readResult = await mockFilesystemService.readDocFile(firstMatch.filePath);
        if (Result.isSuccess(readResult)) {
          const content = readResult.value;
          console.log(`✅ Successfully read file from grep result:`);
          console.log(`   File: ${content.relativePath}`);
          console.log(`   Total lines: ${content.totalLines}`);
          console.log(`   Lines read: ${content.linesRead}`);
          console.log(`   Line ${firstMatch.lineNumber} content: "${firstMatch.line}"`);
        } else {
          console.log(`❌ Failed to read file from grep result: ${readResult.message.message}`);
        }
      }
    } else {
      console.log(`❌ Grep failed: ${grepResult.message.message}`);
    }
  } catch (error) {
    console.error("❌ Error with grep + readDocFile integration test:", error);
  }

  console.log("\n✅ Filesystem Service Tests Complete!");
}

// Run the test if this file is executed directly
if (require.main === module) {
  testFilesystemService().catch(console.error);
} 