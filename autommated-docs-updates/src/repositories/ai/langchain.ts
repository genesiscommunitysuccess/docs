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
} 