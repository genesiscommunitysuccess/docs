// server.mjs - ESM Version
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Initialize MCP server
const initMCPServer = async () => {
  try {
    // Create MCP instance
    const mcp = new McpServer({
      name: "Genesis Documentation",
      version: "1.0.0"
    });
    
    // Add docs info tool
    mcp.tool(
      "get_docs_info",
      {},
      async () => ({
        content: [{
          type: "text", 
          text: JSON.stringify({
            platform: 'Genesis Platform',
            docusaurus_version: 'See package.json for current version',
            description: 'Documentation for the Genesis low-code platform'
          }, null, 2)
        }]
      })
    );
    
    // Add search tool
    mcp.tool(
      "search_docs",
      { query: z.string() },
      async ({ query }) => ({
        content: [{
          type: "text",
          text: JSON.stringify({
            message: `Search results for: ${query}`,
            results: [
              { title: 'Example result 1', path: '/docs/example1' },
              { title: 'Example result 2', path: '/docs/example2' }
            ]
          }, null, 2)
        }]
      })
    );
    
    console.log('MCP server initialized');
    
    return mcp;
  } catch (error) {
    console.error('Error initializing MCP server:', error);
    throw error;
  }
};

export { initMCPServer };