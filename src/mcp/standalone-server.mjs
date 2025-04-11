// standalone-server.mjs - ESM version
import express from 'express';
import { initMCPServer } from './server.mjs';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

// Create Express app
const app = express();
app.use(express.json());

// Store transports by session ID
const transports = {};

// Add CORS headers to support cross-origin requests
const addCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
};

// Apply CORS middleware to all routes
app.use(addCorsHeaders);

// Increase server timeout settings
const serverSettings = {
  headersTimeout: 120000, // 2 minutes
  keepAliveTimeout: 120000 // 2 minutes
};

async function startServer() {
  try {
    console.log('Starting standalone Express server for MCP...');
    
    // Define global connection status monitoring
    let serverStatus = {
      startTime: new Date(),
      connections: 0,
      failedConnections: 0,
      activeTransports: 0,
      lastConnectionTime: null,
      healthy: true
    };
    
    // Monitor server health periodically (every 30 seconds)
    const healthCheckInterval = setInterval(() => {
      const now = new Date();
      const uptime = (now - serverStatus.startTime) / 1000;
      console.log(`[HEALTH] Server uptime: ${uptime.toFixed(0)}s, Active connections: ${serverStatus.activeTransports}`);
      
      // If no connections for a long time but server has been running, log a warning
      if (serverStatus.lastConnectionTime && (now - serverStatus.lastConnectionTime > 600000)) {
        console.warn(`[WARNING] No new connections in the last 10 minutes - server may be idle or unreachable`);
      }
      
      // Update health status based on connection success rate
      if (serverStatus.connections > 0) {
        const successRate = 1 - (serverStatus.failedConnections / serverStatus.connections);
        serverStatus.healthy = successRate > 0.8; // Consider healthy if >80% success rate
      }
    }, 30000);
    
    // Initialize MCP server - with better error handling
    let mcp;
    try {
      mcp = await initMCPServer();
      console.log('MCP server instance initialized successfully');
    } catch (mcpInitError) {
      console.error('Critical error initializing MCP server:', mcpInitError);
      clearInterval(healthCheckInterval);
      throw mcpInitError;
    }
    
    // Enable more detailed debug logging
    const DEBUG = process.env.DEBUG_MCP === 'true';
    const debugLog = (...args) => {
      if (DEBUG) {
        console.log('[DEBUG]', ...args);
      }
    };
    
    // Enhanced health check endpoint with detailed status
    app.get('/api/mcp/health', (req, res) => {
      const now = new Date();
      const uptime = (now - serverStatus.startTime) / 1000;
      
      // Get current active transport count from the tracking object
      const activeConnectionCount = Object.keys(transports).length;
      serverStatus.activeTransports = activeConnectionCount;
      
      res.json({ 
        status: serverStatus.healthy ? 'ok' : 'degraded', 
        message: serverStatus.healthy ? 'MCP server is running properly' : 'MCP server is experiencing issues',
        timestamp: now.toISOString(),
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        activeTransports: activeConnectionCount,
        totalConnections: serverStatus.connections,
        failedConnections: serverStatus.failedConnections,
        lastConnectionTime: serverStatus.lastConnectionTime ? serverStatus.lastConnectionTime.toISOString() : null,
        serverSettings: {
          keepAliveTimeout: serverSettings.keepAliveTimeout,
          headersTimeout: serverSettings.headersTimeout
        }
      });
    });
    
    // Common function to handle SSE connections
    const handleSseConnection = async (req, res, messagesEndpoint) => {
      try {
        // Update server status tracking
        serverStatus.connections++;
        serverStatus.lastConnectionTime = new Date();
        serverStatus.activeTransports = Object.keys(transports).length + 1;
        
        // REMOVED: Setting headers here causes conflicts with SSEServerTransport
        // Headers will be set by the transport.start() method
        
        // Create a custom transport options object to ensure we control the start behavior
        const transportOptions = {
          disableAutoStart: true // Try to prevent automatic starting
        };
        
        // Create transport with messagesEndpoint and response
        const transport = new SSEServerTransport(messagesEndpoint, res, transportOptions);
        
        // Log detailed connection info
        console.log(`New MCP client connected: ${transport.sessionId} via ${messagesEndpoint}`);
        debugLog(`Client headers:`, req.headers);
        
        // Set up event handlers BEFORE trying to connect
        // Single close event handler
        res.on('close', () => {
          delete transports[transport.sessionId];
          console.log(`Client disconnected: ${transport.sessionId}`);
          console.log(`Disconnection time: ${new Date().toISOString()}`);
        });
        
        // Error event handler
        res.on('error', (err) => {
          console.error(`Error on response stream for ${transport.sessionId}:`, err);
          delete transports[transport.sessionId];
        });
        
        // Connect to MCP server with better error handling
        try {
          // IMPORTANT: Don't write to the response before connecting
          // because SSEServerTransport.start() also writes headers
          console.log(`Connecting transport to MCP server for ${transport.sessionId}...`);
          
          // Add a small delay before connecting to ensure transport is ready
          // This can help prevent "already started" errors by letting any internal state settle
          console.log(`Waiting briefly before connecting transport ${transport.sessionId}...`);
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Try a different approach where we manually call start() AFTER connecting
          // This is a last resort attempt to fix the "already started" error
          // Connect to MCP server first
          const connection = await mcp.connect(transport);
          console.log(`MCP connection created, now ensuring transport is started...`);
          
          // Small additional delay to ensure proper sequence
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Only store the transport AFTER successful connection
          transports[transport.sessionId] = transport;
          console.log(`MCP connection established for client ${transport.sessionId}`);
          console.log(`Server now has ${Object.keys(transports).length} active connections`);
          
          // REMOVED: Custom event notification about tools
          // This was causing interference with the MCP protocol
          // The MCP server handles tool advertising through its own protocol
          
          // Let the transport handle all communication after connection
          // No need to manually write to the response stream as it's managed by the MCP library
        } catch (connectErr) {
          console.error(`Error connecting to MCP for client ${transport.sessionId}:`, connectErr);
          
          // Update server status to track the failure
          serverStatus.failedConnections++;
          serverStatus.activeTransports = Object.keys(transports).length;
          
          // Don't need to delete from transports since we only add after successful connection
          
          // Only attempt to send error if the response is still writable
          try {
            if (res.writable && !res.writableEnded) {
              res.write(`data: ${JSON.stringify({
                error: "Connection failed", 
                message: connectErr.message,
                timestamp: new Date().toISOString(),
                recommendedAction: "Please try reconnecting"
              })}\n\n`);
            }
          } catch (cleanupErr) {
            console.error(`Error during connection failure cleanup:`, cleanupErr);
          }
        }
      } catch (err) {
        console.error(`Error with SSE connection:`, err);
        
        // Track failed connection in server status
        serverStatus.failedConnections++;
        
        // Only attempt to send error response if headers haven't been sent
        if (!res.headersSent) {
          res.status(500).json({
            error: "Internal Server Error", 
            message: err.message,
            timestamp: new Date().toISOString(),
            recommendedAction: "Please try again later"
          });
        } else if (res.writable && !res.writableEnded) {
          res.write(`data: ${JSON.stringify({
            error: "Server error", 
            message: err.message,
            timestamp: new Date().toISOString()
          })}\n\n`);
        }
      }
    };
    
    // SSE endpoint for MCP connections (original path)
    app.get('/api/mcp/sse', async (req, res) => {
      await handleSseConnection(req, res, '/api/mcp/messages');
    });
    
    // Alternative SSE endpoint at /sse to match config
    app.get('/sse', async (req, res) => {
      await handleSseConnection(req, res, '/messages');
    });
    
    // Common function to handle message processing
    const handleMessages = async (req, res, endpointName) => {
      const sessionId = req.query.sessionId;
      const transport = transports[sessionId];
      
      console.log(`Received message for session at ${endpointName}: ${sessionId}`);
      debugLog(`Message body:`, req.body);
      
      if (transport) {
        try {
          // Pass request and response objects directly to handlePostMessage
          await transport.handlePostMessage(req, res);
        } catch (err) {
          console.error(`Error handling message for session ${sessionId} at ${endpointName}:`, err);
          
          // Return an appropriate error response
          if (!res.headersSent) {
            res.status(500).json({
              error: "Failed to process message",
              message: err.message,
              timestamp: new Date().toISOString()
            });
          }
        }
      } else {
        console.warn(`No transport found for sessionId at ${endpointName}: ${sessionId}`);
        res.status(400).json({
          error: "Session not found",
          message: "No active transport found for the provided sessionId",
          timestamp: new Date().toISOString(),
          availableSessions: Object.keys(transports)
        });
      }
    };
    
    // Messages endpoint for client -> server communication (original path)
    app.post('/api/mcp/messages', async (req, res) => {
      await handleMessages(req, res, 'original endpoint');
    });
    
    // Alternative messages endpoint to match the new /sse endpoint
    app.post('/messages', async (req, res) => {
      await handleMessages(req, res, 'alternate endpoint');
    });
    
    // Add a root endpoint with more detailed information
    app.get('/', (req, res) => {
      res.json({
        message: 'Genesis Documentation MCP Server',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        activeSessions: Object.keys(transports).length,
        endpoints: [
          { path: '/api/mcp/health', method: 'GET', description: 'Check server health' },
          { path: '/api/mcp/sse', method: 'GET', description: 'Connect to MCP via SSE (original)' },
          { path: '/api/mcp/messages', method: 'POST', description: 'Send messages (original)' },
          { path: '/sse', method: 'GET', description: 'Connect to MCP via SSE (alternate)' },
          { path: '/messages', method: 'POST', description: 'Send messages (alternate)' }
        ],
        tools: [
          { name: 'get_docs_info', description: 'Returns general information about Genesis docs' },
          { name: 'search_docs', description: 'Search the documentation (example results)' },
          { name: 'test_connection', description: 'Test MCP connection and get diagnostics' }
        ]
      });
    });
    
    // Debug endpoint to list active connections
    app.get('/api/mcp/debug', (req, res) => {
      res.json({
        activeConnections: Object.keys(transports).length,
        sessionIds: Object.keys(transports),
        timestamp: new Date().toISOString()
      });
    });
    
    // Start the server with the configured settings
    const PORT = process.env.MCP_PORT || 3002;
    const server = app.listen(PORT, () => {
      // Apply timeout settings to the server
      server.headersTimeout = serverSettings.headersTimeout;
      server.keepAliveTimeout = serverSettings.keepAliveTimeout;
      
      console.log(`MCP Server started at http://localhost:${PORT}`);
      console.log(`Server timeout settings: headersTimeout=${serverSettings.headersTimeout}ms, keepAliveTimeout=${serverSettings.keepAliveTimeout}ms`);
      console.log(`Available endpoints:
- GET  /api/mcp/health - Check server health
- GET  /api/mcp/sse   - Connect to MCP via SSE
- POST /api/mcp/messages?sessionId=XXX - Send messages to MCP server
- GET  /sse   - Alternative endpoint to connect to MCP via SSE
- POST /messages?sessionId=XXX - Alternative endpoint to send messages to MCP server
- GET  /api/mcp/debug - View active connections (debug)
- GET  / - Server information`);
    });
    
    // Setup graceful shutdown
    const cleanup = () => {
      console.log('Server shutting down...');
      clearInterval(healthCheckInterval);
      
      // Close all active transports
      for (const transportId in transports) {
        try {
          console.log(`Closing transport: ${transportId}`);
          delete transports[transportId];
        } catch (err) {
          console.error(`Error closing transport ${transportId}:`, err);
        }
      }
      
      server.close(() => {
        console.log('Server closed successfully');
        process.exit(0);
      });
      
      // Force exit after 5 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 5000);
    };
    
    // Handle termination signals
    process.on('SIGTERM', cleanup);
    process.on('SIGINT', cleanup);
    
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();