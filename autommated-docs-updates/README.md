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
│   │   └── git-service/  # Git service implementations
│   │       ├── types.ts      # TypeScript interfaces
│   │       └── index.ts      # Factory function
│   └── repositories/
│       ├── ai/           # AI repository implementations
│       │   ├── types.ts      # TypeScript interfaces
│       │   ├── mock.ts       # Mock implementation
│       │   ├── langchain.ts  # LangChain implementation
│       │   └── index.ts      # Factory function
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

### Environment Variables

- `USE_MOCK_SERVICES`: Controls whether to use mock or real services
  - `true`: Use mock services (default for development)
  - `false`: Use real services (requires API keys)
- `DOCS_REPOSITORY_PATH`: Path to the docs repository (defaults to `/Users/matt.walker/genesis/docs`)
- `FOUNDATION_UI_REPOSITORY_PATH`: Path to the foundation-ui repository (defaults to `/Users/matt.walker/genesis/foundation-ui`)
- `ANTHROPIC_API_KEY`: Required for real AI service (LangChain)

### Development Setup

The project is configured with TypeScript and includes:
- **TypeScript**: For type-safe development
- **ts-node**: For running TypeScript directly during development
- **@types/node**: Type definitions for Node.js

## Usage

### Development Mode

Run the script with pre-configured paths for development:

```bash
# Use mock services (default)
npm run dev

# Use real services
USE_MOCK_SERVICES=false npm run dev
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
- `npm run dev` - Runs TypeScript directly with pre-configured paths (uses mock services by default)
- `npm run dev:mock` - Runs with mock services for testing
- `npm run dev:real` - Runs with real services (requires API keys)
- `USE_MOCK_SERVICES=true npm run dev` - Explicitly use mock services for testing
- `USE_MOCK_SERVICES=false npm run dev` - Use real services (requires API keys)

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

### Repository Usage

The project uses repositories for data access and services for business logic:

#### Git Service Usage

The git service wraps the repository service and can be configured for different repositories:

```typescript
// Create git service for docs repository
const docsGitService = createGitService({ 
  repositoryType: 'docs',
  useMock: true 
});

// Create git service for foundation-ui repository
const fuiGitService = createGitService({ 
  repositoryType: 'foundation-ui',
  useMock: false 
});

// Use the service
const result = await docsGitService.getCommitInfo('abc12345');
if (Result.isSuccess(result)) {
  console.log(result.value.message);
} else {
  console.log(result.message.message);
}
```

#### AI Repository Usage

The AI repository provides AI analysis capabilities:

```typescript
// Create AI repository with mock implementation
const mockAIRepository = createAIRepository({ useMock: true });

// Create AI repository with LangChain implementation
const realAIRepository = createAIRepository({ useMock: false });

// Use the repository
const needsUpdate = await mockAIRepository.shouldUpdateDocs('abc12345');
console.log(`Documentation updates needed: ${needsUpdate}`);
```

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

#### `src/services/git-service/`
- **Purpose**: Git service that wraps repository services
- **Files**:
  - `types.ts`: Git service interfaces and types
  - `index.ts`: Git service implementation and factory
- **Features**: 
  - Takes repository type as configuration parameter
  - Delegates to underlying git repository service
  - Provides unified interface for git operations

#### `src/repositories/ai/`
- **Purpose**: AI repository implementations
- **Files**:
  - `types.ts`: AI repository interfaces and types
  - `mock.ts`: Mock AI repository for testing
  - `langchain.ts`: LangChain AI repository implementation
  - `index.ts`: AI repository factory function
- **Features**: 
  - Mock implementation for testing without API calls
  - LangChain implementation for real AI analysis
  - Factory pattern for easy switching between implementations

#### `src/index.ts`
- **Purpose**: Main script execution
- **Features**:
  - Imports and uses argument validation
  - Handles directory creation and git cloning
  - Provides user feedback during operations
  - Uses Result types for robust error handling
  - Uses git service for repository operations

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