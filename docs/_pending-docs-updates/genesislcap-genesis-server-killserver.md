# Proposed docs change: killServer

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (724 non-space chars) is much smaller than the existing one (1448) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/index.mdx` manually.**

## `killServer`

The `killServer` command stops all Genesis processes running on the server.

###### Syntax

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| `-s`, `--hostname` | no | The hostname of the server to kill | none | local host |
| `-f`, `--force` | no | Forcefully kill the server processes | none | none |
| `--all` | no | Kill all processes, including `GENESIS_CLUSTER` | none | none |
| `-c`, `--cluster` | no | Kill cluster processes | none | none |

###### Examples

Stop all Genesis processes on the current server:

```bash
killServer
```

Forcefully stop all Genesis processes on the current server:

```bash
killServer --force
```

Stop all Genesis processes, including `GENESIS_CLUSTER`:

```bash
killServer --all
```

Stop all Genesis processes on a specific host:

```bash
killServer --hostname server-01
```
