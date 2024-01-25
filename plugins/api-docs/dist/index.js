"use strict";
const fs = require("fs-extra");
const path = require("path");
const { createUrlTransformerSteam } = require("./streamTransformers");
function cleanseMarkdownContent(input) {
    return input.replace(/<!-- -->/g, "").replace(/<b>|<\/b>/g, "**");
}
async function createApiDoc(inputFile, outputFile) {
    let content = await fs.readFile(inputFile, { encoding: "utf8" });
    if (path.basename(outputFile) === "index.md") {
        content =
            (await fs.readFile("./plugins/api-docs/api-preamble.md", {
                encoding: "utf8",
            })) +
                "\n" +
                content;
    }
    return fs.writeFile(outputFile, cleanseMarkdownContent(content));
}
async function copyImgFile(inputFile, outputFile) {
    const content = await fs.readFile(inputFile);
    return fs.writeFile(outputFile, content);
}
async function createReadme(inputFile, outputDir, output, transformer) {
    const tags = output.tags
        ? output.tags.map((tag) => `  - ${tag}`).join("\n")
        : "";
    const keywords = output.keywords ? `[${output.keywords.join(", ")}]` : "";
    const outputFile = path.join(outputDir, output.readme);
    const readStream = fs.createReadStream(inputFile, { encoding: "utf8" });
    const writeStream = fs.createWriteStream(outputFile, { encoding: "utf8" });
    writeStream.write(`---
title: '${output.title}'
sidebar_label: '${output.sidebar_label}'
id: ${output.id}
`);
    if (keywords) {
        writeStream.write(`keywords: ${keywords}\n`);
    }
    if (tags) {
        writeStream.write(`tags:\n${tags}\n`);
    }
    writeStream.write(`---\n\n`);
    readStream.pipe(transformer).pipe(writeStream);
}
function copyDirectoryFiles(packageRootDir, outputRootDir) {
    return async function ({ inputDir, outputDir, copyFn }) {
        const inputFullDir = path.join(packageRootDir, inputDir);
        const outputFullDir = path.join(outputRootDir, outputDir);
        await fs.ensureDir(outputFullDir);
        const filesInDir = await fs.readdir(inputFullDir);
        for await (const fileName of filesInDir) {
            const inputFile = path.join(inputFullDir, fileName);
            const outputFile = path.join(outputFullDir, fileName);
            await copyFn(inputFile, outputFile);
        }
    };
}
async function copyApiDocs(manifest, processedMap) {
    const { packages } = manifest;
    const packagesToProcess = packages.filter((pkg) => pkg.enabled && !(pkg.name in processedMap));
    if (!packagesToProcess.length) {
        console.log("[api-docs-plugin] No packages awaiting processing.");
        return;
    }
    for await (const pkg of packagesToProcess) {
        const packageRootDir = path.join(process.cwd(), "node_modules", pkg.name);
        const outputRootDir = path.join(process.cwd(), pkg.output.directory);
        await fs.ensureDir(outputRootDir);
        const copyDirFiles = copyDirectoryFiles(packageRootDir, outputRootDir);
        if (pkg.api_docs && pkg.output.api_docs) {
            await copyDirFiles({
                inputDir: pkg.api_docs,
                outputDir: pkg.output.api_docs,
                copyFn: createApiDoc,
            });
        }
        if (pkg.img_dir && pkg.output.img_dir) {
            await copyDirFiles({
                inputDir: pkg.img_dir,
                outputDir: pkg.output.img_dir,
                copyFn: copyImgFile,
            });
        }
        const readmeStreamTransformer = createUrlTransformerSteam(pkg.output);
        const packageReadmeFile = path.join(packageRootDir, pkg.readme);
        await createReadme(packageReadmeFile, outputRootDir, pkg.output, readmeStreamTransformer);
        const packageJson = await fs.readJson(path.join(packageRootDir, "package.json"));
        processedMap[pkg.name] = packageJson.version;
    }
}
module.exports = async function (context, options) {
    let { manifest, processedMap } = options;
    if (!manifest) {
        throw new Error("[api-docs-plugin] Please provide a manifest file.");
    }
    if (!processedMap) {
        throw new Error("[api-docs-plugin] Please provide a processedMap instance.");
    }
    let status = true;
    let error;
    try {
        await copyApiDocs(manifest, processedMap);
    }
    catch (e) {
        status = false;
        error = e;
    }
    return {
        name: "api-docs-plugin",
        async loadContent() {
            if (!status) {
                throw new Error(`[api-docs-plugin] Failed to process api documentation. ${error.toString()}`);
            }
        },
    };
};
