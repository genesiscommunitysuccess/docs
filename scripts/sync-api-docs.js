#!/usr/bin/env node

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const LATEST_VERSION_PACKAGE = '@genesislcap/foundation-ui';
const PROCESSED_MAP_PATH = './plugins/api-docs/processedMap.js';
const PACKAGE_JSON_PATH = './package.json';
const MANIFEST_PATH = './plugins/api-docs/src/manifest.ts';

// @genesislcap packages that should be updated (excluding non-foundation packages)
const GENESISLCAP_PACKAGES = [
  '@genesislcap/foundation-comms',
  '@genesislcap/foundation-criteria',
  '@genesislcap/foundation-entity-management',
  '@genesislcap/foundation-fdc3',
  '@genesislcap/foundation-filters',
  '@genesislcap/foundation-forms',
  '@genesislcap/foundation-header',
  '@genesislcap/foundation-i18n',
  '@genesislcap/foundation-layout',
  '@genesislcap/foundation-login',
  '@genesislcap/foundation-notifications',
  '@genesislcap/foundation-openfin',
  '@genesislcap/foundation-redux',
  '@genesislcap/foundation-store',
  '@genesislcap/foundation-testing',
  '@genesislcap/foundation-utils',
  '@genesislcap/foundation-zero',
  '@genesislcap/g2plot-chart',
  '@genesislcap/grid-pro',
  '@genesislcap/grid-tabulator',
  '@genesislcap/expression-builder',
];

function generateProcessedMapContent(packageNameToVersionMap) {
  const header = `/**
 * Maintains a processed map instance as a hot reload workaround to avoid re-processing and entering an infinite loop.
 * TODO: Ideally the plugin should run just once in both dev and prod mode, or be skipped during hot reloads.
 */`;

  const preface = `  /**
   * I've processed this package already, and tailored the readme output, so including it statically here will stop it
   * from reprocessing during re-builds and retain my changes as final. You can also toggle "enabled": true/false in
   * the manifest.json files itself. Removing this static package ref will always re-process enabled packages.
   */`;

  let body = '';
  if (packageNameToVersionMap && Object.keys(packageNameToVersionMap).length > 0) {
    body = Object.entries(packageNameToVersionMap)
      .map(([name, version]) => `  "${name}": "${version}",`)
      .join('\n');
  } else {
    body = '  // All packages cleared for reprocessing';
  }

  return `${header}\nmodule.exports = {\n${preface}\n${body}\n};`;
}

async function getLatestVersion() {
  try {
    const { stdout } = await execAsync(`npm view ${LATEST_VERSION_PACKAGE} version`);
    return stdout.trim();
  } catch (error) {
    console.error(`Failed to get latest version for ${LATEST_VERSION_PACKAGE}:`, error.message);
    throw error;
  }
}

async function checkIfReprocessingNeeded(newVersion) {
  console.log('Checking if reprocessing is needed...');
  
  try {
    const processedMap = require(path.resolve(PROCESSED_MAP_PATH));
    const currentPackages = Object.keys(processedMap);
    
    if (currentPackages.length === 0) {
      console.log('  ✓ processedMap is empty - reprocessing needed');
      return true;
    }
    
    let needsReprocessing = false;
    
    for (const pkg of GENESISLCAP_PACKAGES) {
      const processedVersion = processedMap[pkg];
      if (!processedVersion || processedVersion !== newVersion) {
        console.log(`  ${pkg}: ${processedVersion || 'not processed'} → ${newVersion} (needs reprocessing)`);
        needsReprocessing = true;
      } else {
        console.log(`  ${pkg}: ${processedVersion} ✓ (up to date)`);
      }
    }
    
    if (needsReprocessing) {
      console.log('  ✓ Reprocessing needed - some packages are outdated or not processed');
    } else {
      console.log('  ✓ All packages are up to date in processedMap');
    }
    
    return needsReprocessing;
  } catch (error) {
    console.log('  ✓ processedMap not found or invalid - reprocessing needed');
    return true;
  }
}

