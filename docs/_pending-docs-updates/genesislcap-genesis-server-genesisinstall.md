# Docs update needed: genesisInstall
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## `genesisInstall`

The `genesisInstall` command installs and configures the Genesis application. It processes configuration files, generates system definitions, and prepares the environment for the application to run.

In containerised environments (such as Docker), running `genesisInstall` directly inside a running container is blocked by default to prevent accidental configuration drift or state issues.

###### Syntax

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| none | no | This command does not accept any arguments. | none | none |

###### Blocking in Docker containers

When you build a Docker image using the Genesis Gradle plugin, the environment variable `GENESIS_SYSDEF_BlockGenesisInstall` is automatically set to `true`. 

If you attempt to run `genesisInstall` inside the container, the command displays a warning and exits without making changes:

```text
WARNING: genesisInstall cannot be executed because BlockGenesisInstall is set to "true".

This typically indicates the application is running inside a Docker container, where genesisInstall should not be used.

To apply changes:
- Use environment variables for system definition updates
- For configuration or GPAL changes, build and redeploy a new image
```

To configure this behaviour in your system definition file, you can set the `BlockGenesisInstall` property:

```kotlin
systemDefinition {
    global {
        item("BlockGenesisInstall", "true")
    }
}
```

###### Examples

To run a standard installation in a non-containerised environment:

```bash
genesisInstall
```

To bypass the installation block in a Docker container:

```bash
export GENESIS_SYSDEF_BlockGenesisInstall=false
genesisInstall
```
