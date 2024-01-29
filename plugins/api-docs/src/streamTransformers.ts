import { Transform } from "stream";
import { StringDecoder } from "string_decoder";
import { PackageConfig } from "./types";

const GENESIS_DOC_URL_HOST_REGEX =
  /https?:\/\/learn\.genesis\.global\/secure\//g;

export const createUrlTransformerSteam = (
  manifestSettings: PackageConfig["output"],
) =>
  new Transform({
    transform(chunk, encoding, callback) {
      let chunkString = new StringDecoder("utf8").write(chunk);

      const relativeRoot = "../".repeat(
        manifestSettings.directory.split("/").length - 1,
      );

      chunkString = chunkString.replace(
        GENESIS_DOC_URL_HOST_REGEX,
        relativeRoot,
      );

      callback(null, chunkString);
    },
  });
