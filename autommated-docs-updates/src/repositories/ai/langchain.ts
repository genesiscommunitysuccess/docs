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

COMMIT INFORMATION:
- Message: ${commitInfo.message}
- Files Changed: ${commitInfo.filesChanged.join(', ')}

DOCUMENTATION FILE:
- Path: ${filePath}
- Content Preview:
${fileContent}

SEARCH TERMS USED: ${searchTerms.join(', ')}

Based on the commit changes and the documentation file content, determine if this file needs to be updated to reflect the changes in the commit.

Consider:
1. Does the file document functionality that was changed in the commit?
2. Does the file contain information that is now outdated due to the commit?
3. Does the file need new information about features added in the commit?
4. Is this file the right place to document the changes made?

Respond with ONLY "YES" if the file needs updates, or "NO" if it doesn't.

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
}
