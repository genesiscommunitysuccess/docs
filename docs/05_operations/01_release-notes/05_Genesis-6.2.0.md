---
id: genesis-6.2.0
title: 'Genesis-6.2.0'
sidebar_label: 'Genesis-6.2.0'
sidebar_position: 5

---

# GSF

## Important Notes

- After the introduction of https://genesisglobal.atlassian.net/browse/PA-142, the ‘DbNamespace’ SysDef item is now applicable to platform implementations using MSSQL and PostGres databases. Previously, this item would be ignored. Many standard system definition files specify a placeholder value for this configuration key. In order to use the default database schema (previous behaviour), this item must be removed from the system definition.

## Breaking Changes

- Kotlin version has been upgraded to version 1.7.10 and projects depending on GSF 6.2.0 must upgrade as well.
- Gradle version has been upgraded to version 7.5 and projects depending on GSF 6.2.0 must upgrade as well.
- Field named “NAME” in genesis-fields-dictionary.kts has now a max size definition of 255. This may conflict with other projects redefining the “NAME” field.

## New Features

- data-pipeline: Genesis db changes are now audited https://genesisglobal.atlassian.net/browse/GSF-5564
- Enabling auto restart on genesis cluster and router https://genesisglobal.atlassian.net/browse/GSF-5384
- Enable consumers to use complex data-pipeline sink strategies https://genesisglobal.atlassian.net/browse/GSF-5565
- data-pipeline: Added support for custom sink operation https://genesisglobal.atlassian.net/browse/GSF-5569
- Add CDC support for Oracle https://genesisglobal.atlassian.net/browse/GSF-5545
- Option to generate site-specific module for project templates https://genesisglobal.atlassian.net/browse/GSF-5604
- data-pipeline: Source operation type is passed to sink and where functions https://genesisglobal.atlassian.net/browse/GSF-5596
- Deploy plugin changes to support deployment to a local docker image via SSH https://genesisglobal.atlassian.net/browse/DVOP-183
- Add extra logging to ZeroMQ publishers and subscribers and also to the ZeroMQ proxy implementation https://genesisglobal.atlassian.net/browse/GSF-5385
- Make genesisInstall handle exit codes of 2 for installHooks that need to run after a remap https://genesisglobal.atlassian.net/browse/AUTH-280
- Add configOverridesFile tag to proccesses.xml to allow server specific system-definition overrides https://genesisglobal.atlassian.net/browse/DVOP-205
- data-pipeline: store database history to DB https://genesisglobal.atlassian.net/browse/GSF-5606
- Add system definition flag to disable genesis console endpoints https://genesisglobal.atlassian.net/browse/GSF-5657
- Processes now write PID files that mon etc. use to track the processes https://genesisglobal.atlassian.net/browse/DVOP-226
- deploy-plugin: Add install site-specific distribution task to genesissetup group https://genesisglobal.atlassian.net/browse/GSF-5664
- remove field size and filename from codegen to prevent this from interfering with caching https://genesisglobal.atlassian.net/browse/GSF-5521
- Allows Genesis apps to optionally bundle their generated classes https://genesisglobal.atlassian.net/browse/DVOP-225
- Adds docker jobs to the deploy plugin https://genesisglobal.atlassian.net/browse/DVOP-254
- Add namespace/schema support for MSSQL and PostGres https://genesisglobal.atlassian.net/browse/PA-142
- genesis-environment: Allow database credentials to be provided via the cli when running remap https://genesisglobal.atlassian.net/browse/DVOP-225
- Migration Hooks now supports a DB state store as well as file system https://genesisglobal.atlassian.net/browse/DVOP-249
- add support for deploying front end to docker https://genesisglobal.atlassian.net/browse/DVOP-261
- don't redirect the standard out or err when running in docker https://genesisglobal.atlassian.net/browse/DVOP-252

## Bug Fixes

