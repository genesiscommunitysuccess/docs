# API Docs Generation

This directory contains scripts for generating and synchronising API documentation from `@genesislcap` packages into this docs site.

## How it works

API documentation is derived from the TypeScript source in each package via a two-stage pipeline:

```
Source repo build
  TypeScript source
      ↓  api-extractor
  dist/*.api.json          ← structured model of the public API surface
      ↓  published to npm

This docs repo
  npm install
      ↓
  node_modules/@genesislcap/*/dist/*.api.json
      ↓  api-documenter  (runs here, via generate:api-docs)
  docs/**/api/**/*.md      ← committed to this repo
```

The `*.api.json` files are produced by api-extractor as a standard part of each package's build and have always been published to npm — they are not tracked in this repo's git history. The `*.md` files are generated here and committed. Source packages do **not** need to run api-documenter or publish pre-generated markdown to npm.

## Scripts

### `generate:api-docs` — everyday use

Generates markdown from the `.api.json` files already present in `node_modules`. No version bumping, no npm install, no git operations.

```bash
# Generate docs for any packages not yet in processedMap
npm run generate:api-docs

# Regenerate all packages from scratch (ignores processedMap)
npm run generate:api-docs -- --force
```

When to use this:
- After a manual `npm install` to pick up a new package version
- When you want to regenerate docs for a specific package (clear its entry from `plugins/api-docs/processedMap.js` first, then run without `--force`)
- To verify the output of the generation locally before committing

### `sync-api-docs` — full orchestration

Checks for a newer published version of `@genesislcap` packages, updates `package.json`, runs `npm install`, generates the docs, and optionally handles git operations.

```bash
# Check for updates, generate docs — no git operations
npm run sync-api-docs

# Full automation: version bump + npm install + generate + branch + commit + push + PR
npm run sync-api-docs:full
```

Command-line flags for `sync-api-docs.js`:

```bash
node scripts/sync-api-docs.js                # sync only, no git
node scripts/sync-api-docs.js --commit       # sync + commit
node scripts/sync-api-docs.js --all          # branch + commit + push + PR
node scripts/sync-api-docs.js --dry-run      # skip all git operations
node scripts/sync-api-docs.js --help         # show all options
```

## Automated workflow

`sync-api-docs:full` runs automatically via GitHub Actions:

- **Scheduled**: every day at 9 AM UTC
- **Manual**: can be triggered from the GitHub Actions UI

## Configuration

The list of packages and their output paths is defined in `plugins/api-docs/src/manifest.ts`. Each entry maps a package name to a source path (`src.api_docs`) and an output directory (`output.api_docs`).

The `plugins/api-docs/processedMap.js` file records which package versions have already been processed. Remove an entry (or use `--force`) to trigger regeneration for that package.

Key constants at the top of `sync-api-docs.js`:

- `LATEST_VERSION_PACKAGE` — reference package used to determine the latest version
- `GENESISLCAP_PACKAGES` — list of packages whose versions are kept in sync

## Troubleshooting

### Regenerating docs manually

If automation fails or you need to regenerate from scratch:

1. Clear `plugins/api-docs/processedMap.js` (set the exports to `{}`)
2. Run `npm install` to ensure packages are up to date
3. Run `npm run generate:api-docs -- --force`
4. Commit the resulting changes in `docs/**/api/`

### Plugin build errors

If `plugins/api-docs/dist/manifest.js` is missing, rebuild it:

```bash
cd plugins/api-docs && npm run build
```

`generate:api-docs` will do this automatically if the built manifest is not found.

### A package has no `.api.json`

The script will log a `[SKIP]` warning and move on. This means the package was built without api-extractor. The source repo needs to add an api-extractor step to its build before docs can be generated for that package.

## Dependencies

- Node.js 20.10.0+
- npm
- git (for `sync-api-docs` git operations)
- GitHub CLI `gh` (for PR creation)
- `@microsoft/api-documenter` — installed as a devDependency in this repo
