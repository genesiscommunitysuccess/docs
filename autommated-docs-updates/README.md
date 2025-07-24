# Automated Docs Updates

A TypeScript-based automation script for updating documentation repositories. This project provides a foundation for automated documentation workflows, particularly for Genesis platform documentation.

## Project Overview

This script is designed to work with two main repositories:
- **Documentation Repository**: `git@github.com:genesiscommunitysuccess/docs.git`
- **Foundation UI Repository**: `git@github.com:genesislcap/foundation-ui.git`

## Project Structure

```
autommated-docs-updates/
├── src/
│   ├── index.ts          # Main script execution
│   └── args.ts           # Argument validation and parsing
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration and scripts
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore patterns
└── README.md            # This file
```

## Setup

### Prerequisites

- Node.js >= 20.10.0
- Git (for repository cloning)
- SSH access to the Genesis repositories

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Setup

The project is configured with TypeScript and includes:
- **TypeScript**: For type-safe development
- **ts-node**: For running TypeScript directly during development
- **@types/node**: Type definitions for Node.js

## Usage

### Development Mode

Run the script with pre-configured paths for development:

```bash
# Use mock AI service (default)
npm run dev

# Explicitly use mock AI service for testing
npm run dev:mock

# Use real AI service (when implemented)
npm run dev:real
```

This uses the following default paths:
- Docs Repository: `/Users/matt.walker/genesis/docs`
- Foundation UI Repository: `/Users/matt.walker/genesis/foundation-ui`

**Note**: All dev commands require a commit hash as an additional argument.

### Production Mode

Build and run with custom paths:

```bash
# Build TypeScript to JavaScript
npm run build

# Run with custom repository paths
node dist/index.js <docs-repo-path> <foundation-ui-repo-path> <commit-hash>
```

### Available Scripts

- `npm run build` - Compiles TypeScript to JavaScript
- `npm start` - Runs compiled JavaScript (requires manual arguments)
- `npm run dev` - Runs TypeScript directly with pre-configured paths (uses mock AI service)
- `npm run dev:mock` - Runs with mock AI service for testing
- `npm run dev:real` - Runs with real AI service (when implemented)

## Features

### Argument Validation

The script requires exactly 3 command-line arguments:
1. **docs-repo-path**: Path to the documentation repository
2. **foundation-ui-repo-path**: Path to the foundation-ui platform repository
3. **commit-hash**: Git commit hash to process

### Automatic Repository Setup

If the specified directories don't exist, the script will:
1. Create the necessary parent directories
2. Clone the appropriate repositories:
   - Docs: `git@github.com:genesiscommunitysuccess/docs.git`
   - Foundation UI: `git@github.com:genesislcap/foundation-ui.git`

### Error Handling

- Validates argument count and provides helpful usage instructions
- Checks for directory existence and handles missing repositories gracefully
- Provides clear error messages for git clone failures
- Uses appropriate exit codes for different error conditions

## Architecture

### Module Structure

#### `src/args.ts`
- **Purpose**: Argument validation and parsing
- **Exports**: 
  - `ScriptArgs` interface
  - `validateAndParseArgs()` function
- **Features**: Returns flags indicating which repositories need to be created

#### `src/index.ts`
- **Purpose**: Main script execution
- **Features**:
  - Imports and uses argument validation
  - Handles directory creation and git cloning
  - Provides user feedback during operations

### TypeScript Configuration

The project uses a modern TypeScript configuration:
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Source Maps**: Generated for debugging
- **Declaration Files**: Generated for type information

## Development Workflow

1. **Write TypeScript** in the `src/` directory
2. **Build** with `npm run build` to compile to JavaScript
3. **Test** with `npm run dev` for development or `npm start` for production
4. **Deploy** by running the compiled JavaScript with appropriate arguments

## Future Enhancements

This foundation is ready for:
- LangChain integration for AI-powered documentation updates
- Automated content generation and processing
- Integration with CI/CD pipelines
- Advanced repository management features

## Dependencies

### Production Dependencies
- None currently (pure Node.js/TypeScript)

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `ts-node` - TypeScript execution engine
- `cross-env` - Cross-platform environment variable handling

## Configuration Files

### `tsconfig.json`
- Configured for Node.js development
- Includes source maps and declaration files
- Excludes `node_modules` and `dist` directories

### `.gitignore`
- Excludes `node_modules`, `dist`, and other build artifacts
- Ignores environment files and IDE configurations
- Includes LangChain-specific patterns for future use

## Notes

- The script uses SSH URLs for git cloning, requiring proper SSH key setup
- Repository paths are validated but not checked for git repository status
- The script creates parent directories recursively if they don't exist
- All git operations use `stdio: 'inherit'` for real-time progress feedback 