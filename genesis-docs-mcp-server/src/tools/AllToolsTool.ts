import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

interface AllToolsInput {
  detail?: string;
}

class AllToolsTool extends MCPTool<AllToolsInput> {
  name = 'all';
  description = 'Provides an aggregated view of all available Genesis documentation tools';

  schema = {
    detail: {
      type: z.string().optional(),
      description: 'Optional parameter to get detailed information about a specific aspect of the tools',
    },
  };

  private tools: MCPTool<any>[];

  constructor(tools: MCPTool<any>[]) {
    super();
    this.tools = tools;
  }

  async execute(input: AllToolsInput) {
    const toolsList = this.tools.map(tool => ({
      name: tool.name,
      description: tool.description,
    }));

    return {
      message: 'Genesis Documentation Tools',
      tools: toolsList,
      count: toolsList.length,
      note: 'Use any of these tools individually for more specific documentation access.'
    };
  }
}

export default AllToolsTool; 