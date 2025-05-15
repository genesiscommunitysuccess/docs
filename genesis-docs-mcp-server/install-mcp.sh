#!/bin/bash

set -e

# Prompt the user for confirmation before proceeding
read -p "This script will clone the repo into your current directory: $(pwd). Continue? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Aborting installation."
  exit 1
fi

REPO_URL="https://github.com/genesiscommunitysuccess/docs.git"
BRANCH_NAME="mw/PTL-1903-docs-mcp-server"
REPO_NAME="docs"
MCP_DIR="genesis-docs-mcp-server"

echo "Cloning $REPO_URL (branch: $BRANCH_NAME) into current directory..."
git clone --branch "$BRANCH_NAME" --single-branch "$REPO_URL"

cd "$REPO_NAME"
cd "$MCP_DIR"

echo "Installing dependencies and building the MCP server..."
npm install
npm run build

# Get the absolute path to the dist/index.js
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