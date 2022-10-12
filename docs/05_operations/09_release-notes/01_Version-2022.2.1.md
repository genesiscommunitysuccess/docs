---
title: 'Version 2022.2.1'
sidebar_label: 'Version 2022.2.1'
sidebar_position: 2
id: version-2022-2-1
---
This is version v2022.2.1 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.2.0   |  
| web           | 4.0.0   |  

Release date: September 30, 2022.

# Foundation UI (Web)

## Features

- New `flex-layout` component added for easy-to-use [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) layouts (there’s also an upcoming `app-layout` component with UI persistence features).
- **IMPORTANT** `select` / `combobox` / `multiselect` now have their own `datasource` adapters, allowing quick and easy integration with backend data (same as in our grids, but for list elements!)
- New `error-boundary` component added, allowing improved error management for UI elements.
- [Grid column persistence](https://docs.genesis.global/secure/getting-started/go-to-the-next-level/data-grid/#saving-user-preferences) to restore a user’s column preferences between app reloads.
- **IMPORTANT** `charts` component wrapper for `[@ant-design/charts](https://github.com/ant-design/ant-design-charts/)` added, allowing the following types: Line, Area, Bar, Column, Pie, Dual Axes, Rose.
- Added SSO login support for Symphony.
- WebSocket connection addresses now fully configurable (auto assignment of `ws:` or `wss:`, and allowing other extensions - default still `/gwf/`)
- New CLI tasks to help end user analyze their component usage and switch design system prefixes. These generate sample code for users to copy from the terminal to their projects.
- `@Auth` / `@Session` bug fixes involving user roles and session storage.
- Added reconnect streams logic for more fault tolerant connection handling.
- A number of Micro Frontend (`foundation-header`, `foundation-reporting`) styling improvements.
- Made the `foundation-header` Micro Frontend more configurable.
- Created How-To and API documentation for several of our Micro Frontends:
  - [Header](docs/04_web/05_micro-front-ends/03_foundation-header.md)
  - [Entity Management](docs/04_web/05_micro-front-ends/04_foundation-entity-management.md)
  - [User Management](docs/04_web/05_micro-front-ends/05_foundation-user-management.md)
  - [Profile Management](docs/04_web/05_micro-front-ends/06_foundation-profile-management.md)
  - [Login](docs/04_web/05_micro-front-ends/07_foundation-login.md)
  - [Reporting](docs/04_web/05_micro-front-ends/02_front-end-reporting.md)
- Added multiple parameter support for Testing Suite in `foundation-testing`
- Add more code examples in our Showcase Client App, including selecting values and labels in our `combobox` programmatically
- Add [slotted-styles](https://docs.genesis.global/secure/getting-started/go-to-the-next-level/customize-look-and-feel/#styling-ag-grid) component to allow overriding component styles.

## Maintenance

- Various CLI tweaks to support ongoing DSL work.
- Created named release process to support ad-hoc release requests from App Dev.
- `[commitlint](https://commitlint.js.org/#/)` improvements.
- Added prettier to provide unified code formatting automatically.
- Defined a pattern for providing E2E selector hooks for our Micro Frontends, which we’ll continue to rollout.
- CLI will now offer the user a choice between downloading tarballs or using git to clone seeds.
- **IMPORTANT** `http.connect` GSF is now using [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) with hyphens to match with [nginx](https://www.nginx.com/) default settings, this release (4.0.0) will only be compatible if you’re also with GSF 6.1.4+

## Notes

Much of our time recently has been focused on improving documentation and the onboarding in general.

This release is 4.0.0 of `foundation-ui` . We have chosen to stick to a fixed version across

# Genesis Server Framework

## Important notes

- After the introduction of https://genesisglobal.atlassian.net/browse/PA-142, the ‘DbNamespace’ SysDef item is now applicable to platform implementations using MSSQL and PostGres databases. Previously, this item would be ignored. Many standard system definition files specify a placeholder value for this configuration key. In order to use the default database schema (previous behaviour), this item must be removed from the system definition.

## Breaking changes

- Kotlin version has been upgraded to version 1.7.10 and projects depending on GSF 6.2.0 must upgrade as well.
- Gradle version has been upgraded to version 7.5 and projects depending on GSF 6.2.0 must upgrade as well.
- Field named “NAME” in genesis-fields-dictionary.kts has now a max size definition of 255. This may conflict with other projects redefining the “NAME” field.

## New features

- data-pipeline: Genesis db changes are now audited.
- Enabling auto restart on genesis cluster and router.
- Enable consumers to use complex data-pipeline sink strategies.
- data-pipeline: Added support for custom sink operation.
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
- Remove field size and filename from codegen to prevent this from interfering with caching.
- Allows Genesis apps to optionally bundle their generated classes.
- Adds docker jobs to the deploy plugin.
- Add namespace/schema support for MSSQL and PostGres.
- genesis-environment: Allow database credentials to be provided via the cli when running remap.
- Migration Hooks now supports a DB state store as well as file system.
- Add support for deploying front end to docker.
- Don't redirect the standard out or err when running in docker.

## Bug Fixes

- Broken sys def generation in deploy plugin.
- Bring forward streamer client fixes from 4.4.
- Improved tracking of responses in streamer client EventHandlerClient.kt.
- Review GPAL req/rep implementation and ensure recordsLimit is applied after running where clause and permissioning logic.
- In views - fix handling of enum fields in joins.
- Prevent GPAL consolidator throwing exception when multiple permanent consolidations target same table by.
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

## Security updates

- [Snyk] Upgrade org.apache.maven.wagon:wagon-http from 3.5.1 to 3.5.2.
- [Snyk] Security upgrade org.apache.maven.plugins:maven-install-plugin from 2.5.2 to 3.0.0.

# AUTH

## Breaking changes

- Updated to GSF 6.2.0, Kotlin 1.7.10 and Gradle 7.5.

## New features

- Added onLoginSuccess callback into auth-preferences GPAL.
- Added config flag to bypass internal auth check on Login.
- Added installHook to load new profile rights data from relevant CSV.

## Bug fixes

- Regenerate refresh token each time it is used.
- Use correct username to resolve user attributes for entity visibility checks.
- Prevent triggering user entity change logic on irrelevant user changes.

# FIX

## Breaking changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10.

## New features

- Add hostname to connection status table.
- Enhance core FIX framework with various metrics.

# Market data

## Breaking changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10.

## New features

None.

# Elektron

## Breaking changes

- Updated to GSF 6.2.0 and Kotlin 1.7.10.

## New features

None.
