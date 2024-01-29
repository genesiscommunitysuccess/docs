"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlTransformerSteam = void 0;
const stream_1 = require("stream");
const string_decoder_1 = require("string_decoder");
const GENESIS_DOC_URL_HOST_REGEX = /https?:\/\/learn\.genesis\.global\/secure\//g;
const createUrlTransformerSteam = (manifestSettings) => new stream_1.Transform({
    transform(chunk, encoding, callback) {
        let chunkString = new string_decoder_1.StringDecoder("utf8").write(chunk);
        const relativeRoot = "../".repeat(manifestSettings.directory.split("/").length - 1);
        chunkString = chunkString.replace(GENESIS_DOC_URL_HOST_REGEX, relativeRoot);
        callback(null, chunkString);
    },
});
exports.createUrlTransformerSteam = createUrlTransformerSteam;
