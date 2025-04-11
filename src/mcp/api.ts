import { Express, Request, Response } from 'express';
import initMCPServer from './server';

// Function to initialize MCP API routes
export const initMCPApi = async (app: Express) => {
  const mcp = await initMCPServer();
  
  // Basic health check endpoint
  app.get('/api/mcp/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'MCP server is running' });
  });
  
  // MCP endpoint for tool execution
  app.post('/api/mcp/tool', async (req: Request, res: Response) => {
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
  app.get('/api/mcp/tools', (req: Request, res: Response) => {
    const tools = mcp.getTools().map(tool => ({
      name: tool.name,
      description: tool.description
    }));
    
    res.json({ tools });
  });
  
  console.log('MCP API routes initialized');
};