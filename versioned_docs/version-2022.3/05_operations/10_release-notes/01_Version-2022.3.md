---
title: 'Release notes - Version 2022.3'
sidebar_label: 'Version 2022.3'
sidebar_position: 2
id: version-2022-3
keywords: [operations, release notes, v-2022.3]
tags:
    - operations
    - release notes
    - v-2022.3
---

## Release notes
This is version v2022.3 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.3.0   |  
| web           | 5.0.0   |   

Release date: November 07, 2022. 

## Genesis Server Framework (GSF)

:::warning Important
Build changes mean that applications relying on version 2022.3 will also need to upgrade to Kotlin 1.7.10 and Gradle 7.5 

The jvm default Kotlin Compiler option must be `-Xjvm-default=all`
:::

### GSF 6.3.0 changes

- need porting from Notion: https://www.notion.so/genesisglobal/Genesis-v6-3-0-GSF-98c706a710de46c0b60496331e1cb665

### GSF 6.2.3 changes
- fix: [processRestarter.py](http://processrestarter.py/) use python2 syntax 
- fix: setting `GENESIS_HOME` environment variable doesn't depend on site-specific

### GSF 6.2.2 changes

- fix: include Streamer Client name and target process in metric identifier to ensure uniqueness 
- fix: fixing guice provider injection 
- fix: avoid printing warning messages when using the JsonSchema Jackson factory 
- fix: logging level and migrate constraints 
- fix: use bounded pool to prevent out of memory issues due to too many threads 
- fix: remove the task outputs for wsl paths 

## Auth 6.3.0 changes

- fix: Ensure entity map table record is created on user insert
- fix: Ensure PROFILE_USER and RIGHTS_SUMMARY records are correctly cleared down on user deletion 
- fix: Correct logic for use of bypassLoginInternalAuth
- fix: removing fields, tables and view coming from gsf
- fix: Correct metric identifiers for session count and received messages
- feat: Add support for LDAP over TLS (LDAPS)
- feat: GPAL support for Dynamic Auth Permissions
- fix: Add USER_VISIBILITY permissioning to USER_PROFILES endpoint

## Auth 6.2.3 changes
- fix: correct logic for use of `bypassLoginInternalAuth`

## Auth 6.2.2 changes

- fix: ensure entity map table record is created on user insert 
- fix: ensure `PROFILE_USER` and `RIGHTS_SUMMARY` records are correctly cleared down on user deletion

## GSF changes in full

Features


- added `viewHistory` parameter to Symphony create channel 
- new Resource Daemon support for using Hashicorp Consul for health checks; Hashicorp Consul can be used from Docker
- build: added test workflow for running genesis-dbtest against different db layers 
- build: changes to H2 and other SQL GitHub workflows 
- build: added a branch selector to the database test 
- build: re-enable Sonarqube task in GitHub Actions PR build 
- new `FDBKeyValueCount` command-line tool added
- processes can now be compacted or aggregated as part of the genesis install process 
- created mqtt database update queue 
- updated artifactory dependency to bouncy castle version 
- Docker: added flag for starting process in verbose mode 
- Docker: system now waits until cluster is running before running `setPrimary` 
- Drive Docker image config from sys def in site-specific 
- genesis-db: we have introduced parallel get bulk operations for FDB and FDB2 storage engines 
- feat(genesis-criteria): provided a generic mechanism to analyse and compile criteria expressions 
- db tests can now be run using category flag 
- test: db workflows have been split; db workflow runners have been renamed
- test:  missing unit test added for `OracleTableGenerator` and Oracle DB tests workflow file change 
- test: we have enabled testing for applications running in Docker 
- category flag added to select DB tests
- unit tests published
- db tests - updated cron and removed deprecated arg 
- we have added options for username and password to allow the use of authenticated MQTT brokers  
- tls certificate verification can now be disabled for mqtt connection 
- chore: FDB diagnostic utility scripts added
- chore: status badge in [README.md](http://readme.md/) updated
- chore: oracle warning removed
- chore: updating opencsv to 5.7.1 
- chore: improvements to tidy up the docker plugin configuration 
- top-level Data Pipeline mappers 
- a Genesis table can now be used as a Data Pipeline source; changes to a Genesis table can be mapped and sinked into a remote database.
- Data Pipeline genesis to db sink now in GPAL 
- initial GPAL script for auth permissions 
- extract sink from mapper configuration 
- unicode data support for MSSQL 
- genesis-pal-requestserver: added criteria support for pal Request Server 
- oracle db workflow has been adapted so that it can be called from another workflow
- changes to how we register our name in Hashicorp Consul; we now use pattern for the service name 
- we now support deserialised fields in our deserialisation layer 
- added initial sink operations for external database 
- we now allow processing of HTTP headers without underscores 
- dynamic rule notification functionality added 

The following fixes have been made

- build: fixed PostgreSQL image name and order for database test runner
- build: fixed running order issue - deploy JAR file task created for non-JAR files 
- build: fix db tests using empty default namespace instead of UUID 
- build: fixed DB test runner and bringing H2 back into the same workflow 
- added genesis-notify to the bom 
- webmon: fixed guice provider injection 
- finding deploy plugin zip files 
- genesis-environment: improved robustness of `MigrateFDBCounter` 
- fixed double registration of unreplied_messages custom gauge
- Streamer Client name and target process included in metric identifier to ensure uniqueness 
- ExcelToGenesis: fixed a null `println`
- removed if statements from services 
- fixed genesis-jackson to avoid printing warning messages when using the JsonSchema Jackson factory 
- critical vulnerability in `okhttp3` fixed
- `remap`: fixed incorrect check for free space in FoundationDB 
- `remap`: logger and stack trace issues fixed 
- `remap`: fixed issues with table counter changes when renaming a table and/or removing/reading with the same name 
- `remap`: fixed underflow errors when using `FDBIndexWriterHelper` on FDB2. 
- `remap`: SQL column resizing added
- `remap`: need for a separate module for compacted processes has been removed 
- `remap` tests now use `DictionaryCreatedAliasStore` instead of `SqlAliasStore` 
- fixed use TransactSQL syntax for rename when using MSSQL 
- updated apache shiro version, using latest owasp checker version 
- use bounded thread pool to prevent out-of-memory error 
- the task outputs for wsl paths have been removed
- concurrent modification exception fixed
- we have reverted the change made to use PID files 
- there is now no need for a **/** at the end of `GENESIS_HOME` 
- [processRestarter.py](http://processrestarter.py/) use python2 syntax 
- setting GENESIS_HOME environment variable now doesn't depend on site-specific 
- revert changes in sys def script; these were causing issues in the maven build 
- chore: fix for chronicle map issues 
- the feature switch for Docker gradle tasks has been removed
- added genesis-pal-permissions to the distribution 
- Auth Perms GPAL fixes 
- handling of the fdb column-to-row mapper has been fixed
- we now handle standby status for Hashicorp Consul to prevent processes getting marked as down 
- genesis-db: retry transaction after SQL server deadlock 
- quoted identifier strategy for oracle has been updated
- we now register the SLF4J and console reporters in `MetricService` 
- schema not included in call to `SP_RENAME` storec proc for mssql; this fixes a bug that prevented renaming database tables working when using MSSQL as a DB layer
- fixed: daemon shows `unknown` when there is no `PROCESS_STATUS_MESSAGE` in the `GENESIS_PROCESS` table 

## Foundation UI changes
This is a high-level overview of the changes.

### Maintenance

- we have removed ag-grid enterprise as a project dependency
- ag-grid/grid-pro has been moved to a separate package to avoid unnecessary load when it is not used

#### Breaking changes 

- All enterprise functionalities of ag-grid must be directly included in your client app. Code snipped that needs to be added to the codebase can be found here [https://gist.github.com/skawian/2e30e08f01820384ab8fef91d08681dd](https://gist.github.com/skawian/2e30e08f01820384ab8fef91d08681dd)
- ag-grid has been renamed across the project and is now wrapped under grid-pro to support multiple grids in the application. For existing applications, you need to go through your codebase and rename every instance of 'ag-grid' to 'grid-pro' (e.g. zero-ag-grid → zero-grid-pro, zero-ag-column → zero-grid-pro-column etc.)
- grid-pro/ag-grid is now bundled separately to avoid unnecessary load when it is not used. This means if you imported it from zero or foundation components, it will no longer be there.
    
    To import zero-grid-pro and register it, you need to do the following:
    
    `import { ***zeroGridComponents*** } from '@genesislcap/foundation-zero-grid-pro';`
    
    `provideDesignSystem().register(***zeroGridComponents***)`


