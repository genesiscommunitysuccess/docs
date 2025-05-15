#!/bin/bash

set -e

# This script is intended to be run via curl | bash
# It will clone the repo into the current directory and set up the MCP server.

current_dir=$(pwd)
echo "Installation will proceed in the current directory: $current_dir"
echo "Cloning MCP server repository..."

REPO_URL="https://github.com/genesiscommunitysuccess/docs.git"
BRANCH_NAME="mw/PTL-1903-docs-mcp-server"
REPO_NAME="docs"
MCP_DIR="genesis-docs-mcp-server"

echo "Cloning $REPO_URL (branch: $BRANCH_NAME) into $current_dir/$REPO_NAME ..."
git clone --branch "$BRANCH_NAME" --single-branch "$REPO_URL" "$REPO_NAME"

# Important: All subsequent commands need to know they are inside the cloned repo structure.
# We cd into the top-level cloned directory first.
cd "$REPO_NAME"

# Then cd into the specific MCP directory
cd "$MCP_DIR"

echo "Installing dependencies and building the MCP server in $(pwd)..."
npm install
npm run build

# Get the absolute path to the dist/index.js from within the now current MCP_DIR
MCP_DIST_PATH="$(pwd)/dist/index.js"

echo "Setting up ~/.cursor/mcp.json ..."
mkdir -p ~/.cursor

cat <<EOF > ~/.cursor/mcp.json
{
  "mcpServers": {
    "genesis-docs-mcp-server": {
      "command": "node",
      "args": [
        "$MCP_DIST_PATH"
      ]
    }
  }
}
EOF

echo "~/.cursor/mcp.json created with MCP server path: $MCP_DIST_PATH"
echo "MCP server installation complete!" 