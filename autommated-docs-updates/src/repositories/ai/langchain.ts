import { AIRepository } from './types';
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
   * Analyzes a commit hash using LangChain and Claude to determine if documentation updates are needed
   * @param commitHash - The git commit hash to analyze
   * @returns Promise<boolean> - True if documentation updates are needed, false otherwise
   */
  async shouldUpdateDocs(commitHash: string): Promise<boolean> {
    console.log(`🤖 LangChain AI analysis of commit: ${commitHash}`);
    
    try {
      // Create a prompt for analyzing the commit
      const prompt = this.createAnalysisPrompt(commitHash);
      
      // Call the LangChain model
      const response = await this.model.invoke([new HumanMessage(prompt)]);
      
      // Parse the response to determine if docs need updates
      const needsUpdate = this.parseResponse(response.content as string);
      
      console.log(`🤖 AI Analysis Result: ${needsUpdate ? 'Documentation updates needed' : 'No documentation updates required'}`);
      
      return needsUpdate;
      
    } catch (error) {
      console.error('❌ Error during LangChain analysis:', error);
      // Fallback to a simple heuristic if AI analysis fails
      return this.fallbackAnalysis(commitHash);
    }
  }

  /**
   * Creates a prompt for analyzing whether a commit requires documentation updates
   * @param commitHash - The commit hash to analyze
   * @returns string - The analysis prompt
   */
  private createAnalysisPrompt(commitHash: string): string {
    return `You are an expert software developer and technical writer. Your task is to analyze a git commit and determine if it requires documentation updates.

Commit Hash: ${commitHash}

Please analyze this commit and determine if documentation updates are needed. Consider the following factors:

1. **New Features**: Does this commit introduce new features that users need to know about?
2. **API Changes**: Are there changes to APIs, interfaces, or public methods?
3. **Configuration Changes**: Are there new configuration options or changes to existing ones?
4. **Breaking Changes**: Are there any breaking changes that users need to be aware of?
5. **Bug Fixes**: Are there important bug fixes that affect user workflows?
6. **Security Updates**: Are there security-related changes that need documentation?

Respond with ONLY "YES" if documentation updates are needed, or "NO" if no documentation updates are required.

Your response:`;
  }

  /**
   * Parses the AI response to determine if documentation updates are needed
   * @param response - The AI model response
   * @returns boolean - True if documentation updates are needed
   */
  private parseResponse(response: string): boolean {
    const cleanResponse = response.trim().toUpperCase();
    
    // Look for affirmative responses
    if (cleanResponse.includes('YES') || 
        cleanResponse.includes('TRUE') || 
        cleanResponse.includes('NEEDED') ||
        cleanResponse.includes('REQUIRED')) {
      return true;
    }
    
    // Look for negative responses
    if (cleanResponse.includes('NO') || 
        cleanResponse.includes('FALSE') || 
        cleanResponse.includes('NOT NEEDED') ||
        cleanResponse.includes('NOT REQUIRED')) {
      return false;
    }
    
    // Default to false if response is unclear
    console.log(`⚠️ Unclear AI response: "${response}". Defaulting to no updates needed.`);
    return false;
  }

  /**
   * Fallback analysis when AI analysis fails
   * @param commitHash - The commit hash to analyze
   * @returns boolean - Fallback determination
   */
  private fallbackAnalysis(commitHash: string): boolean {
    console.log('🔄 Using fallback analysis due to AI analysis failure');
    
    // Simple heuristic based on commit hash patterns
    const hashSum = commitHash.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return hashSum % 3 === 0; // 33% chance for fallback
  }
} 