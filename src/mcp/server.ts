import { MCP, MCPTool } from '@modelcontextprotocol/sdk';

// Define a simple tool that returns Docusaurus info
const infoTool: MCPTool = {
  name: 'get_docs_info',
  description: 'Get information about the Docusaurus documentation',
  parameters: {
    type: 'object',
    properties: {},
    required: []
  },
  handler: async () => {
    return {
      platform: 'Genesis Platform',
      docusaurus_version: 'See package.json for current version',
      description: 'Documentation for the Genesis low-code platform'
    };
  }
};

// Initialize MCP server
export const initMCPServer = async () => {
  // Create MCP instance
  const mcp = new MCP({
    tools: [infoTool]
  });
  
  console.log('MCP server initialized with tools:', mcp.getTools().map(tool => tool.name));
  
  return mcp;
};

// Export for use in other files
export default initMCPServer;