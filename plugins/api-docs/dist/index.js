"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fileStreams_1 = require("./fileStreams");
const stream_1 = require("stream");
const copyFunctions_1 = require("./copyFunctions");
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
async function copyPackageFiles(manifest, processedMap) {
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
        if (pkg.src.api_docs && pkg.output.api_docs) {
            await copyDirFiles({
                inputDir: pkg.src.api_docs,
                outputDir: pkg.output.api_docs,
                copyFn: copyFunctions_1.createApiDoc,
            });
        }
        if (pkg.src.img_dir && pkg.output.img_dir) {
            await copyDirFiles({
                inputDir: pkg.src.img_dir,
                outputDir: pkg.output.img_dir,
                copyFn: copyFunctions_1.copyImgFile,
            });
        }
        const readmeStreamTransformer = (0, fileStreams_1.createUrlTransformerSteam)(pkg.output);
        const readmeDuplexStream = (0, fileStreams_1.createOutputDuplexStream)(pkg.output, outputRootDir, readmeStreamTransformer);
        const packageReadmeFile = path_1.default.join(packageRootDir, pkg.src.readme);
        const readStream = fs_extra_1.default.createReadStream(packageReadmeFile, {
            encoding: "utf8",
        });
        (0, stream_1.pipeline)(readStream, readmeDuplexStream, (err) => {
            if (err) {
                console.error(`Pipeline failed. ${err}`);
            }
        });
        const packageJsonPath = path_1.default.join(packageRootDir, "package.json");
        if (fs_extra_1.default.existsSync(packageJsonPath)) {
            const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
            processedMap[pkg.name] = packageJson.version;
        }
    }
}
async function default_1(_ctx, options) {
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
        await copyPackageFiles(manifest, processedMap);
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
            else {
                console.log("[api-docs-plugin] Finished processing api documentation.\n");
            }
        },
    };
}
exports.default = default_1;
