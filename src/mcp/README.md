# Genesis Docs MCP Server

This directory contains the implementation of an MCP (Model Control Protocol) server for the Genesis documentation site. The MCP server provides special tools that allow AI assistants like Claude to search, navigate, and view the Genesis documentation.

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- npm
- Git

### Installation

1. Clone the repository and check out the appropriate branch:
   ```bash
   git clone https://github.com/path/to/genesis-docs.git
   cd genesis-docs
   git checkout mw/mcp-poc  # or the latest branch with MCP implementation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the MCP server:
   ```bash
   npm run build:mcp
   ```

### Configuring Claude Code

To use this MCP server with Claude Code, you need to add it to your Claude configuration:

1. Edit your Claude config file:
   ```bash
   nano ~/.claude.json
   ```

2. Add the MCP server configuration. Make sure to update the `cwd` path to match your local repository path:
   ```json
   {
     "mcpServers": {
       "genesis-docs-mcp": {
         "command": "npm",
         "args": ["run", "start:mcp"],
         "cwd": "/path/to/your/genesis-docs"
       }
     }
   }
   ```

3. Save the file and restart Claude Code if it's already running.

## Available Tools

The MCP server provides the following tools:

- `docsSearch`: Search documentation for specific terms
- `routeSearch`: Search and list Docusaurus routes
- `apiDocsSearch`: Search API documentation resources
- `markdownView`: View the content of markdown files
- `contentSearch`: Search through content of documentation files

## Development

To modify or add new tools:

1. Tools are implemented in the `/src/mcp/tools` directory
2. Each tool extends the base `MCPTool` class or a derived class
3. After making changes, rebuild with `npm run build:mcp`

See the CLAUDE.md file in the repository root for more detailed information about the MCP implementation.