const fs = require('fs-extra');
const path = require('path');

/**
 * Docusaurus build can't process empty comments in markdown
 */
function cleanseMarkdownContent(input) {
    return input.replace(/<!-- -->/g, '');
}

async function createApiDoc(inputFile, outputFile) {
    const content = await fs.readFile(inputFile, { encoding: 'utf8' });
    return fs.writeFile(outputFile, cleanseMarkdownContent(content));
}

async function createReadme(inputFile, outputDir, output) {
    const tags = output.tags ? output.tags.map(tag => `  - ${tag}`).join('\n') : '';
    const keywords = output.keywords ? `[${output.keywords.join(', ')}]` : '';
    const outputFile = path.join(outputDir, output.readme);
    const readStream = await fs.createReadStream(inputFile, { encoding: 'utf8' });
    const writeStream = await fs.createWriteStream(outputFile, { encoding: 'utf8' });
    await writeStream.write(
`---
title: '${output.title}'
sidebar_label: '${output.sidebar_label}'
id: ${output.id}
`);
    if (keywords) {
        await writeStream.write(`keywords: ${keywords}\n`);
    }
    if (tags) {
        await writeStream.write(`tags:\n${tags}\n`);
    }
    await writeStream.write(`---\n\n`);
    /**
     * TODO: Remap any api docs links contained in the README.md file to the target outputApiDocsDir
     */
    await readStream.pipe(writeStream);
}

async function copyApiDocs(manifest, processedMap) {
    const { packages } = manifest;
    const packagesToProcess = packages.filter(pkg => pkg.enabled && !(pkg.name in processedMap));
    if (!packagesToProcess.length) {
        console.log('[api-docs-plugin] No packages awaiting processing.');
        return;
    }
    for await (const pkg of packagesToProcess) {
        /**
         * Package inputs
         */
        const packageRootDir = path.join(process.cwd(), 'node_modules', pkg.name);
        const packageJson = await fs.readJson(path.join(packageRootDir, 'package.json'));
        const packageApiDocsDir = path.join(packageRootDir, pkg.api_docs);
        const packageReadmeFile = path.join(packageRootDir, pkg.readme);
        /**
         * Docusaurus outputs
         */
        const outputRootDir = path.join(process.cwd(), pkg.output.directory);
        await fs.ensureDir(outputRootDir);
        const outputApiDocsDir = path.join(outputRootDir, pkg.output.api_docs);
        await fs.ensureDir(outputApiDocsDir);

        /**
         * Write api docs
         */
        const packageApiDocs = await fs.readdir(packageApiDocsDir);
        for await (const fileName of packageApiDocs) {
            const inputFile = path.join(packageApiDocsDir, fileName);
            const outputFile = path.join(outputApiDocsDir, fileName);
            await createApiDoc(inputFile, outputFile);
        }

        /**
         * Write readme file, use git to merge in acceptable changes to existing file after write occurs
         */
        await createReadme(packageReadmeFile, outputRootDir, pkg.output);

        /**
         * Mark as processed
         */
        processedMap[pkg.name] = packageJson.version;
    }
}

module.exports = async function (context, options) {
    let {manifest, processedMap} = options;
    if (!manifest) {
        throw new Error('[api-docs-plugin] Please provide a manifest file.');
    }
    if (!processedMap) {
        throw new Error('[api-docs-plugin] Please provide a processedMap instance.');
    }
    let status = true;
    let error;
    try {
        await copyApiDocs(manifest, processedMap);
    } catch (e) {
        status = false;
        error = e;
    }
    return {
        name: 'api-docs-plugin',
        async loadContent() {
            if (!status) {
                throw new Error(`[api-docs-plugin] Failed to process api documentation. ${error.toString()}`);
            }
        }
    };
};
