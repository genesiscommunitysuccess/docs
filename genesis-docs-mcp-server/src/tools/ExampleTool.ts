import { MCPTool } from 'mcp-framework';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ExampleInput {
  message: string;
}

class ExampleTool extends MCPTool<ExampleInput> {
  name = 'example_tool';
  description = 'An example tool that processes messages';

  schema = {
    message: {
      type: z.string(),
      description: 'Message to process',
    },
  };

  async execute(input: ExampleInput) {
    return `Processed: ${input.message}, process.cwd() ${process.cwd()}, __dirname: ${__dirname}`;
  }
}

export default ExampleTool;
