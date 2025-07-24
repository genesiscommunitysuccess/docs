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
│   ├── args.ts           # Argument validation and parsing
│   ├── types/            # Shared type definitions
│   │   ├── result.ts     # Result type for error handling
│   │   └── index.ts      # Type exports
│   ├── services/
│   │   └── ai-service/   # AI service implementations
│   │       ├── types.ts      # TypeScript interfaces
│   │       ├── mock.ts       # Mock implementation
│   │       ├── langchain.ts  # LangChain implementation
│   │       └── index.ts      # Factory function
│   └── repositories/
│       └── git/          # Git repository service
│           ├── types.ts      # TypeScript interfaces
│           ├── mock.ts       # Mock implementation
│           ├── repository.ts # Real implementation
│           └── index.ts      # Factory function
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
- Anthropic API key (for real AI service)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your Anthropic API key
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

# Use LangChain AI service
npm run dev:langchain
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
- `npm run dev:langchain` - Runs with LangChain AI service

## Features

### Error Handling with Result Types

The project uses a robust `Result<S, E>` type for error handling throughout the codebase:

```typescript
type Result<S, E> = Success<S> | Error<E>
```

This provides:
- **Type Safety**: Compile-time error handling
- **Explicit Error States**: No hidden exceptions
- **Functional Programming**: Immutable, composable results
- **Rich Error Information**: Detailed error types and messages

### Git Repository Error Types

The git repository service returns specific error types:

- `invalid_commit_hash`: Commit hash is malformed or doesn't exist
- `repository_not_found`: Repository path doesn't exist
- `repository_not_git`: Path exists but is not a git repository
- `git_command_failed`: Git command execution failed
- `unknown`: Unexpected errors

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

#### `src/types/`
- **Purpose**: Shared type definitions and utilities
- **Files**:
  - `result.ts`: Result type for error handling
  - `index.ts`: Type exports
- **Features**: Provides functional programming patterns for error handling

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
  - Uses Result types for robust error handling

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
- `dotenv` - Environment variable loading

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