import { MCPServer } from 'mcp-framework';
import DocContentSearchTool from './tools/DocContentSearchTool.js';
import DocFileViewTool from './tools/DocFileViewTool.js';
import FilenameSearchTool from './tools/FilenameSearchTool.js';
import RulesViewTool from './tools/RulesViewTool.js';
import GenesisToolsInfoTool from './tools/GenesisToolsInfoTool.js';
import GenesisDocsReadmeTool from './tools/GenesisDocsReadmeTool.js';
import IngestTool from './tools/IngestTool.js';
import EnrichedContentTool from './tools/EnrichedContentTool.js';
import MixinCodeSamplesTool from './tools/MixinCodeSamplesTool.js';
import AllToolsTool from './tools/AllToolsTool.js';

const server = new MCPServer();

server.start();

export default [
  new DocContentSearchTool(),
  new DocFileViewTool(),
  new FilenameSearchTool(),
  new RulesViewTool(),
  new GenesisToolsInfoTool(),
  new GenesisDocsReadmeTool(),
  new IngestTool(),
  new EnrichedContentTool(),
  new MixinCodeSamplesTool(),
  new AllToolsTool([
    new DocContentSearchTool(),
    new DocFileViewTool(),
    new FilenameSearchTool(),
    new RulesViewTool(),
    new GenesisToolsInfoTool(),
    new GenesisDocsReadmeTool(),
    new IngestTool(),
    new EnrichedContentTool(),
    new MixinCodeSamplesTool(),
  ]),
];