async function updatePackageJson(newVersion) {
  console.log(`Updating package.json with version ${newVersion}...`);
  
  const packageJson = await fs.readJson(PACKAGE_JSON_PATH);
  let updated = false;
  
  // Update @genesislcap packages
  for (const pkg of GENESISLCAP_PACKAGES) {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      const oldVersion = packageJson.dependencies[pkg];
      if (oldVersion !== newVersion) {
        packageJson.dependencies[pkg] = newVersion;
        console.log(`  Updated ${pkg}: ${oldVersion} → ${newVersion}`);
        updated = true;
      }
    }
  }
  
  // Update devDependencies
  if (packageJson.devDependencies && packageJson.devDependencies['@genesislcap/genx']) {
    const oldVersion = packageJson.devDependencies['@genesislcap/genx'];
    if (oldVersion !== newVersion) {
      packageJson.devDependencies['@genesislcap/genx'] = newVersion;
      console.log(`  Updated @genesislcap/genx: ${oldVersion} → ${newVersion}`);
      updated = true;
    }
  }
  
  if (updated) {
    await fs.writeJson(PACKAGE_JSON_PATH, packageJson, { spaces: 2 });
    console.log('✓ package.json updated');
  } else {
    console.log('✓ package.json already up to date');
  }
  
  return updated;
}

async function clearProcessedMap() {
  console.log('Clearing processedMap to force reprocessing...');
  
  const processedMapContent = generateProcessedMapContent(null);
  
  await fs.writeFile(path.resolve(PROCESSED_MAP_PATH), processedMapContent);
  console.log('✓ processedMap cleared');
}

async function installDependencies() {
  console.log('Installing updated dependencies...');
  
  try {
    console.log('  Running: npm install');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✓ Dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    console.error('  Command: npm install');
    console.error('  Exit code:', error.status);
    if (error.stdout) console.error('  Stdout:', error.stdout.toString());
    if (error.stderr) console.error('  Stderr:', error.stderr.toString());
    throw error;
  }
}

async function buildApiDocsPlugin() {
  console.log('Building api-docs plugin...');
  
  try {
    console.log('  Running: cd plugins/api-docs && npm run build');
    execSync('cd plugins/api-docs && npm run build', { stdio: 'inherit' });
    console.log('✓ api-docs plugin built');
  } catch (error) {
    console.error('❌ Failed to build api-docs plugin:', error.message);
    console.error('  Command: cd plugins/api-docs && npm run build');
    console.error('  Exit code:', error.status);
    if (error.stdout) console.error('  Stdout:', error.stdout.toString());
    if (error.stderr) console.error('  Stderr:', error.stderr.toString());
    throw error;
  }
}

async function generateDocsFromApiJson() {
  console.log('Generating API docs from .api.json files...');

  const manifest = require(path.resolve('./plugins/api-docs/dist/manifest.js')).default;
  const processedMap = require(path.resolve(PROCESSED_MAP_PATH));

  const packagesToProcess = manifest.packages.filter(
    (pkg) => pkg.enabled && pkg.src.api_docs && pkg.output.api_docs && !(pkg.name in processedMap),
  );

  if (!packagesToProcess.length) {
    console.log('[api-docs] No packages awaiting processing.');
    return { apiDocsCopied: 0 };
  }

  const apiPreamble = await fs.readFile(
    path.resolve('./plugins/api-docs/data/api-preamble.md'),
    'utf8'
  );

  let totalApiDocsCopied = 0;

  for (const pkg of packagesToProcess) {
    const packageRootDir = path.join(process.cwd(), 'node_modules', pkg.name);

    if (!fs.existsSync(packageRootDir)) {
      console.log(`  Package ${pkg.name} not found in node_modules, skipping...`);
      continue;
    }

    const distDir = path.join(packageRootDir, 'dist');
    const apiJsonFiles = fs.existsSync(distDir)
      ? fs.readdirSync(distDir).filter((f) => f.endsWith('.api.json'))
      : [];

    if (!apiJsonFiles.length) {
      console.log(`  No .api.json found for ${pkg.name}, skipping...`);
      continue;
    }

    const tmpInput = fs.mkdtempSync(path.join(os.tmpdir(), 'api-docs-in-'));
    const tmpOutput = fs.mkdtempSync(path.join(os.tmpdir(), 'api-docs-out-'));

    try {
      for (const jsonFile of apiJsonFiles) {
        fs.copyFileSync(path.join(distDir, jsonFile), path.join(tmpInput, jsonFile));
      }

      execSync(`node_modules/.bin/api-documenter markdown -i "${tmpInput}" -o "${tmpOutput}"`, {
        stdio: 'pipe',
      });

      const outputRootDir = path.join(process.cwd(), pkg.output.directory);
      const apiDocsDest = path.join(outputRootDir, pkg.output.api_docs);
      await fs.ensureDir(apiDocsDest);

      const generatedFiles = fs.readdirSync(tmpOutput);
      for (const file of generatedFiles) {
        if (!file.endsWith('.md')) continue;

        let content = await fs.readFile(path.join(tmpOutput, file), 'utf8');

        if (file === 'index.md') {
          content = apiPreamble + '\n' + content;
        } else {
          content = `---\nformat: md\n---\n` + content;
        }

        await fs.writeFile(path.join(apiDocsDest, file), content);
        console.log(`  Generated: ${pkg.name} → ${file}`);
        totalApiDocsCopied++;
      }
    } finally {
      fs.removeSync(tmpInput);
      fs.removeSync(tmpOutput);
    }
  }

  console.log(`✓ API docs generated (${totalApiDocsCopied} files)`);
  return { apiDocsCopied: totalApiDocsCopied };
}

