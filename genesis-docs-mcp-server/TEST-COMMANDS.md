# Genesis Docs MCP Server - Test Commands

Quick reference for manual testing commands.

## FilenameSearch Tool

Basic filename search:
```bash
npm run manual-test -- grid --tool=filename
```

Search with API docs included:
```bash
npm run manual-test -- api --tool=filename --show-api
```

Search without strict word boundaries:
```bash
npm run manual-test -- pro --tool=filename --no-strict-boundaries
```

## ContentSearch Tool

Basic content search:
```bash
npm run manual-test -- function --tool=content
```

Show the content in results:
```bash
npm run manual-test -- "grid component" --tool=content --show-content
```

## FileView Tool

View a specific file:
```bash
npm run manual-test -- --tool=fileview --file=docs/001_develop/03_client-capabilities/005_grids/index.md
```

View a specific portion of a file:
```bash
npm run manual-test -- --tool=fileview --file=docs/001_develop/03_client-capabilities/005_grids/index.md --offset=10 --max-lines=20
```

## RulesView Tool

List all available rules:
```bash
npm run manual-test -- --tool=rules
```

View a specific rule:
```bash
npm run manual-test -- --tool=rules --rule=genesis-general-rules.mdc
```

## GenesisToolsInfo Tool

Get general overview:
```bash
npm run manual-test -- --tool=info
```

Get specific details about a topic:
```bash
npm run manual-test -- --tool=info --detail=search
```

## EnrichedContent Tool

Basic enriched content search:
```bash
npm run manual-test -- "grid component" --tool=enriched
```

With specific output format:
```bash
npm run manual-test -- "dataserver" --tool=enriched --format=json
```

With custom file size limit:
```bash
npm run manual-test -- "authentication" --tool=enriched --max-size=100
```

## Run All Tools

Run all tools with one search term:
```bash
npm run manual-test -- grid --tool=all --show-content
```

## Help

Get detailed help:
```bash
npm run manual-test -- --help
```