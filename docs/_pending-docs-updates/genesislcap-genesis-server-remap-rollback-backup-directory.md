# Proposed docs change: remap rollback backup directory

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (340 non-space chars) is much smaller than the existing one (613) and would delete content. Review and apply this to `docs/003_build-deploy-operate/03_operate/002_commands/03_remap.mdx` manually.**

### Rollback

If a remap operation fails or you need to revert changes, you can roll back to the previous state. During the execution of `remap`, the platform automatically backs up the affected table data. These backup CSV files are written to the `GENESIS_HOME/runtime/remap` directory.

You can use these backup files to restore your database to its previous state if the process is interrupted or fails.
