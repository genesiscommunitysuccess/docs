import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { fileSystem } from "../services/FileSystem.js";
import Fuse from 'fuse.js'

interface FilenameSearchInput {
  searchString: string;
}

class FilenameSearchTool extends MCPTool<FilenameSearchInput> {
  name = "filename-search";
  description = "This tool allows you to perform a fuzzy search for documentation fileneames and you'll return back all matches as well as any sibling documents that match the directories for extra context";

  schema = {
    searchString: {
      type: z.string(),
      description: "The search term to use which is used to fuzzy match against the documentation",
    },
  };

  async execute(input: FilenameSearchInput) {
    const docsFiles = await fileSystem.docsFiles()
    const fuse = new Fuse(docsFiles, {
      threshold: 0.4
    })
    const results = fuse.search(input.searchString)
    if (results.length === 0) {
      return { content: [{ type: "text", text: "No results, in this case please try to use less words in your search term and try again" }] };
    }
    return { content: [{ type: "text", text: results.map(r => r.item).join("\n") }] };
  }
}

export default FilenameSearchTool;
