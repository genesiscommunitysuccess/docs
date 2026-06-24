# Proposed docs change: DumpIt

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (1397 non-space chars) is much smaller than the existing one (2468) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/index.mdx` manually.**

## `DumpIt`

The `DumpIt` command exports data from database tables into files. It supports both a modern command-line interface and a legacy interactive mode.

By default, the modern command-line interface exports data in `FORMATTED` mode.

###### Syntax

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| `-t`, `--tables` | no | Space-separated list of tables to dump | none | dumps all tables |
| `-d`, `--directory` | no | Output directory for the dumped files | none | current directory |
| `-f`, `--formatMode` | no | Format of the output files | `FORMATTED`, `CSV`, `JSON` | `FORMATTED` |
| `-excludeFields` | no | Fields to exclude from the dump | none | none |
| `--gzip` | no | Compress the output files using gzip | none | false |
| `--legacy` | no | Use the legacy dump implementation | none | false |

###### Interactive mode

If you run `DumpIt` with no arguments, it starts in interactive mode using the legacy implementation. The legacy implementation supports the following additional argument:

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| `-cem`, `--criteriaEvaluatorMode` | no | The criteria evaluator mode for filtering | `TYPE_AWARE`, `LEGACY` | `TYPE_AWARE` |

###### Examples

Export all tables to the current directory in the default formatted mode:

```bash
DumpIt
```

Export specific tables to a target directory in CSV format and compress them:

```bash
DumpIt -t ALT_COUNTERPARTY ALT_INSTRUMENT -d /home/genesis/dumps -f CSV --gzip
```

Export tables using the legacy mode with a specific criteria evaluator mode:

```bash
DumpIt --legacy -cem TYPE_AWARE
```
