// @ts-ignore
import fs from "fs-extra";
import path from "path";

/**
 * Docusaurus / mdx build can't process empty comments in markdown.
 *
 * In MDX 1 there is a behaviour that will lead to links not being rendered as clickable links. See
 * https://github.com/mdx-js/mdx/issues/1571#issuecomment-853384939
 *
 * This causes:
 *  <b>Implements:</b> [Percentage](./foundation-filters.percentage.md)
 *  <b>Extends:</b> [ClientFilter](./foundation-filters.clientfilter.md)&lt;[NodeEnvParams](./foundation-filters.nodeenvparams.md)&gt;
 *  etc.
 *
 * ...to render unlinked, so users actually see text like this instead:
 *
 * Implements: [NodeEnv](/web/filters/docs/api/foundation-filters.nodeenv)
 *
 * Replacing html tags like <b> with their markdown equivalent `**` fixes the issue, as the line starts with markdown.
 */
function cleanseMarkdownContent(input: string) {
  return input.replace(/<!-- -->/g, "").replace(/<b>|<\/b>/g, "**");
}

/**
 * Copy function for the package API files generated by API extractor/documentor.
 * Mostly copies files as they are, but adds a info message if the file is an index.md file.
 * Else, need to prepend markdown as the fontmatter for https://docusaurus.io/docs/next/markdown-features/react#markdown-and-jsx-interoperability.
 */
export async function createApiDoc(inputFile: string, outputFile: string) {
  let content = await fs.readFile(inputFile, { encoding: "utf8" });
  if (path.basename(outputFile) === "index.md") {
    content =
      (await fs.readFile(require.resolve("api-docs-sync/api-preamble"), {
        encoding: "utf8",
      })) +
      "\n" +
      content;
  } else {
    content =
      `---
format: md
---
` + content;
  }
  return fs.writeFile(outputFile, cleanseMarkdownContent(content));
}

/**
 * Copy image files
 */
export async function copyImgFile(inputFile: string, outputFile: string) {
  const content = await fs.readFile(inputFile);
  return fs.writeFile(outputFile, content);
}
