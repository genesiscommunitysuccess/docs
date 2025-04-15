import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { fileSystem } from "../services/FileSystem.js";

interface DocContentSearchInput {
  searchString: string;
}

class DocContentSearchTool extends MCPTool<DocContentSearchInput> {
  name = "doc-content-search";
  description = "DocContentSearch allows you to search for text in the genesis docs and receive which files have the search term. You can then use that information to use the DocFileViewTool to read and understand the documentation. You could also use the filepath to search for other similar files using the FilenameSearchTool so you can get more context.";

  schema = {
    searchString: {
      type: z.string(),
      description: "Text to search for in documentation files",
    },
  };

  async execute(input: DocContentSearchInput) {
    const results = await fileSystem.searchDocFiles(input.searchString);
    if (results.length === 0) {
      return "No results: please try again with a shorter search term";
    }
    return results.map(res => `
-----
filePath: ${res.filePath}
totalLines: ${res.totalLines}

${res.matches.map((f, i) => `(Match ${i}, offset ${f.offset}): ${f.text}`).join("\n")}
-----
`).join("\n\n")
  }
}

export default DocContentSearchTool;
