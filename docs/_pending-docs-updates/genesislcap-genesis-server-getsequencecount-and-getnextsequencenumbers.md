# Proposed docs change: GetSequenceCount and GetNextSequenceNumbers

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (475 non-space chars) is much smaller than the existing one (1094) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/index.mdx` manually.**

## `GetSequenceCount`

This command outputs the current values of all sequences in the database to a file.

###### Syntax
| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| `-f` | no | The name of the output file | none | `SequenceValues` |

###### Examples

```bash
GetSequenceCount
```

```bash
GetSequenceCount -f my-sequences.txt
```

## `GetSequenceCount`

This command outputs the current values of all sequences in the database to a file.

###### Syntax
| Argument | Mandatory | Description | Restricted values | Default |
