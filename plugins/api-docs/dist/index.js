"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const fs = require("fs-extra");
const path = require("path");
const { createUrlTransformerSteam } = require("./streamTransformers");
function cleanseMarkdownContent(input) {
    return input.replace(/<!-- -->/g, "").replace(/<b>|<\/b>/g, "**");
}
function createApiDoc(inputFile, outputFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield fs.readFile(inputFile, { encoding: "utf8" });
        if (path.basename(outputFile) === "index.md") {
            content =
                (yield fs.readFile("./plugins/api-docs/api-preamble.md", {
                    encoding: "utf8",
                })) +
                    "\n" +
                    content;
        }
        return fs.writeFile(outputFile, cleanseMarkdownContent(content));
    });
}
function copyImgFile(inputFile, outputFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs.readFile(inputFile);
        return fs.writeFile(outputFile, content);
    });
}
function createReadme(inputFile, outputDir, output, transformer) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function copyDirectoryFiles(packageRootDir, outputRootDir) {
    return function ({ inputDir, outputDir, copyFn }) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const inputFullDir = path.join(packageRootDir, inputDir);
            const outputFullDir = path.join(outputRootDir, outputDir);
            yield fs.ensureDir(outputFullDir);
            const filesInDir = yield fs.readdir(inputFullDir);
            try {
                for (var _d = true, filesInDir_1 = __asyncValues(filesInDir), filesInDir_1_1; filesInDir_1_1 = yield filesInDir_1.next(), _a = filesInDir_1_1.done, !_a;) {
                    _c = filesInDir_1_1.value;
                    _d = false;
                    try {
                        const fileName = _c;
                        const inputFile = path.join(inputFullDir, fileName);
                        const outputFile = path.join(outputFullDir, fileName);
                        yield copyFn(inputFile, outputFile);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = filesInDir_1.return)) yield _b.call(filesInDir_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    };
}
function copyApiDocs(manifest, processedMap) {
    var _a, e_2, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const { packages } = manifest;
        const packagesToProcess = packages.filter((pkg) => pkg.enabled && !(pkg.name in processedMap));
        if (!packagesToProcess.length) {
            console.log("[api-docs-plugin] No packages awaiting processing.");
            return;
        }
        try {
            for (var _d = true, packagesToProcess_1 = __asyncValues(packagesToProcess), packagesToProcess_1_1; packagesToProcess_1_1 = yield packagesToProcess_1.next(), _a = packagesToProcess_1_1.done, !_a;) {
                _c = packagesToProcess_1_1.value;
                _d = false;
                try {
                    const pkg = _c;
                    const packageRootDir = path.join(process.cwd(), "node_modules", pkg.name);
                    const outputRootDir = path.join(process.cwd(), pkg.output.directory);
                    yield fs.ensureDir(outputRootDir);
                    const copyDirFiles = copyDirectoryFiles(packageRootDir, outputRootDir);
                    if (pkg.api_docs && pkg.output.api_docs) {
                        yield copyDirFiles({
                            inputDir: pkg.api_docs,
                            outputDir: pkg.output.api_docs,
                            copyFn: createApiDoc,
                        });
                    }
                    if (pkg.img_dir && pkg.output.img_dir) {
                        yield copyDirFiles({
                            inputDir: pkg.img_dir,
                            outputDir: pkg.output.img_dir,
                            copyFn: copyImgFile,
                        });
                    }
                    const readmeStreamTransformer = createUrlTransformerSteam(pkg.output);
                    const packageReadmeFile = path.join(packageRootDir, pkg.readme);
                    yield createReadme(packageReadmeFile, outputRootDir, pkg.output, readmeStreamTransformer);
                    const packageJson = yield fs.readJson(path.join(packageRootDir, "package.json"));
                    processedMap[pkg.name] = packageJson.version;
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = packagesToProcess_1.return)) yield _b.call(packagesToProcess_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
module.exports = function (context, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield copyApiDocs(manifest, processedMap);
        }
        catch (e) {
            status = false;
            error = e;
        }
        return {
            name: "api-docs-plugin",
            loadContent() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!status) {
                        throw new Error(`[api-docs-plugin] Failed to process api documentation. ${error.toString()}`);
                    }
                });
            },
        };
    });
};
