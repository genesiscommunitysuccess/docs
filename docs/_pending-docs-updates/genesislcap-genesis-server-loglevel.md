# Proposed docs change: LogLevel

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (639 non-space chars) is much smaller than the existing one (2221) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/index.mdx` manually.**

## `LogLevel`

Use the `LogLevel` command to dynamically change the logging level of a running process.

###### Syntax

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| `-p` | yes | the name of the process whose logging level you want to change | none | none |
| `-l` | yes | the target logging level | `TRACE`, `INFO`, `DEBUG`, `ERROR`, `WARN` | none |

If you specify an invalid logging level with the `-l` flag, the command is rejected and does not proceed. It prints the following message:

`Logging level <level> is not valid. Please use one of the following: [TRACE, INFO, DEBUG, ERROR, WARN]`

###### Examples

To change the logging level of the process `GENESIS_AUTH` to `DEBUG`:

```bash
LogLevel -p GENESIS_AUTH -l DEBUG
```
