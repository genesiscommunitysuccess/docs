import { MCPServer } from "mcp-framework";

// Create a simple MCP server with default settings
const server = new MCPServer();

// Log when tools are registered (the framework should do auto-discovery)
console.log("Starting MCP server with auto-discovered tools");

// Start the server
server.start()
  .then(() => {
    console.log("MCP server started successfully with STDIO transport");
    console.log("[INFO] Server running and ready.");
  })
  .catch((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to start MCP server:", errorMessage);
    process.exit(1);
  });