import { MCPTool } from "mcp-framework";
import { z } from "zod";

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
    return `Processed: ${input.searchString}`;
  }
}

export default FilenameSearchTool;
