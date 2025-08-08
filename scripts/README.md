# API Docs Sync Automation

This directory contains scripts to automate the synchronization of API documentation from @genesislcap packages.

## Overview

The API docs sync process automatically:
1. Checks for the latest version of @genesislcap packages
2. Updates package.json with new versions
3. Clears the processedMap to force reprocessing
4. Installs updated dependencies
5. Builds the api-docs plugin
6. Copies documentation without starting the server
7. Updates processedMap with new versions
8. Creates a git branch and commits changes
9. Pushes the branch and creates a pull request

## Manual Usage

### Basic Sync (No Git Operations)
To run the sync process without git operations:

```bash
npm run sync-api-docs
```

Or directly:

```bash
node scripts/sync-api-docs.js
```

This will:
1. Check for the latest version of @genesislcap packages
2. Check if reprocessing is needed by comparing processedMap versions
3. Update package.json if needed
4. Clear processedMap only if reprocessing is needed
5. Install updated dependencies with `npm install` (only if package.json was updated)
6. Build the api-docs plugin
7. Copy API documentation files (`.md` files in `docs/api/` folders only)
8. **Never touch `.mdx` files** - these are preserved as-is
9. Update processedMap with new versions

### Full Automation (With Git Operations)
To run the complete automation including git operations:

```bash
npm run sync-api-docs:full
```

Or directly:

```bash
node scripts/sync-api-docs.js --all
```

This will do everything above plus:
10. Create a git branch
11. Commit changes
12. Push the branch
13. Provide PR creation instructions

### Command Line Options
```bash
# Just sync docs without git operations
node scripts/sync-api-docs.js

# Sync docs and commit changes
node scripts/sync-api-docs.js --commit

# Full automation (branch, commit, push, PR)
node scripts/sync-api-docs.js --all

# Show help
node scripts/sync-api-docs.js --help
```

## Automated Workflow

The process is automated via GitHub Actions and runs:
- **Scheduled**: Every day at 9 AM UTC
- **Manual**: Can be triggered manually via GitHub Actions UI

## What Gets Updated

The script updates the following @genesislcap packages:
- foundation-comms
- foundation-criteria
- foundation-entity-management
- foundation-fdc3
- foundation-filters
- foundation-forms
- foundation-header
- foundation-i18n
- foundation-layout
- foundation-login
- foundation-notifications
- foundation-openfin
- foundation-store
- foundation-testing
- foundation-utils
- foundation-zero
- g2plot-chart
- grid-pro
- grid-tabulator
- expression-builder

Plus the dev dependency:
- @genesislcap/genx

## How It Works

1. **Version Check**: Uses `@genesislcap/foundation-ui` as the reference package to get the latest version
2. **Package Update**: Updates all @genesislcap packages in package.json to the latest version
3. **Dependency Installation**: Runs `npm install` to get the updated packages
4. **Plugin Build**: Builds the api-docs plugin TypeScript code
5. **Documentation Copy**: Runs the copy process without starting the Docusaurus server
6. **ProcessedMap Update**: Updates the processedMap with new versions to prevent reprocessing
7. **Git Operations**: Creates a branch, commits changes, and pushes to create a PR

## Troubleshooting

### Common Issues

1. **No updates needed**: If packages are already at the latest version, the script will exit early
2. **Build failures**: Check that the api-docs plugin builds successfully
3. **Copy failures**: Ensure all packages have the expected documentation structure
4. **Git issues**: Make sure you have proper git credentials configured

### Manual Steps

If the automation fails, you can perform the steps manually:

1. Clear processedMap.js
2. Update package.json versions
3. Run `npm install`
4. Run `cd plugins/api-docs && npm run build`
5. Run `npm run start:copy-docs` (then stop the server)
6. Update processedMap.js with new versions
7. Commit and push changes

## Configuration

The script is configured via constants at the top of `sync-api-docs.js`:

- `LATEST_VERSION_PACKAGE`: Reference package for version checking
- `GENESISLCAP_PACKAGES`: List of packages to update
- File paths for various configuration files

## Dependencies

The script requires:
- Node.js 20.10.0+
- npm
- git
- GitHub CLI (for PR creation)

## Security

The script runs with the following security considerations:
- Uses `GITHUB_TOKEN` for authentication
- Creates temporary files that are cleaned up
- Validates package versions before updating
- Creates isolated git branches for changes
