// api.js
const { initMCPServer } = require('./server');

// Function to initialize MCP API routes
const initMCPApi = async (app) => {
  const mcp = await initMCPServer();
  
  // Basic health check endpoint
  app.get('/api/mcp/health', (req, res) => {
    res.json({ status: 'ok', message: 'MCP server is running' });
  });
  
  // MCP endpoint for tool execution
  app.post('/api/mcp/tool', async (req, res) => {
    try {
      const { toolName, parameters } = req.body;
      
      if (!toolName) {
        return res.status(400).json({ error: 'Tool name is required' });
      }
      
      const result = await mcp.runTool(toolName, parameters || {});
      res.json({ result });
    } catch (error) {
      console.error('Error executing MCP tool:', error);
      res.status(500).json({ 
        error: 'Failed to execute tool',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // List available tools endpoint
  app.get('/api/mcp/tools', (req, res) => {
    const tools = mcp.getTools().map(tool => ({
      name: tool.name,
      description: tool.description
    }));
    
    res.json({ tools });
  });
  
  console.log('MCP API routes initialized');
};

module.exports = { initMCPApi };