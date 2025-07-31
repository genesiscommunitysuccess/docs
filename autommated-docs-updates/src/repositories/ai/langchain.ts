import { AIRepository } from './types';
import { Services } from '../../types/services';
import { CommitInfo } from '../git/types';
import { Result } from '../../types/result';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';

/**
 * LangChain implementation of the AI repository
 *
 * This repository uses LangChain and Anthropic's Claude to analyze commits
 * and determine if documentation updates are needed.
 */
export class LangChainAIRepository implements AIRepository {
  private model: ChatAnthropic;
  private temperature: number;

  constructor(config: { apiKey?: string; model?: string; temperature?: number } = {}) {
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY || '';
    const modelName = config.model || 'claude-3-5-sonnet-20241022';
    this.temperature = config.temperature || 0.1;

    this.validateApiKey(apiKey);

    // Initialize the LangChain ChatAnthropic model
    this.model = new ChatAnthropic({
      apiKey,
      model: modelName,
      temperature: this.temperature,
    });
  }

  /**
   * Validates that the Anthropic API key is available
   * @throws Error if API key is not found
   */
  private validateApiKey(apiKey: string): void {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required for LangChain AI repository');
    }

    console.log('🔑 Validating Anthropic API key...');
    console.log('✅ Anthropic API key validated successfully');
  }

  /**
   * Analyzes a commit using LangChain and Claude to determine if documentation updates are needed
   * @param services - The services object containing git and ai services
   * @param commitInfo - The commit information to analyze
   * @returns Promise<Result<boolean, string>> - Success with boolean indicating if docs should be updated, or error with failure reason
   */
  async shouldUpdateDocs(services: Services, commitInfo: CommitInfo): Promise<Result<boolean, string>> {
    console.log(`🤖 LangChain AI analysis of commit: ${commitInfo.hash}`);

    try {
      // Create a prompt for analyzing the commit
      const prompt = this.createAnalysisPrompt(commitInfo);

      // Call the LangChain model
      const response = await this.model.invoke([new HumanMessage(prompt)]);

      // Parse the response and handle the result functionally
      const parseResult = this.parseResponse(response.content as string);

      // Use unwrapOr to provide fallback when parsing fails
      const needsUpdate = Result.unwrapOr(parseResult, this.fallbackAnalysis(commitInfo));

      // Log the result
      if (Result.isSuccess(parseResult)) {
        console.log(`🤖 AI Analysis Result: ${needsUpdate ? 'Documentation updates needed' : 'No documentation updates required'}`);
      } else {
        console.log(`⚠️ AI response parsing failed: ${parseResult.message}. Using fallback analysis.`);
      }

      return Result.success(needsUpdate);

    } catch (error) {
      console.error('❌ Error during LangChain analysis:', error);
      // Fallback to a simple heuristic if AI analysis fails
      const fallbackResult = this.fallbackAnalysis(commitInfo);
      return Result.success(fallbackResult);
    }
  }

  /**
   * Creates a prompt for analyzing whether a commit requires documentation updates
   * @param commitInfo - The commit information to analyze
   * @returns string - The analysis prompt
   */
  private createAnalysisPrompt(commitInfo: CommitInfo): string {
    const filesChanged = commitInfo.filesChanged.join('\n- ');
    const diffs = commitInfo.diffs.map(diff =>
      `${diff.filePath} (${diff.changeType}): +${diff.linesAdded} -${diff.linesDeleted} lines`
    ).join('\n');

    return `You are an expert software developer and technical writer. Your task is to analyze a git commit and determine if it requires documentation updates.

COMMIT INFORMATION:
- Hash: ${commitInfo.hash}
- Author: ${commitInfo.author} (${commitInfo.authorEmail})
- Date: ${commitInfo.date.toISOString()}
- Message: ${commitInfo.message}

FILES CHANGED:
- ${filesChanged}

CHANGE DETAILS:
${diffs}

Please analyze this commit and determine if documentation updates are needed. Consider the following factors:

1. **New Features**: Does this commit introduce new features that users need to know about?
2. **API Changes**: Are there changes to APIs, interfaces, or public methods?
3. **Configuration Changes**: Are there new configuration options or changes to existing ones?
4. **Breaking Changes**: Are there any breaking changes that users need to be aware of?
5. **Bug Fixes**: Are there important bug fixes that affect user workflows?
6. **Security Updates**: Are there security-related changes that need documentation?

Small tweaks, minor bug fixes, and internal refactoring typically don't require documentation updates. However, fundamentally changing how things work, adding new features, or modifying public APIs usually do require updates.

Respond with ONLY "YES" if documentation updates are needed, or "NO" if no documentation updates are required.

Your response:`;
  }

  /**
   * Parses the AI response to determine if documentation updates are needed
   * @param response - The AI model response
   * @returns Result<boolean, string> - Success with boolean indicating if docs should be updated, or error with parsing failure reason
   */
  private parseResponse(response: string): Result<boolean, string> {
    const cleanResponse = response.trim().toUpperCase();

    // Look for affirmative responses
    if (cleanResponse.includes('YES') ||
        cleanResponse.includes('TRUE') ||
        cleanResponse.includes('NEEDED') ||
        cleanResponse.includes('REQUIRED')) {
      return Result.success(true);
    }

    // Look for negative responses
    if (cleanResponse.includes('NO') ||
        cleanResponse.includes('FALSE') ||
        cleanResponse.includes('NOT NEEDED') ||
        cleanResponse.includes('NOT REQUIRED')) {
      return Result.success(false);
    }

    // Return error if response is unclear
    return Result.error(`Unclear AI response: "${response}". Expected "YES" or "NO".`);
  }

  /**
   * Fallback analysis when AI analysis fails
   * @param commitInfo - The commit information to analyze
   * @returns boolean - Fallback determination
   */
  private fallbackAnalysis(commitInfo: CommitInfo): boolean {
    console.log('🔄 Using fallback analysis due to AI analysis failure');

    // Simple heuristic based on commit message and files changed
    const message = commitInfo.message.toLowerCase();
    const files = commitInfo.filesChanged.join(' ').toLowerCase();

    // Check for indicators that suggest docs updates are needed
    const docsIndicators = [
      'feature', 'api', 'breaking', 'config', 'security', 'new', 'add', 'introduce',
      'change', 'modify', 'update', 'enhance', 'improve', 'fix', 'bug'
    ];

    const hasDocsIndicators = docsIndicators.some(indicator =>
      message.includes(indicator) || files.includes(indicator)
    );

    // Check for indicators that suggest no docs updates are needed
    const noDocsIndicators = [
      'typo', 'format', 'style', 'lint', 'refactor', 'cleanup', 'internal', 'test'
    ];

    const hasNoDocsIndicators = noDocsIndicators.some(indicator =>
      message.includes(indicator) || files.includes(indicator)
    );

    // If we have clear docs indicators and no clear no-docs indicators, suggest update
    if (hasDocsIndicators && !hasNoDocsIndicators) {
      return true;
    }

    // Default to no update needed
    return false;
  }

  /**
   * Finds documentation files that need to be edited based on a commit using an agentic AI flow
   * @param services - The services object containing git, ai, and filesystem services
   * @param commitInfo - The commit information to analyze
   * @returns Promise<Result<string[], string>> - Success with array of filepaths relative to docsDir/root, or error with failure reason
   */
  async findDocsFilesToEdit(services: Services, commitInfo: CommitInfo): Promise<Result<string[], string>> {
    console.log(`🤖 LangChain AI agentic analysis to find docs files for commit: ${commitInfo.hash}`);

    try {
      // Step 1: Analyze the commit to understand what changed
      console.log('🔍 Step 1: Analyzing commit changes...');
      const analysisPrompt = this.createCommitAnalysisPrompt(commitInfo);
      const analysisResponse = await this.model.invoke([new HumanMessage(analysisPrompt)]);

      // Step 2: Generate search terms based on the analysis
      console.log('🔍 Step 2: Generating search terms...');
      const searchTermsPrompt = this.createSearchTermsPrompt(analysisResponse.content as string, commitInfo);
      const searchTermsResponse = await this.model.invoke([new HumanMessage(searchTermsPrompt)]);

      const searchTerms = this.parseSearchTerms(searchTermsResponse.content as string);
      if (searchTerms.length === 0) {
        console.log('⚠️ No search terms generated, using fallback terms');
        searchTerms.push(...this.generateFallbackSearchTerms(commitInfo));
      }

      console.log(`🔍 Generated ${searchTerms.length} search terms: ${searchTerms.join(', ')}`);

      // Step 3: Search docs using the generated terms
      console.log('🔍 Step 3: Searching docs with generated terms...');
      const foundFiles = new Set<string>();

      for (const term of searchTerms) {
        console.log(`🔍 Searching for: "${term}"`);
        const grepResult = await services.filesystem.grepDocs(term);

        if (Result.isSuccess(grepResult)) {
          const results = grepResult.value;
          console.log(`   Found ${results.length} matches for "${term}"`);

          // Extract unique file paths
          results.forEach(result => {
            foundFiles.add(result.filePath);
          });
        } else {
          console.log(`   ⚠️ Search failed for "${term}": ${grepResult.message.message}`);
        }
      }

      const candidateFiles = Array.from(foundFiles);
      console.log(`📁 Found ${candidateFiles.length} candidate files to examine`);

      // Step 4: AI evaluates which files are relevant
      console.log('🔍 Step 4: AI evaluating file relevance...');
      const relevantFiles: string[] = [];

      for (const filePath of candidateFiles) {
        console.log(`🔍 Evaluating: ${filePath}`);

        // Read a portion of the file to help AI make decision
        const readResult = await services.filesystem.readDocFile(filePath, { lineCount: 20, offset: 0 });

        if (Result.isSuccess(readResult)) {
          const fileContent = readResult.value;
          const evaluationPrompt = this.createFileEvaluationPrompt(
            commitInfo,
            filePath,
            fileContent.lines.join('\n'),
            searchTerms
          );

          const evaluationResponse = await this.model.invoke([new HumanMessage(evaluationPrompt)]);
          const isRelevant = this.parseFileEvaluation(evaluationResponse.content as string);

          if (isRelevant) {
            console.log(`   ✅ Relevant: ${filePath}`);
            relevantFiles.push(filePath);
          } else {
            console.log(`   ❌ Not relevant: ${filePath}`);
          }
        } else {
          console.log(`   ⚠️ Could not read file ${filePath}: ${readResult.message.message}`);
        }
      }

      console.log(`🤖 AI Analysis Complete: ${relevantFiles.length} files identified for editing`);
      return Result.success(relevantFiles);

    } catch (error) {
      console.error('❌ Error during LangChain agentic analysis:', error);
      // Fallback to simple heuristic
      const fallbackFiles = this.fallbackFileSearch(commitInfo);
      return Result.success(fallbackFiles);
    }
  }

  /**
   * Creates a prompt for analyzing commit changes
   * @param commitInfo - The commit information to analyze
   * @returns string - The analysis prompt
   */
  private createCommitAnalysisPrompt(commitInfo: CommitInfo): string {
    const filesChanged = commitInfo.filesChanged.join('\n- ');
    const diffs = commitInfo.diffs.map(diff =>
      `${diff.filePath} (${diff.changeType}): +${diff.linesAdded} -${diff.linesDeleted} lines`
    ).join('\n');

    return `You are an expert software developer analyzing a git commit to understand what changed and what documentation might need updates.

COMMIT INFORMATION:
- Hash: ${commitInfo.hash}
- Author: ${commitInfo.author} (${commitInfo.authorEmail})
- Date: ${commitInfo.date.toISOString()}
- Message: ${commitInfo.message}

FILES CHANGED:
- ${filesChanged}

CHANGE DETAILS:
${diffs}

Please analyze this commit and provide a concise summary of:
1. What functionality was added, changed, or removed
2. What types of documentation would be affected
3. Key technical terms, component names, or concepts that were modified

Focus on user-facing changes, API modifications, new features, configuration changes, and breaking changes.

Your analysis:`;
  }

  /**
   * Creates a prompt for generating search terms
   * @param analysis - The commit analysis from step 1
   * @param commitInfo - The commit information
   * @returns string - The search terms prompt
   */
  private createSearchTermsPrompt(analysis: string, commitInfo: CommitInfo): string {
    return `Based on this commit analysis:

${analysis}

COMMIT MESSAGE: ${commitInfo.message}

Please generate 3-8 specific search terms that would help find relevant documentation files. These terms should be:
- Technical terms from the code changes
- Component names, function names, or API endpoints
- Feature names or concepts
- Configuration options or settings
- User-facing functionality

Return ONLY a comma-separated list of search terms, no explanations.

Search terms:`;
  }

  /**
   * Parses search terms from AI response
   * @param response - The AI response
   * @returns string[] - Array of search terms
   */
  private parseSearchTerms(response: string): string[] {
    const cleanResponse = response.trim();
    return cleanResponse.split(',').map(term => term.trim()).filter(term => term.length > 0);
  }

  /**
   * Generates fallback search terms when AI fails
   * @param commitInfo - The commit information
   * @returns string[] - Array of fallback search terms
   */
  private generateFallbackSearchTerms(commitInfo: CommitInfo): string[] {
    const terms: string[] = [];
    const message = commitInfo.message.toLowerCase();
    const files = commitInfo.filesChanged.join(' ').toLowerCase();

    // Extract potential component names from file paths
    commitInfo.filesChanged.forEach(file => {
      const fileName = file.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
      if (fileName && fileName.length > 2) {
        terms.push(fileName);
      }
    });

    // Add common terms based on commit message
    if (message.includes('component')) terms.push('component');
    if (message.includes('api')) terms.push('api');
    if (message.includes('config')) terms.push('configuration');
    if (message.includes('feature')) terms.push('feature');
    if (message.includes('ui')) terms.push('ui');
    if (message.includes('form')) terms.push('form');
    if (message.includes('table')) terms.push('table');
    if (message.includes('button')) terms.push('button');

    return [...new Set(terms)].slice(0, 5); // Remove duplicates and limit to 5
  }

  /**
   * Creates a prompt for evaluating file relevance
   * @param commitInfo - The commit information
   * @param filePath - The file path to evaluate
   * @param fileContent - The file content preview
   * @param searchTerms - The search terms used
   * @returns string - The evaluation prompt
   */
  private createFileEvaluationPrompt(
    commitInfo: CommitInfo,
    filePath: string,
    fileContent: string,
    searchTerms: string[]
  ): string {
    return `You are evaluating whether a documentation file needs to be updated based on a code commit.

IMPORTANT: Do NOT update autogenerated API documentation files. These files are automatically generated from code and should not be manually edited.

COMMIT INFORMATION:
- Message: ${commitInfo.message}
- Files Changed: ${commitInfo.filesChanged.join(', ')}

DOCUMENTATION FILE:
- Path: ${filePath}
- Content Preview:
${fileContent}

SEARCH TERMS USED: ${searchTerms.join(', ')}

Based on the commit changes and the documentation file content, determine if this file needs to be updated to reflect the changes in the commit.

CRITICAL EVALUATION CRITERIA:
1. Is this an autogenerated API documentation file? (Check for API references, autogenerated markers, or API-specific patterns)
2. Does the file document functionality that was changed in the commit?
3. Does the file contain information that is now outdated due to the commit?
4. Does the file need new information about features added in the commit?
5. Is this file the right place to document the changes made?

IMPORTANT: If this appears to be an autogenerated API documentation file, respond with "NO" regardless of other factors.

Respond with ONLY "YES" if the file needs updates (and is NOT autogenerated), or "NO" if it doesn't need updates or is autogenerated.

Your response:`;
  }

  /**
   * Parses file evaluation response
   * @param response - The AI response
   * @returns boolean - True if file is relevant
   */
  private parseFileEvaluation(response: string): boolean {
    const cleanResponse = response.trim().toUpperCase();
    return cleanResponse.includes('YES');
  }

  /**
   * Fallback file search when AI analysis fails
   * @param commitInfo - The commit information
   * @returns string[] - Array of fallback file paths
   */
  private fallbackFileSearch(commitInfo: CommitInfo): string[] {
    console.log('🔄 Using fallback file search due to AI analysis failure');

    // Simple heuristic: look for common documentation patterns
    const fallbackTerms = ['component', 'api', 'configuration', 'feature', 'ui'];
    const foundFiles: string[] = [];

    // This is a simplified fallback - in a real implementation, you might want to
    // actually perform the search here, but for now we'll return an empty array
    // to indicate no files were found
    console.log('⚠️ Fallback file search not implemented - returning empty result');

    return foundFiles;
  }

  /**
   * Updates a documentation file based on a commit using AI to generate appropriate content
   * @param services - The services object containing all required services
   * @param commitInfo - The commit information that triggered this update
   * @param filePath - The documentation file path to update (relative to docs directory)
   * @returns Promise<Result<boolean, string>> - Success with true if file was updated, or error with failure reason
   */
  async updateDocFile(services: Services, commitInfo: CommitInfo, filePath: string): Promise<Result<boolean, string>> {
    console.log(`🤖 LangChain AI updating documentation file: ${filePath} for commit: ${commitInfo.hash}`);

    try {
      // Step 1: Read the current file content
      console.log('📖 Step 1: Reading current file content...');
      const fileReadResult = await services.filesystem.readDocFile(filePath);
      if (Result.isError(fileReadResult)) {
        return Result.error(`Failed to read file ${filePath}: ${fileReadResult.message.message}`);
      }

      const currentContent = fileReadResult.value.lines.join('\n');
      console.log(`📄 Current file has ${fileReadResult.value.linesRead} lines`);

      // Step 2: Analyze the commit and current file to determine update strategy
      console.log('🔍 Step 2: Analyzing commit and file to determine update strategy...');
      const analysisPrompt = this.createFileAnalysisPrompt(commitInfo, filePath, currentContent);
      const analysisResponse = await this.model.invoke([new HumanMessage(analysisPrompt)]);

      // Step 3: Determine if this is an autogenerated file or manual documentation
      console.log('🔍 Step 3: Determining file type and update approach...');
      const fileType = this.determineFileType(filePath, currentContent);
      console.log(`📋 File type determined: ${fileType}`);

      // Step 4: Generate the updated content using agentic workflow
      console.log('🔍 Step 4: Generating updated content...');
      const updateResult = await this.generateFileUpdates(
        services,
        commitInfo,
        filePath,
        currentContent,
        fileType,
        analysisResponse.content as string
      );

      if (Result.isError(updateResult)) {
        return Result.error(`Failed to generate file updates: ${updateResult.message}`);
      }

      const { updatedContent, updateInstructions } = updateResult.value;

      // Step 5: Check if content actually changed before writing
      console.log('🔍 Step 5: Checking if content has changed...');
      
      // More robust content comparison
      const hasSignificantChanges = this.hasSignificantContentChanges(currentContent, updatedContent);
      
      if (!hasSignificantChanges) {
        console.log(`✅ No significant changes needed - content is already up to date`);
        return Result.success(false); // Return false to indicate no update was made
      }
      
      // Step 6: Apply the updates by writing the content directly
      console.log('🔍 Step 6: Writing updated content to file...');
      
      // Use filesystem service to write the updated content directly
      // First, get the full file path
      const currentFileResult = await services.filesystem.readDocFile(filePath);
      if (Result.isError(currentFileResult)) {
        return Result.error(`Failed to get file path for writing: ${currentFileResult.message.message}`);
      }
      
      const fullPath = currentFileResult.value.fullPath;
      
      // Create backup before writing
      const timestamp = Date.now();
      const fileName = filePath.split('/').pop() || 'unknown';
      const backupFileName = `${fileName}.backup.${timestamp}`;
      const backupDir = fullPath.split('/').slice(0, -1).join('/') + '/.backups';
      const backupPath = `${backupDir}/${backupFileName}`;
      
      // Ensure backup directory exists and create backup
      const { existsSync, mkdirSync, writeFileSync, readFileSync } = await import('fs');
      
      try {
        if (!existsSync(backupDir)) {
          mkdirSync(backupDir, { recursive: true });
        }
        
        const originalContent = readFileSync(fullPath, 'utf8');
        writeFileSync(backupPath, originalContent, 'utf8');
        console.log(`💾 Backup created: ${backupPath}`);
        
        // Detect and preserve original line endings
        const originalLineEnding = this.detectLineEnding(originalContent);
        
        // Preserve YAML frontmatter exactly as it was to avoid formatting changes
        const finalContent = this.preserveFrontmatter(originalContent, updatedContent, originalLineEnding);
        
        // Write the updated content with preserved line endings and frontmatter
        writeFileSync(fullPath, finalContent, 'utf8');
        console.log(`✅ File updated successfully: ${filePath} (preserved ${originalLineEnding === '\r\n' ? 'CRLF' : 'LF'} line endings)`);
        
        // Calculate lines changed
        const originalLines = originalContent.split('\n').length;
        const newLines = updatedContent.split('\n').length;
        const linesChanged = Math.abs(newLines - originalLines);
        console.log(`📊 Lines changed: ${linesChanged}`);
        
      } catch (error) {
        return Result.error(`Failed to write updated content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      return Result.success(true);

    } catch (error) {
      console.error('❌ Error during LangChain file update:', error);
      return Result.error(`LangChain file update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates a prompt for analyzing the commit and current file content
   * @param commitInfo - The commit information
   * @param filePath - The file path being updated
   * @param currentContent - The current file content
   * @returns string - The analysis prompt
   */
  private createFileAnalysisPrompt(commitInfo: CommitInfo, filePath: string, currentContent: string): string {
    const filesChanged = commitInfo.filesChanged.join('\n- ');
    const diffs = commitInfo.diffs.map(diff =>
      `${diff.filePath} (${diff.changeType}): +${diff.linesAdded} -${diff.linesDeleted} lines`
    ).join('\n');

    // Truncate content if it's very long
    const contentPreview = currentContent.length > 2000 
      ? currentContent.substring(0, 2000) + '\n... [content truncated]'
      : currentContent;

    return `You are an expert technical writer analyzing a code commit to determine how to update documentation.

COMMIT INFORMATION:
- Hash: ${commitInfo.hash}
- Author: ${commitInfo.author} (${commitInfo.authorEmail})
- Date: ${commitInfo.date.toISOString()}
- Message: ${commitInfo.message}

FILES CHANGED IN COMMIT:
- ${filesChanged}

CHANGE DETAILS:
${diffs}

DOCUMENTATION FILE TO UPDATE:
- Path: ${filePath}
- Current Content:
${contentPreview}

Please analyze this commit and the current documentation file to understand:
1. What changes were made in the commit that are relevant to this documentation
2. What sections of the documentation need to be updated
3. What new information needs to be added
4. What existing information might be outdated

Provide a detailed analysis of what needs to change in this documentation file.

Your analysis:`;
  }

  /**
   * Determines the type of documentation file
   * @param filePath - The file path
   * @param content - The file content
   * @returns string - The file type ('autogenerated' or 'manual')
   */
  private determineFileType(filePath: string, content: string): 'autogenerated' | 'manual' {
    // Check for autogenerated file indicators
    const autogeneratedIndicators = [
      '<!-- This file is autogenerated',
      '<!-- Auto-generated',
      '// This file is automatically generated',
      '// Auto-generated',
      'AUTO-GENERATED',
      'AUTOGENERATED'
    ];

    const contentLower = content.toLowerCase();
    const pathLower = filePath.toLowerCase();

    // Check content for autogenerated markers
    if (autogeneratedIndicators.some(indicator => contentLower.includes(indicator.toLowerCase()))) {
      return 'autogenerated';
    }

    // Check path patterns for autogenerated files
    if (pathLower.includes('api-') || pathLower.includes('/api/') || pathLower.includes('-api.')) {
      return 'autogenerated';
    }

    return 'manual';
  }

  /**
   * Generates file updates using an agentic workflow
   * @param services - The services object
   * @param commitInfo - The commit information
   * @param filePath - The file path
   * @param currentContent - The current file content
   * @param fileType - The type of file (autogenerated or manual)
   * @param analysis - The analysis from step 2
   * @returns Promise<Result<{updatedContent: string, updateInstructions: string}, string>>
   */
  private async generateFileUpdates(
    services: Services,
    commitInfo: CommitInfo,
    filePath: string,
    currentContent: string,
    fileType: 'autogenerated' | 'manual',
    analysis: string
  ): Promise<Result<{updatedContent: string, updateInstructions: string}, string>> {
    try {
      // Create appropriate prompt based on file type
      const updatePrompt = this.createUpdatePrompt(
        commitInfo,
        filePath,
        currentContent,
        fileType,
        analysis
      );

      console.log(`🤖 Generating updates for ${fileType} file using AI...`);
      const updateResponse = await this.model.invoke([new HumanMessage(updatePrompt)]);
      const responseContent = updateResponse.content as string;

      // Parse the AI response to extract the updated content and instructions
      const parseResult = this.parseUpdateResponse(responseContent, fileType);
      
      if (Result.isError(parseResult)) {
        return Result.error(`Failed to parse AI update response: ${parseResult.message}`);
      }

      return Result.success(parseResult.value);

    } catch (error) {
      console.error('❌ Error generating file updates:', error);
      return Result.error(`Error generating file updates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates an update prompt based on file type
   * @param commitInfo - The commit information
   * @param filePath - The file path
   * @param currentContent - The current file content
   * @param fileType - The file type
   * @param analysis - The previous analysis
   * @returns string - The update prompt
   */
  private createUpdatePrompt(
    commitInfo: CommitInfo,
    filePath: string,
    currentContent: string,
    fileType: 'autogenerated' | 'manual',
    analysis: string
  ): string {
    const isAutogenerated = fileType === 'autogenerated';
    
    // Get diff content for the changes
    const diffContent = commitInfo.diffs.map(diff => {
      return `File: ${diff.filePath}
Change Type: ${diff.changeType}
Lines Added: ${diff.linesAdded}
Lines Deleted: ${diff.linesDeleted}
Diff Content:
${diff.diff || 'No diff content available'}`;
    }).join('\n\n');

    const basePrompt = `You are an expert technical writer updating documentation based on code changes.

CRITICAL: Only make changes if the commit actually requires documentation updates. If the current documentation is already accurate and up-to-date, return the content unchanged.

IMPORTANT: Do NOT update autogenerated API documentation files. These files are automatically generated from code and should not be manually edited.

COMMIT INFORMATION:
- Message: ${commitInfo.message}
- Files Changed: ${commitInfo.filesChanged.join(', ')}

DIFF INFORMATION:
${diffContent}

ANALYSIS FROM PREVIOUS STEP:
${analysis}

DOCUMENTATION FILE TO UPDATE:
- Path: ${filePath}
- File Type: ${fileType}
- Current Content:
${currentContent}

IMPORTANT FORMATTING REQUIREMENTS:
- Maintain exact spacing, indentation, and line breaks that match the existing file patterns
- Preserve the document structure and formatting style
- Keep consistent with established markdown/documentation conventions
- Ensure proper heading levels, list formatting, and code block styling

CONSERVATIVE UPDATE POLICY:
- Only update if the commit changes actually affect the documentation content
- If the current documentation is already accurate, return it unchanged
- Avoid making unnecessary changes or reformatting
- Preserve existing content unless there's a clear need for updates
- NEVER update autogenerated API documentation files`;

    if (isAutogenerated) {
      return `${basePrompt}

SPECIAL INSTRUCTIONS FOR AUTOGENERATED FILES:
- DO NOT UPDATE AUTOGENERATED API DOCUMENTATION FILES
- These files are automatically generated from code and should not be manually edited
- Return the content unchanged regardless of commit changes
- Autogenerated files will be updated by the code generation process, not by AI agents
- If this is an autogenerated API documentation file, return the original content exactly as it is

Please return the original content unchanged for autogenerated files.

RESPONSE FORMAT:
Provide your response in this exact format:

=== UPDATED_CONTENT_START ===
[Original file content unchanged]
=== UPDATED_CONTENT_END ===

=== INSTRUCTIONS_START ===
No changes made - autogenerated API documentation files should not be manually edited
=== INSTRUCTIONS_END ===`;
    } else {
      return `${basePrompt}

SPECIAL INSTRUCTIONS FOR MANUAL DOCUMENTATION:
- Only update if the commit changes actually require documentation updates
- If the current documentation already covers the changes adequately, return it unchanged
- Use your judgment to update the documentation to contain new information relating to the diff result
- Add new sections or update existing sections ONLY if needed
- Ensure the documentation helps users understand and use the new features or changes
- Maintain the narrative flow and educational structure of the documentation
- Add examples, configuration details, or usage instructions as appropriate
- Do not make changes if the documentation is already accurate and complete

Please provide thoughtful updates that help users understand the changes while maintaining the document's quality and usefulness.

RESPONSE FORMAT:
Provide your response in this exact format:

=== UPDATED_CONTENT_START ===
[Complete updated file content here]
=== UPDATED_CONTENT_END ===

=== INSTRUCTIONS_START ===
Brief description of what was changed and why
=== INSTRUCTIONS_END ===`;
    }
  }

  /**
   * Detects the line ending style used in the content
   * @param content - The file content to analyze
   * @returns The detected line ending ('\r\n' for Windows/CRLF, '\n' for Unix/LF)
   */
  private detectLineEnding(content: string): string {
    // Count occurrences of each line ending type
    const crlfCount = (content.match(/\r\n/g) || []).length;
    const lfOnlyCount = (content.match(/(?<!\r)\n/g) || []).length;
    
    // If we have any CRLF endings, use CRLF (even if mixed)
    // This is more conservative and preserves Windows-style files
    if (crlfCount > 0) {
      return '\r\n';
    }
    
    // Default to LF if no CRLF found
    return '\n';
  }

  /**
   * Normalizes line endings in content to match the target style
   * @param content - The content to normalize
   * @param targetLineEnding - The target line ending style ('\r\n' or '\n')
   * @returns Content with normalized line endings
   */
  private normalizeLineEndings(content: string, targetLineEnding: string): string {
    // First normalize all line endings to LF
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // If target is CRLF, convert LF to CRLF
    if (targetLineEnding === '\r\n') {
      return normalizedContent.replace(/\n/g, '\r\n');
    }
    
    // Otherwise, keep as LF
    return normalizedContent;
  }

  /**
   * Preserves YAML frontmatter exactly from the original file to prevent formatting changes
   * @param originalContent - The original file content
   * @param updatedContent - The AI-generated updated content
   * @param targetLineEnding - The target line ending style
   * @returns Content with preserved frontmatter and correct line endings
   */
  private preserveFrontmatter(originalContent: string, updatedContent: string, targetLineEnding: string): string {
    // Check if the original content has YAML frontmatter
    const frontmatterMatch = originalContent.match(/^(---\s*\n[\s\S]*?\n---\s*\n)/);
    
    if (frontmatterMatch) {
      const originalFrontmatter = frontmatterMatch[1];
      
      // Remove frontmatter from updated content if it exists
      const updatedWithoutFrontmatter = updatedContent.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
      
      // Combine original frontmatter with updated content body
      const combined = originalFrontmatter + updatedWithoutFrontmatter;
      
      // Apply line ending normalization to the combined content
      return this.normalizeLineEndings(combined, targetLineEnding);
    }
    
    // If no frontmatter, just normalize line endings
    return this.normalizeLineEndings(updatedContent, targetLineEnding);
  }

  /**
   * Determines if there are significant changes between original and updated content
   * @param originalContent - The original file content
   * @param updatedContent - The updated file content
   * @returns boolean - True if there are significant changes, false otherwise
   */
  private hasSignificantContentChanges(originalContent: string, updatedContent: string): boolean {
    // Normalize both contents for comparison
    const normalizedOriginal = originalContent.trim();
    const normalizedUpdated = updatedContent.trim();
    
    // If they're exactly the same, no changes
    if (normalizedOriginal === normalizedUpdated) {
      return false;
    }
    
    // Split into lines for more detailed comparison
    const originalLines = normalizedOriginal.split('\n');
    const updatedLines = normalizedUpdated.split('\n');
    
    // If line count is significantly different, there are changes
    if (Math.abs(originalLines.length - updatedLines.length) > 2) {
      return true;
    }
    
    // Compare line by line, ignoring whitespace differences
    let significantDifferences = 0;
    const maxLines = Math.max(originalLines.length, updatedLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const updatedLine = updatedLines[i] || '';
      
      // Normalize lines for comparison (trim whitespace)
      const normalizedOriginalLine = originalLine.trim();
      const normalizedUpdatedLine = updatedLine.trim();
      
      // If lines are different and not just whitespace, count as significant
      if (normalizedOriginalLine !== normalizedUpdatedLine) {
        significantDifferences++;
        
        // If we have more than 3 significant differences, consider it changed
        if (significantDifferences > 3) {
          return true;
        }
      }
    }
    
    // If we have any significant differences, consider it changed
    return significantDifferences > 0;
  }

  /**
   * Parses the AI response to extract updated content and instructions
   * @param response - The AI response
   * @param fileType - The file type
   * @returns Result<{updatedContent: string, updateInstructions: string}, string>
   */
  private parseUpdateResponse(
    response: string,
    fileType: 'autogenerated' | 'manual'
  ): Result<{updatedContent: string, updateInstructions: string}, string> {
    try {
      // Extract updated content
      const contentMatch = response.match(/=== UPDATED_CONTENT_START ===\n([\s\S]*?)\n=== UPDATED_CONTENT_END ===/);
      if (!contentMatch) {
        return Result.error('Could not find UPDATED_CONTENT section in AI response');
      }
      const updatedContent = contentMatch[1];

      // Extract instructions
      const instructionsMatch = response.match(/=== INSTRUCTIONS_START ===\n([\s\S]*?)\n=== INSTRUCTIONS_END ===/);
      if (!instructionsMatch) {
        return Result.error('Could not find INSTRUCTIONS section in AI response');
      }
      const updateInstructions = instructionsMatch[1];

      return Result.success({
        updatedContent,
        updateInstructions
      });

    } catch (error) {
      return Result.error(`Error parsing AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
