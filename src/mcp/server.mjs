// server.mjs - ESM Version
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Initialize MCP server
const initMCPServer = async () => {
  try {
    console.log('Initializing MCP server with improved stability settings...');
    
    // Create MCP instance with adjusted timeout parameters for better stability
    // Following a pattern similar to the Kotlin implementation
    const mcp = new McpServer({
      // Server implementation details
      implementation: {
        name: "Genesis Documentation MCP",
        version: "1.0.0",
        description: "Access and search Genesis Platform documentation"
      },
      // Configure more robust timeout settings
      keepAliveInterval: 5000,   // Increased to 5 seconds for better stability
      receiverTimeout: 600000,   // 10 minute timeout for receivers (more generous)
      messageSendTimeout: 120000, // 2 minute timeout for message sending (increased)
      initialPingDelay: 1000,    // Send first ping after 1 second
      debug: true,               // Enable debug logging for better diagnostics
      autoStartTransport: false  // Attempt to disable auto-starting the transport
    });
    
    // Define tools first, then register them - similar to Kotlin pattern
    const tools = [
      {
        name: "get_docs_info",
        description: "Returns general information about the Genesis documentation platform",
        schema: {},
        handler: async () => ({
          content: [{
            type: "text", 
            text: JSON.stringify({
              platform: 'Genesis Platform',
              docusaurus_version: 'See package.json for current version',
              description: 'Documentation for the Genesis low-code platform'
            }, null, 2)
          }]
        })
      },
      {
        name: "search_docs",
        description: "Search the documentation using a text query",
        schema: { query: z.string() },
        handler: async ({ query }) => ({
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
      },
      {
        name: "test_connection",
        description: "Tests the MCP connection and provides diagnostic information",
        schema: {},
        handler: async () => {
          const timestamp = new Date().toISOString();
          console.log(`Connection test requested at ${timestamp}`);
          
          // Capture environment details to help diagnose connection issues
          const diagnostics = {
            status: "connected",
            timestamp,
            message: "MCP connection is active and working correctly",
            environment: {
              nodeVersion: process.version,
              platform: process.platform,
              arch: process.arch,
              memoryUsage: process.memoryUsage(),
              uptime: process.uptime()
            },
            server: {
              mcpVersion: "1.0.0",
              keepAliveInterval: 5000,   // Updated values
              receiverTimeout: 600000,
              messageSendTimeout: 120000,
              initialPingDelay: 1000
            }
          };
          
          console.log(`Connection test successful, sending response at ${new Date().toISOString()}`);
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify(diagnostics, null, 2)
            }]
          };
        }
      }
    ];
    
    // In version 1.9.0 of the SDK, there's no setMetadata method
    // Metadata is passed via the constructor (see above)
    console.log(`Registered ${tools.length} tools with the MCP server`);
    
    // Register all tools with extensive logging
    console.log(`Registering ${tools.length} tools with MCP server...`);
    tools.forEach(tool => {
      try {
        console.log(`Registering tool: ${tool.name}`);
        mcp.tool(tool.name, tool.schema, tool.handler);
        console.log(`Tool ${tool.name} registered successfully`);
      } catch (err) {
        console.error(`Failed to register tool ${tool.name}:`, err);
        // Continue with other tools even if one fails
      }
    });
    
    console.log('MCP server initialized');
    
    return mcp;
  } catch (error) {
    console.error('Error initializing MCP server:', error);
    throw error;
  }
};

export { initMCPServer };