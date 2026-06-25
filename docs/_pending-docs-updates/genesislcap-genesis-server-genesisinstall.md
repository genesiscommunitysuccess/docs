# Docs update needed: genesisInstall
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## `genesisInstall`

The `genesisInstall` command installs and updates the Genesis application database schema, system definitions, and fields.

In containerised environments (such as Docker), running `genesisInstall` directly inside a running container is blocked by default to prevent accidental configuration drift. This block is controlled by the `BlockGenesisInstall` system definition property.

###### Syntax

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| None | - | This command does not accept any arguments. | - | - |

###### Blocking execution in Docker

When you generate a Docker image using the Genesis Gradle plugin, the environment variable `GENESIS_SYSDEF_BlockGenesisInstall` is automatically set to `true`.

If you attempt to run `genesisInstall` when `BlockGenesisInstall` is resolved as `true` (either from your system definition file or via the `GENESIS_SYSDEF_BlockGenesisInstall` environment variable), the command displays a warning and exits cleanly without running the installation:

```
WARNING: genesisInstall cannot be executed because BlockGenesisInstall is set to "true".

This typically indicates the application is running inside a Docker container, where genesisInstall should not be used.

To apply changes:
- Use environment variables for system definition updates
- For configuration or GPAL changes, build and redeploy a new image
```

###### Examples

To run the installation in a standard non-containerised environment:

```bash
genesisInstall
```

To temporarily bypass the block inside a containerised environment and force the installation to run:

```bash
export GENESIS_SYSDEF_BlockGenesisInstall=false
genesisInstall
```
