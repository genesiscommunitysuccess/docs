# Proposed docs change: remap syntax

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (420 non-space chars) is much smaller than the existing one (2821) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/03_remap.mdx` manually.**

## Syntax

The `remap` command has the following arguments:

| Argument | Argument long name | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|---|
| `-c` | `--commit` | no | Commits the schema changes to the database | none | none |
| `-m` | `--metadata-only` | no | Performs a metadata-only remap | none | none |

###### Examples

To run a dry run of the remap to see what changes would be applied:

```bash
remap
```

To commit the schema changes to the database:

```bash
remap -c
```

To
