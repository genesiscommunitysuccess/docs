"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyImgFile = exports.createApiDoc = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function cleanseMarkdownContent(input) {
    return input.replace(/<!-- -->/g, "").replace(/<b>|<\/b>/g, "**");
}
async function createApiDoc(inputFile, outputFile) {
    let content = await fs_extra_1.default.readFile(inputFile, { encoding: "utf8" });
    if (path_1.default.basename(outputFile) === "index.md") {
        content =
            (await fs_extra_1.default.readFile(require.resolve("api-docs-sync/api-preamble"), {
                encoding: "utf8",
            })) +
                "\n" +
                content;
    }
    else {
        content =
            `---
format: md
---
` + content;
    }
    return fs_extra_1.default.writeFile(outputFile, cleanseMarkdownContent(content));
}
exports.createApiDoc = createApiDoc;
async function copyImgFile(inputFile, outputFile) {
    const content = await fs_extra_1.default.readFile(inputFile);
    return fs_extra_1.default.writeFile(outputFile, content);
}
exports.copyImgFile = copyImgFile;