async function updateProcessedMapWithVersions(newVersion) {
  console.log('Updating processedMap with new versions...');
  
  const versionMap = Object.fromEntries(
    GENESISLCAP_PACKAGES.map((pkg) => [pkg, newVersion]),
  );
  const processedMapContent = generateProcessedMapContent(versionMap);
  
  await fs.writeFile(path.resolve(PROCESSED_MAP_PATH), processedMapContent);
  console.log('✓ processedMap updated with new versions');
}

async function createGitBranch() {
  // In GitHub Actions, we're already on a branch, so just return the current branch name
  if (process.env.GITHUB_ACTIONS) {
    const branchName = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || 'main';
    console.log(`Using existing branch in GitHub Actions: ${branchName}`);
    return branchName;
  }
  
  // For local runs, create a new branch
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const branchName = `sync-api-docs-${timestamp}`;
  
  console.log(`Creating git branch: ${branchName}`);
  
  try {
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
    console.log(`✓ Created branch: ${branchName}`);
    return branchName;
  } catch (error) {
    console.error('Failed to create git branch:', error.message);
    throw error;
  }
}

async function commitChanges(newVersion, apiDocsCopied) {
  console.log('Committing changes...');
  
  try {
    // Only add specific files that should be updated by the sync process
    // 1. package.json (for version updates)
    // 2. processedMap.js (for processed map)
    // 3. API docs in docs/ folder (but NOT .mdx files)
    
    console.log('  Adding package.json...');
    execSync('git add package.json', { stdio: 'inherit' });
    
    console.log('  Adding processedMap.js...');
    execSync('git add plugins/api-docs/processedMap.js', { stdio: 'inherit' });
    
    // Add API docs files in docs/ folder, but exclude .mdx files
    // Only add .md files in docs/api/ subdirectories
    console.log('  Adding docs API files...');
    try {
      execSync('git add "docs/**/api/**/*.md"', { stdio: 'inherit' });
      execSync('git add "docs/**/api/**/*.json"', { stdio: 'inherit' });
    } catch (e) {
      console.log('  No API docs files to add (this is normal if no new docs were generated)');
    }
    
    // Check if there are any staged changes
    console.log('  Checking for staged changes...');
    const stagedChanges = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
    
    if (!stagedChanges) {
      console.log('✓ No changes to commit');
      return;
    }
    
    console.log('Files to be committed:');
    console.log(stagedChanges);
    
    // Since this function is only called when API docs exist, we can simplify
    const commitTitle = `chore: upgrade FUI packages to version ${newVersion} + sync FUI api-docs`;
    const commitBody = `- Updated @genesislcap packages to version ${newVersion}\n- Regenerated API documentation from updated packages (${apiDocsCopied} files)\n- Updated processedMap with new versions`;
    
    console.log('  Creating commit...');
    execFileSync('git', ['commit', '-m', `${commitTitle}\n\n${commitBody}`], { stdio: 'inherit' });
    console.log('✓ Changes committed');
  } catch (error) {
    console.error('❌ Failed to commit changes:', error.message);
    console.error('  Exit code:', error.status);
    if (error.stdout) console.error('  Stdout:', error.stdout.toString());
    if (error.stderr) console.error('  Stderr:', error.stderr.toString());
    throw error;
  }
}

