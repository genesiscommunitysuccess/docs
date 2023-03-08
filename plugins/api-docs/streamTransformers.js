const { Transform } = require("stream");
const { StringDecoder } = require("string_decoder");

const GENESIS_DOC_URL_HOST_REGEX =
  /https?:\/\/learn\.genesis\.global\/secure\//g;

const createUrlTransformerSteam = (manifestSettings) =>
  new Transform({
    transform(chunk, encoding, callback) {
      let chunkString = new StringDecoder("utf8").write(chunk);

      const relativeRoot = "../".repeat(
        manifestSettings.directory.split("/").length - 1
      );

      chunkString = chunkString.replace(
        GENESIS_DOC_URL_HOST_REGEX,
        relativeRoot
      );

      callback(null, chunkString);
    },
  });

module.exports = {
  createUrlTransformerSteam,
};
