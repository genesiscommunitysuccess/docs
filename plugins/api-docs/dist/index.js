"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const streamTransformers_1 = require("./streamTransformers");
function cleanseMarkdownContent(input) {
    return input.replace(/<!-- -->/g, "").replace(/<b>|<\/b>/g, "**");
}
async function createApiDoc(inputFile, outputFile) {
    let content = await fs_extra_1.default.readFile(inputFile, { encoding: "utf8" });
    if (path_1.default.basename(outputFile) === "index.md") {
        content =
            (await fs_extra_1.default.readFile(require.resolve('api-docs-sync/api-preamble'), {
                encoding: "utf8",
            })) +
                "\n" +
                content;
    }
    return fs_extra_1.default.writeFile(outputFile, cleanseMarkdownContent(content));
}
async function copyImgFile(inputFile, outputFile) {
    const content = await fs_extra_1.default.readFile(inputFile);
    return fs_extra_1.default.writeFile(outputFile, content);
}
async function createReadme(inputFile, outputDir, output, transformer) {
    const tags = output.tags
        ? output.tags.map((tag) => `  - ${tag}`).join("\n")
        : "";
    const keywords = output.keywords ? `[${output.keywords.join(", ")}]` : "";
    const outputFile = path_1.default.join(outputDir, output.readme);
    const readStream = fs_extra_1.default.createReadStream(inputFile, { encoding: "utf8" });
    const writeStream = fs_extra_1.default.createWriteStream(outputFile, { encoding: "utf8" });
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
    return async function ({ inputDir, outputDir, copyFn, }) {
        const inputFullDir = path_1.default.join(packageRootDir, inputDir);
        const outputFullDir = path_1.default.join(outputRootDir, outputDir);
        await fs_extra_1.default.ensureDir(outputFullDir);
        const filesInDir = await fs_extra_1.default.readdir(inputFullDir);
        for await (const fileName of filesInDir) {
            const inputFile = path_1.default.join(inputFullDir, fileName);
            const outputFile = path_1.default.join(outputFullDir, fileName);
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
        const packageRootDir = path_1.default.join(process.cwd(), "node_modules", pkg.name);
        const outputRootDir = path_1.default.join(process.cwd(), pkg.output.directory);
        await fs_extra_1.default.ensureDir(outputRootDir);
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
        const readmeStreamTransformer = (0, streamTransformers_1.createUrlTransformerSteam)(pkg.output);
        const packageReadmeFile = path_1.default.join(packageRootDir, pkg.readme);
        await createReadme(packageReadmeFile, outputRootDir, pkg.output, readmeStreamTransformer);
        const packageJson = await fs_extra_1.default.readJson(path_1.default.join(packageRootDir, "package.json"));
        processedMap[pkg.name] = packageJson.version;
    }
}
async function default_1(_context, options) {
    let { manifest, processedMap } = options;
    console.log({ manifest, processedMap });
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
                throw new Error(`[api-docs-plugin] Failed to process api documentation. ${error?.toString()}`);
            }
        },
    };
}
exports.default = default_1;