async function pushBranch(branchName) {
  console.log(`Pushing branch: ${branchName}`);
  
  try {
    // In GitHub Actions, the PR creation action will handle the push
    if (process.env.GITHUB_ACTIONS) {
      console.log('✓ In GitHub Actions - PR creation will handle the push');
      return;
    }
    
    // For local runs, push the branch
    execSync(`git push -u origin ${branchName}`, { stdio: 'inherit' });
    console.log(`✓ Pushed branch: ${branchName}`);
  } catch (error) {
    console.error('Failed to push branch:', error.message);
    throw error;
  }
}

async function createPullRequest(branchName, newVersion, apiDocsCopied) {
  console.log('Creating pull request...');
  
  // In GitHub Actions, the PR creation action will handle this
  if (process.env.GITHUB_ACTIONS) {
    console.log('✓ In GitHub Actions - PR creation action will handle this');
    return;
  }
  
  // Since this function is only called when API docs exist, we can simplify
  const prTitle = `chore: upgrade FUI packages to version ${newVersion} + sync FUI api-docs`;
  const prDescription = `Updated @genesislcap packages to version ${newVersion} and regenerated API documentation (${apiDocsCopied} files)`;
  
  // For local runs, provide instructions
  console.log('\n=== PULL REQUEST CREATION ===');
  console.log(`Branch: ${branchName}`);
  console.log(`Title: ${prTitle}`);
  console.log(`Description:`);
  console.log(`- Updated @genesislcap packages to version ${newVersion}`);
  console.log(`- Regenerated API documentation from updated packages (${apiDocsCopied} files)`);
  console.log(`- Updated processedMap with new versions`);
  console.log('\nTo create the PR, run:');
  console.log(`gh pr create --title "${prTitle}" --body "${prDescription}" --base main`);
}

function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    createBranch: false,
    commit: false,
    push: false,
    createPR: false,
    dryRun: false
  };
  
  for (const arg of args) {
    switch (arg) {
      case '--create-branch':
        options.createBranch = true;
        break;
      case '--commit':
        options.commit = true;
        break;
      case '--push':
        options.push = true;
        break;
      case '--create-pr':
        options.createPR = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--all':
        options.createBranch = true;
        options.commit = true;
        options.push = true;
        options.createPR = true;
        break;
      case '--help':
      case '-h':
        console.log(`
API Docs Sync Script

Usage: node scripts/sync-api-docs.js [options]

Options:
  --create-branch    Create a new git branch
  --commit           Commit changes to git
  --push             Push branch to remote
  --create-pr        Create pull request (local only)
  --dry-run          Skip all git operations (testing mode)
  --all              Enable all git operations (equivalent to --create-branch --commit --push --create-pr)
  --help, -h         Show this help message

Examples:
  # Just sync docs without git operations
  node scripts/sync-api-docs.js
  
  # Sync docs and commit changes
  node scripts/sync-api-docs.js --commit
  
  # Full automation (branch, commit, push, PR)
  node scripts/sync-api-docs.js --all
        `);
        process.exit(0);
    }
  }
  
  return options;
}

