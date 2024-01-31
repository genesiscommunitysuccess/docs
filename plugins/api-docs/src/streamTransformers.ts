// @ts-ignore
import fs from "fs-extra";
import path from "path";
import { Transform, Duplex, Readable } from "stream";
import { StringDecoder } from "string_decoder";
import { PackageConfig } from "./types";

const GENESIS_DOC_URL_HOST_REGEX =
  /https?:\/\/learn\.genesis\.global\/secure\//g;

/**
 * Converts the genesis doc url to a relative path.
 */
export const createUrlTransformerSteam = (
  manifestSettings: PackageConfig["output"],
) =>
  new Transform({
    transform(chunk, _, callback) {
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

/**
 * Apply onto a stream of text which is a markdown page and prepend the front matter to it.
 */
const createFrontMatterTransformerStream = (
  manifestSettings: PackageConfig["output"],
  pageIndex: number,
) =>
  new Transform({
    transform(chunk, _, callback) {
      let page = manifestSettings.pages[pageIndex];

      const allTags = (<string[]>[])
        .concat(manifestSettings.tags || [])
        .concat(page?.tags || []);
      const allKeywords = (<string[]>[])
        .concat(manifestSettings.keywords || [])
        .concat(page?.keywords || []);

      const tagsText = allTags
        ? allTags.map((tag) => `  - ${tag}`).join("\n")
        : "";
      const keywordsText = allKeywords ? `[${allKeywords.join(", ")}]` : "";

      const stringDecoder = new StringDecoder("utf8");
      stringDecoder.write(
        `---
title: '${page.title}'
sidebar_label: '${page.sidebar_label}'
id: ${page.id}
`,
      );
      if (keywordsText) {
        stringDecoder.write(`keywords: ${keywordsText}\n`);
      }
      if (tagsText) {
        stringDecoder.write(`tags:\n${tagsText}\n`);
      }
      stringDecoder.write(`---\n\n`);
      stringDecoder.write(chunk);

      callback(null, stringDecoder.end());
    },
  });

const createStream = (str: string) => {
  const stream = new Readable();
  stream.push(str);
  stream.push(null);
  return stream;
};

const PAGE_DELIMETER = "<!-- page-split -->";
export const createOutputDuplexStream = (
  manifestSettings: PackageConfig["output"],
  outputDir: string,
  readmeStreamTransformer: Transform,
) =>
  new Duplex({
    write(chunk, _, callback) {
      const buffer: string = chunk.toString();
      const pages = buffer.split(PAGE_DELIMETER);

      if (pages.length !== manifestSettings.pages.length) {
        callback(
          new Error(
            `Page splits and page config counts do not match for package ${manifestSettings.directory}`,
          ),
        );
      }

      for (let i = 0; i < pages.length; i++) {
        const writeStream = fs.createWriteStream(
          path.join(outputDir, manifestSettings.readme),
          { encoding: "utf8" },
        );
        createStream(pages[i])
          .pipe(createFrontMatterTransformerStream(manifestSettings, i))
          .pipe(readmeStreamTransformer)
          .pipe(writeStream);
      }
      callback();
    },
  });
