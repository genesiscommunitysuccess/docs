---
id: genesis-6.2.0
title: 'Genesis-6.2.0'
sidebar_label: 'Genesis-6.2.0'
sidebar_position: 5

---
# Genesis 6.2.0

## GSF

### Important Notes

- The ‘DbNamespace’ SysDef item is now applicable to platform implementations using MSSQL and PostGres databases. Previously, this item would be ignored. Many standard system definition files specify a placeholder value for this configuration key. In order to use the default database schema (previous behaviour), this item must be removed from the system definition.

### Breaking Changes

- Kotlin version has been upgraded to version 1.7.10 and projects depending on GSF 6.2.0 must upgrade as well.
- Gradle version has been upgraded to version 7.5 and projects depending on GSF 6.2.0 must upgrade as well.
- Field named “NAME” in genesis-fields-dictionary.kts has now a max size definition of 255. This may conflict with other projects redefining the “NAME” field.

### New Features

- data-pipeline: Genesis db changes are now audited.
- Enabling auto restart on genesis cluster and router.
- Enable consumers to use complex data-pipeline sink strategies.
- data-pipeline: Added support for custom sink operation
- Add CDC support for Oracle.
- Option to generate site-specific module for project templates.
- data-pipeline: Source operation type is passed to sink and where functions.
- Deploy plugin changes to support deployment to a local docker image via SSH.
- Add extra logging to ZeroMQ publishers and subscribers and also to the ZeroMQ proxy implementation.
- Make genesisInstall handle exit codes of 2 for installHooks that need to run after a remap.
- Add configOverridesFile tag to proccesses.xml to allow server specific system-definition overrides.
- data-pipeline: store database history to DB.
- Add system definition flag to disable genesis console endpoints.
- Processes now write PID files that mon etc. use to track the processes.
- deploy-plugin: Add install site-specific distribution task to genesissetup group.
- remove field size and filename from codegen to prevent this from interfering with caching.
- Allows Genesis apps to optionally bundle their generated classes.
- Adds docker jobs to the deploy plugin.
- Add namespace/schema support for MSSQL and PostGres.
- genesis-environment: Allow database credentials to be provided via the cli when running remap.
- Migration Hooks now supports a DB state store as well as file system.
- Add support for deploying front end to docker.
- Don't redirect the standard out or err when running in docker.

### Bug Fixes

- Broken sys def generation in deploy plugin.
- Bring forward streamer client fixes from 4.4.
- Improved tracking of responses in streamer client EventHandlerClient.kt.
- Review GPAL req/rep implementation and ensure recordsLimit is applied after running where clause and permissioning logic.
- In views - fix handling of enum fields in joins.
- Prevent GPAL consolidator throwing exception when multiple permanent consolidations target same table.
- Closing database after use.
- Resolve the gradle file locking issues.
- Change database status checker to consider WARNING status as valid for "isDatabaseUp" checks and increase warning threshold to 80%.
- genesis-db: Have the selectAllTables statement always return the table name without schema prefix.
- Change method for calculating free space in FoundationDB.
- Specifying a column name for the result returned by the SQL query in SQLDictionaryStore.kt.
- deploy-plugin: update use of sed command which is used in setupEnvironment task.
- Allow resolution of kts script files from src/main/resources/script directory for backwards compatibility.
- Prevent RenameFields from being applied when the input and output are in the same table.
- Fix remap cache.
- Various fixes to our H2 support.
- Various DbMon improvements.
- Improve exception handling in GenesisScriptHost.
- The wsl user home is not the same as the user home on the host.
- Fixing auth and router module not working properly when auth was disabled.
- Field size handling in genesis-datasever2 and genesis-pal-dataserver.
- Prevent Exception on invocation of renameFields.
- Remove unnecessary folder deletion in killServer script.
- Fixing Oracle and MSSQL support.
- Data pipeline broken for RDBs.

### Security Updates

- [Snyk] Upgrade org.apache.maven.wagon:wagon-http from 3.5.1 to 3.5.2
- [Snyk] Security upgrade org.apache.maven.plugins:maven-install-plugin from 2.5.2 to 3.0.0

## AUTH

### Breaking Changes

- Updated to GSF 6.2.0, Kotlin 1.7.10 and Gradle 7.5

### New Features

- Added onLoginSuccess callback into auth-preferences GPAL.
- Added config flag to bypass internal auth check on Login.
- Added installHook to load new profile rights data from relevant CSV.

### Bug Fixes

- Regenerate refresh token each time it is used.
- Use correct username to resolve user attributes for entity visibility checks.
- prevent triggering user entity change logic on irrelevant user changes.

## FIX

### Breaking Changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10

### New Features

- Add hostname to connection status table.
- Enhance core FIX framework with various metrics.

## Market Data

### Breaking Changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10

### New Features

None

## Elektron

### Breaking Changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10

### New Features

None