async function performPreflightChecks() {
  console.log('🔍 Performing pre-flight checks...');
  
  // Check if we're in the right directory
  if (!fs.existsSync('./package.json')) {
    throw new Error('package.json not found. Make sure you\'re running this script from the project root.');
  }
  
  // Check if required paths exist
  const requiredPaths = [
    './plugins/api-docs',
    './plugins/api-docs/processedMap.js',
    './scripts/sync-api-docs.js'
  ];
  
  for (const filePath of requiredPaths) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required path not found: ${filePath}`);
    }
  }
  
  // Check if we can run basic git commands
  try {
    execSync('git --version', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('Git is not available or not working properly');
  }
  
  // Check if npm is available
  try {
    execSync('npm --version', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('npm is not available or not working properly');
  }
  
  console.log('✓ Pre-flight checks passed');
}

async function main() {
  try {
    const options = parseArguments();
    
    console.log('🚀 Starting API docs sync automation...\n');
    
    // Step 0: Pre-flight checks
    await performPreflightChecks();
    console.log();
    
    // Step 1: Get latest version
    const latestVersion = await getLatestVersion();
    console.log(`Latest version: ${latestVersion}\n`);
    
    // Step 2: Check if reprocessing is needed
    const needsReprocessing = await checkIfReprocessingNeeded(latestVersion);
    console.log();
    
    // Step 3: Update package.json
    const packageJsonUpdated = await updatePackageJson(latestVersion);
    console.log();
    
    // If no reprocessing needed and no package.json updates, we're done
    if (!needsReprocessing && !packageJsonUpdated) {
      console.log('\n✅ No updates needed - packages are already at the latest version and processed');
      return;
    }
    
    // Step 4: Clear processedMap (if reprocessing is needed)
    if (needsReprocessing) {
      await clearProcessedMap();
    }
    
    // Step 5: Install dependencies (if package.json was updated)
    if (packageJsonUpdated) {
      await installDependencies();
    }
    
    // Step 6: Build api-docs plugin
    await buildApiDocsPlugin();
    
    // Step 7: Generate API docs from .api.json files in node_modules
    const copyResult = await generateDocsFromApiJson();
    const apiDocsCopied = copyResult?.apiDocsCopied || 0;
    
    // Step 8: Update processedMap with new versions
    await updateProcessedMapWithVersions(latestVersion);
    
    // Git operations (optional)
    if (options.dryRun) {
      console.log('\n🏃‍♂️ DRY RUN MODE - All git operations skipped');
      console.log('  ✓ Package updates completed');
      console.log('  ✓ API docs processing completed');
      console.log('  ✓ ProcessedMap updated');
      console.log('  ❌ Git operations skipped (dry run mode)');
    } else if (options.createBranch || options.commit || options.push || options.createPR) {
      console.log('\n📝 Git operations enabled:');
      console.log(`  Create branch: ${options.createBranch}`);
      console.log(`  Commit: ${options.commit}`);
      console.log(`  Push: ${options.push}`);
      console.log(`  Create PR: ${options.createPR}`);
      console.log();
      
      // Check if commits/PRs should be skipped due to no API docs
      if (apiDocsCopied === 0) {
        console.log('⚠️  Skipping git operations - no API docs were found or copied');
        console.log('   Only package version updates were made, no meaningful changes to commit');
        options.createBranch = false;
        options.commit = false;
        options.push = false;
        options.createPR = false;
      }
      
      let branchName = null;
      
      if (options.createBranch) {
        // Step 8: Create git branch
        branchName = await createGitBranch();
      }
      
      if (options.commit) {
        // Step 9: Commit changes
        await commitChanges(latestVersion, apiDocsCopied);
      }
      
      if (options.push && branchName) {
        // Step 10: Push branch
        await pushBranch(branchName);
      }
      
      if (options.createPR && branchName) {
        // Step 11: Create pull request
        await createPullRequest(branchName, latestVersion, apiDocsCopied);
      }
    } else {
      console.log('\n📝 Git operations skipped (use --all, --commit, or other flags to enable)');
    }
    
    console.log('\n🎉 API docs sync completed successfully!');
    
  } catch (error) {
    console.error('\n❌ API docs sync failed:', error.message);
    console.error('\nFull error details:');
    console.error('  Stack trace:', error.stack);
    if (error.stdout) console.error('  Stdout:', error.stdout.toString());
    if (error.stderr) console.error('  Stderr:', error.stderr.toString());
    if (error.status) console.error('  Exit code:', error.status);
    if (error.signal) console.error('  Signal:', error.signal);
    
    // Also try to print current working directory and git status for debugging
    try {
      console.error('\nDebugging information:');
      console.error('  Current working directory:', process.cwd());
      console.error('  Git status:');
      execSync('git status --porcelain', { stdio: 'inherit' });
    } catch (debugError) {
      console.error('  Could not get debugging info:', debugError.message);
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  getLatestVersion,
  checkIfReprocessingNeeded,
  updatePackageJson,
  clearProcessedMap,
  installDependencies,
  buildApiDocsPlugin,
  generateDocsFromApiJson,
  updateProcessedMapWithVersions,
  createGitBranch,
  commitChanges,
  pushBranch,
  createPullRequest,
};
