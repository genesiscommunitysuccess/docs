"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOutputDuplexStream = exports.createUrlTransformerSteam = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const string_decoder_1 = require("string_decoder");
const GENESIS_DOC_URL_HOST_REGEX = /https?:\/\/learn\.genesis\.global\/secure\//g;
const createUrlTransformerSteam = (manifestSettings) => new stream_1.Transform({
    transform(chunk, _, callback) {
        let chunkString = new string_decoder_1.StringDecoder("utf8").write(chunk);
        const relativeRoot = "../".repeat(manifestSettings.directory.split("/").length - 1);
        chunkString = chunkString.replace(GENESIS_DOC_URL_HOST_REGEX, relativeRoot);
        callback(null, chunkString);
    },
});
exports.createUrlTransformerSteam = createUrlTransformerSteam;
const createFrontMatterTransformerStream = (manifestSettings, pageIndex) => new stream_1.Transform({
    transform(chunk, _, callback) {
        let page = manifestSettings.pages[pageIndex];
        if (!page)
            return;
        const allTags = []
            .concat(manifestSettings.tags || [])
            .concat(page?.tags || []);
        const allKeywords = []
            .concat(manifestSettings.keywords || [])
            .concat(page?.keywords || []);
        const tagsText = allTags
            ? allTags.map((tag) => `  - ${tag}`).join("\n")
            : "";
        const keywordsText = allKeywords ? `[${allKeywords.join(", ")}]` : "";
        this.push(`---
title: '${page.title}'
sidebar_label: '${page.sidebar_label}'
id: ${page.id}
`);
        if (keywordsText) {
            this.push(`keywords: ${keywordsText}\n`);
        }
        if (tagsText) {
            this.push(`tags:\n${tagsText}\n`);
        }
        this.push(`---\n\n`);
        this.push(chunk);
        callback();
    },
});
const createStream = (str) => {
    const stream = new stream_1.Readable();
    stream.push(str);
    stream.push(null);
    return stream;
};
const PAGE_DELIMETER = "<!-- page-split -->";
const createOutputDuplexStream = (manifestSettings, outputDir, readmeStreamTransformer) => new stream_1.Duplex({
    write(chunk, _, callback) {
        const buffer = chunk.toString();
        const pages = buffer.split(PAGE_DELIMETER);
        if (!Array.isArray(manifestSettings.pages)) {
            callback(new Error(`Manifest for package ${manifestSettings.directory} is missing the 'pages' property in output or it is not an array.`));
            return;
        }
        if (pages.length !== manifestSettings.pages.length) {
            callback(new Error(`Page splits and page config counts do not match for package ${manifestSettings.directory}`));
            return;
        }
        for (let i = 0; i < pages.length; i++) {
            const writeStream = fs_extra_1.default.createWriteStream(path_1.default.join(outputDir, manifestSettings.readme), { encoding: "utf8" });
            createStream(pages[i])
                .pipe(createFrontMatterTransformerStream(manifestSettings, i))
                .pipe(readmeStreamTransformer)
                .pipe(writeStream);
        }
        callback();
    },
});
exports.createOutputDuplexStream = createOutputDuplexStream;