- broken sys def generation in deploy plugin https://genesisglobal.atlassian.net/browse/GSF-5574
- bring forward streamer client fixes from 4.4  https://genesisglobal.atlassian.net/browse/GSF-5571
- improved tracking of responses in streamer client EventHandlerClient.kt https://genesisglobal.atlassian.net/browse/GSF-5571
- Review GPAL req/rep implementation and ensure recordsLimit is applied after running where clause and permissioning logic https://genesisglobal.atlassian.net/browse/PTL-43
- in views - fix handling of enum fields in joins https://genesisglobal.atlassian.net/browse/GSF-5599
- Prevent GPAL consolidator throwing exception when multiple permanent consolidations target same table by https://genesisglobal.atlassian.net/browse/GSF-5612
- closing database after use https://genesisglobal.atlassian.net/browse/PTC-352
- resolve the gradle file locking issues https://genesisglobal.atlassian.net/browse/DVOP-244
- Change database status checker to consider WARNING status as valid for "isDatabaseUp" checks and increase warning threshold to 80% https://genesisglobal.atlassian.net/browse/GSF-5674
- genesis-db: Have the selectAllTables statement always return the table name without schema prefix https://genesisglobal.atlassian.net/browse/PA-166
- Change method for calculating free space in FoundationDB https://genesisglobal.atlassian.net/browse/GSF-5675
- Specifying a column name for the result returned by the SQL query in SQLDictionaryStore.kt https://genesisglobal.atlassian.net/browse/GSF-5670
- deploy-plugin: update use of sed command which is used in setupEnvironment task https://genesisglobal.atlassian.net/browse/GSF-5672
- Allow resolution of kts script files from src/main/resources/script directory for backwards compatibility https://genesisglobal.atlassian.net/browse/PA-97
- Prevent RenameFields from being applied when the input and output are in the same table https://genesisglobal.atlassian.net/browse/PA-57
- Fix remap cache https://genesisglobal.atlassian.net/browse/DVOP-239
- Various fixes to our H2 support https://genesisglobal.atlassian.net/browse/PTC-243
- various DbMon improvements https://genesisglobal.atlassian.net/browse/GSF-3477
- Improve exception handling in GenesisScriptHost https://genesisglobal.atlassian.net/browse/PA-127
- the wsl user home is not the same as the user home on the host https://genesisglobal.atlassian.net/browse/PTC-301
- fixing auth and router module not working properly when auth was disabled https://genesisglobal.atlassian.net/browse/GSF-5377
- field size handling in genesis-datasever2 and genesis-pal-dataserver https://genesisglobal.atlassian.net/browse/GSF-5613
- Prevent Exception on invocation of renameFields https://genesisglobal.atlassian.net/browse/GSF-5623
- remove unnecessary folder deletion in killServer script https://genesisglobal.atlassian.net/browse/PA-58
- Fixing Oracle and MSSQL support https://genesisglobal.atlassian.net/browse/GSF-5615
- Data pipeline broken for RDBs https://genesisglobal.atlassian.net/browse/GSF-5653

## Security Updates

- [Snyk] Upgrade org.apache.maven.wagon:wagon-http from 3.5.1 to 3.5.2
- [Snyk] Security upgrade org.apache.maven.plugins:maven-install-plugin from 2.5.2 to 3.0.0

# AUTH

## Breaking Changes

- Updated to GSF 6.2.0, Kotlin 1.7.10 and Gradle 7.5

## New Features

- Added onLoginSuccess callback into auth-preferences GPAL https://genesisglobal.atlassian.net/browse/PA-34
- Added config flag to bypass internal auth check on Login https://genesisglobal.atlassian.net/browse/PA-34
- Added installHook to load new profile rights data from relevant CSV

## Bug Fixes

- Regenerate refresh token each time it is used https://genesisglobal.atlassian.net/browse/PA-46
- Use correct username to resolve user attributes for entity visibility checks https://genesisglobal.atlassian.net/browse/PA-158
- prevent triggering user entity change logic on irrelevant user changes https://genesisglobal.atlassian.net/browse/PA-144

# FIX

## Breaking Changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10

## New Features

- Add hostname to connection status table https://genesisglobal.atlassian.net/browse/FIX-121
- Enhance core FIX framework with various metrics https://genesisglobal.atlassian.net/browse/PA-31

# Market Data

## Breaking Changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10

## New Features

None

# Elektron

## Breaking Changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10

## New Features

None