#!/usr/bin/env node

/**
 * Standalone script: generates API docs directly from the .api.json files
 * that are published inside each @genesislcap package's dist/ folder.
 *
 * Unlike sync-api-docs.js this script does NOT update package.json versions,
 * run npm install, or perform any git operations. It simply:
 *   1. Reads the manifest to find which packages need docs
 *   2. Runs @microsoft/api-documenter on their .api.json files
 *   3. Writes the resulting markdown to the configured output directories
 *
 * Usage:
 *   npm run generate:api-docs            # process only unprocessed packages
 *   npm run generate:api-docs -- --force # reprocess all packages regardless
 */

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const PROCESSED_MAP_PATH = './plugins/api-docs/processedMap.js';

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    force: args.includes('--force') || args.includes('-f'),
  };
}

async function main() {
  const { force } = parseArgs();

  console.log('Generating API docs from .api.json files in node_modules...\n');

  if (!fs.existsSync('./package.json')) {
    throw new Error('Run this script from the project root.');
  }
  if (!fs.existsSync('./plugins/api-docs/dist/manifest.js')) {
    console.log('Building api-docs plugin first...');
    execSync('cd plugins/api-docs && npm run build', { stdio: 'inherit' });
  }

  // Delete the require cache so we get fresh copies after any rebuild
  Object.keys(require.cache).forEach((k) => {
    if (k.includes('plugins/api-docs')) delete require.cache[k];
  });

  const manifest = require(path.resolve('./plugins/api-docs/dist/manifest.js')).default;
  const processedMap = force ? {} : (() => {
    try { return require(path.resolve(PROCESSED_MAP_PATH)); } catch { return {}; }
  })();

  const packagesToProcess = manifest.packages.filter(
    (pkg) => pkg.enabled && pkg.src?.api_docs && pkg.output?.api_docs && !(pkg.name in processedMap),
  );

  if (!packagesToProcess.length) {
    console.log('All packages are already processed. Use --force to regenerate everything.');
    return;
  }

  console.log(`Processing ${packagesToProcess.length} package(s):\n`);

  const apiPreamble = await fs.readFile(
    path.resolve('./plugins/api-docs/data/api-preamble.md'),
    'utf8',
  );

  let totalFiles = 0;
  const newProcessedEntries = { ...processedMap };

  for (const pkg of packagesToProcess) {
    const packageRootDir = path.join(process.cwd(), 'node_modules', pkg.name);

    if (!fs.existsSync(packageRootDir)) {
      console.warn(`  [SKIP] ${pkg.name} — not found in node_modules`);
      continue;
    }

    const distDir = path.join(packageRootDir, 'dist');
    const apiJsonFiles = fs.existsSync(distDir)
      ? fs.readdirSync(distDir).filter((f) => f.endsWith('.api.json'))
      : [];

    if (!apiJsonFiles.length) {
      console.warn(`  [SKIP] ${pkg.name} — no .api.json in dist/`);
      continue;
    }

    process.stdout.write(`  ${pkg.name} ... `);

    const tmpInput = fs.mkdtempSync(path.join(os.tmpdir(), 'api-docs-in-'));
    const tmpOutput = fs.mkdtempSync(path.join(os.tmpdir(), 'api-docs-out-'));

    try {
      for (const jsonFile of apiJsonFiles) {
        fs.copyFileSync(path.join(distDir, jsonFile), path.join(tmpInput, jsonFile));
      }

      execSync(
        `node_modules/.bin/api-documenter markdown -i "${tmpInput}" -o "${tmpOutput}"`,
        { stdio: 'pipe' },
      );

      const outputRootDir = path.join(process.cwd(), pkg.output.directory);
      const apiDocsDest = path.join(outputRootDir, pkg.output.api_docs);
      await fs.ensureDir(apiDocsDest);

      const generatedFiles = fs.readdirSync(tmpOutput);
      let pkgFileCount = 0;

      for (const file of generatedFiles) {
        if (!file.endsWith('.md')) continue;

        let content = await fs.readFile(path.join(tmpOutput, file), 'utf8');

        // api-documenter inserts <!-- --> as a separator in generic type expressions
        // (e.g. Promise<[T](link.md)<!-- -->>) and between union type references to
        // prevent generic HTML parsers from treating `Promise<...>` as an unclosed
        // HTML tag. Docusaurus's remark/rehype pipeline handles angle brackets in
        // prose correctly without this workaround, so the comments are pure noise
        // here. Remove this line if you switch away from Docusaurus to a renderer
        // that needs the original api-documenter output unchanged.
        content = content.replaceAll('<!-- -->', '');

        if (file === 'index.md') {
          content = apiPreamble + '\n' + content;
        } else {
          content = `---\nformat: md\n---\n` + content;
        }

        await fs.writeFile(path.join(apiDocsDest, file), content);
        pkgFileCount++;
      }

      totalFiles += pkgFileCount;
      console.log(`${pkgFileCount} files`);

      // Record this package as processed (using its installed version)
      try {
        const pkgJson = require(path.join(packageRootDir, 'package.json'));
        newProcessedEntries[pkg.name] = pkgJson.version;
      } catch {
        newProcessedEntries[pkg.name] = 'unknown';
      }
    } catch (err) {
      console.error(`FAILED\n    ${err.message}`);
    } finally {
      fs.removeSync(tmpInput);
      fs.removeSync(tmpOutput);
    }
  }

  // Persist processed map so re-runs skip already-done packages
  const header = `/**
 * Auto-generated by generate-api-docs.js — do not edit by hand.
 * Remove a package entry (or run with --force) to trigger regeneration.
 */`;
  const body = Object.entries(newProcessedEntries)
    .map(([name, version]) => `  "${name}": "${version}",`)
    .join('\n');
  await fs.writeFile(
    path.resolve(PROCESSED_MAP_PATH),
    `${header}\nmodule.exports = {\n${body}\n};\n`,
  );

  console.log(`\n✓ Done — ${totalFiles} markdown files written.`);
}

main().catch((err) => {
  console.error('\n❌', err.message);
  process.exit(1);
});
