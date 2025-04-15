import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import { fileSystem } from '../services/FileSystem.js';

interface RulesViewInput {
  ruleName?: string;
  listRules?: string;
}

class RulesViewTool extends MCPTool<RulesViewInput> {
  name = 'rules-view';
  description = 'View Genesis coding standards and conventions for AI-assisted development';

  schema = {
    ruleName: {
      type: z.string().optional(),
      description: 'The name of the specific rule file to view (e.g., "genesis-general-rules.mdc")',
    },
    listRules: {
      type: z.string().optional(),
      description: 'If true, returns a list of all available rules instead of a specific rule',
    },
  };

  async execute(input: RulesViewInput): Promise<string | { ruleFiles: string[] } | { rule: string, content: string }> {
    try {
      // Convert string 'true' to boolean for listRules
      const shouldListRules = input.listRules === 'true';
      
      // List all rules if requested or if no specific rule is provided
      if (shouldListRules || (!input.ruleName && input.listRules !== 'false')) {
        const ruleFiles = await fileSystem.listRules();
        return { ruleFiles };
      }

      // Return content of a specific rule
      if (input.ruleName) {
        const ruleContent = await fileSystem.readRuleFile(input.ruleName);
        
        return {
          rule: input.ruleName,
          content: ruleContent
        };
      }
      
      return 'Please provide either ruleName or set listRules to true';
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

export default RulesViewTool;