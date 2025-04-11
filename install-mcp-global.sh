#!/bin/bash

set -e

echo "Building MCP server..."
npm run build:mcp

echo "Copying package files to dist directory..."
cp src/mcp/package.json dist/mcp/

# Ensure tools directory exists in dist
echo "Ensuring tools directory exists..."
mkdir -p dist/mcp/tools

# Copy all tools from source to dist
echo "Copying Node modules..."
cp -r node_modules dist/mcp/

echo "Installing MCP server globally..."
cd dist/mcp
npm install -g .

echo "Installation complete! You can now use 'genesis-docs-mcp' from anywhere."
echo ""
echo "Update your ~/.claude.json to use the global command:"
echo '{
  "mcpServers": {
    "genesis-docs-mcp": {
      "command": "genesis-docs-mcp",
      "args": []
    }
  }
}'

echo ""
echo "To test the MCP server, run: claude --mcp-servers genesis-docs-mcp mcp"