// standalone-server.js
const express = require('express');

// Create Express app
const app = express();
app.use(express.json());

// Import MCP tools and API
const { initMCPApi } = require('./api');

async function startServer() {
  try {
    // Initialize MCP API
    await initMCPApi(app);
    
    // Add a root endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'Genesis Documentation MCP Server',
        endpoints: [
          '/api/mcp/health',
          '/api/mcp/tools',
          '/api/mcp/tool'
        ]
      });
    });
    
    // Start the server
    const PORT = process.env.MCP_PORT || 3001;
    app.listen(PORT, () => {
      console.log(`MCP Server started at http://localhost:${PORT}`);
      console.log(`Available endpoints:
- GET  /api/mcp/health - Check server health
- GET  /api/mcp/tools - List available tools
- POST /api/mcp/tool  - Execute a tool`);
    });
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();