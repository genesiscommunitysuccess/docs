# Proposed docs change: genesisInstall

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (1079 non-space chars) is much smaller than the existing one (8559) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/index.mdx` manually.**

## `genesisInstall`

The `genesisInstall` command installs and configures the Genesis application. It processes system definitions, fields, and tables, preparing the environment for the application to run.

### Blocking execution in Docker containers

To prevent accidental configuration or schema changes in containerized environments, `genesisInstall` includes a safety guard. 

The Genesis Gradle plugin automatically sets `GENESIS_SYSDEF_BlockGenesisInstall=true` in generated Docker runtime images. When this system definition property is `true`, running `genesisInstall` prints a warning and exits cleanly without making any changes.

To apply changes in a containerized environment, you should:
- Use environment variables for system definition updates.
- Rebuild and redeploy a new Docker image for configuration or GPAL changes.

#### Overriding the block

If you must run `genesisInstall` inside a container (for example, during local testing or troubleshooting), you can override this block by setting the `GENESIS_SYSDEF_BlockGenesisInstall` environment variable to `false`.

###### Examples

To run `genesisInstall` by temporarily overriding the container block:

```bash
GENESIS_SYSDEF_BlockGenesisInstall=false genesisInstall
```
