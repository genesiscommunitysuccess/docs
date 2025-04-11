// standalone-server.mjs - ESM version
import express from 'express';
import { initMCPServer } from './server.mjs';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

// Create Express app
const app = express();
app.use(express.json());

// Store transports by session ID
const transports = {};

async function startServer() {
  try {
    // Initialize MCP server
    const mcp = await initMCPServer();
    
    // Basic health check endpoint
    app.get('/api/mcp/health', (req, res) => {
      res.json({ status: 'ok', message: 'MCP server is running' });
    });
    
    // SSE endpoint for MCP connections
    app.get('/api/mcp/sse', async (req, res) => {
      const transport = new SSEServerTransport('/api/mcp/messages', res);
      transports[transport.sessionId] = transport;
      
      res.on('close', () => {
        delete transports[transport.sessionId];
        console.log(`Client disconnected: ${transport.sessionId}`);
      });
      
      console.log(`New MCP client connected: ${transport.sessionId}`);
      await mcp.connect(transport);
    });
    
    // Messages endpoint for client -> server communication
    app.post('/api/mcp/messages', async (req, res) => {
      const sessionId = req.query.sessionId;
      const transport = transports[sessionId];
      
      if (transport) {
        await transport.handlePostMessage(req, res);
      } else {
        res.status(400).send('No transport found for sessionId');
      }
    });
    
    // Add a root endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'Genesis Documentation MCP Server',
        endpoints: [
          '/api/mcp/health',
          '/api/mcp/sse',
          '/api/mcp/messages'
        ]
      });
    });
    
    // Start the server
    const PORT = process.env.MCP_PORT || 3002;
    app.listen(PORT, () => {
      console.log(`MCP Server started at http://localhost:${PORT}`);
      console.log(`Available endpoints:
- GET  /api/mcp/health - Check server health
- GET  /api/mcp/sse   - Connect to MCP via SSE
- POST /api/mcp/messages?sessionId=XXX - Send messages to MCP server`);
    });
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();