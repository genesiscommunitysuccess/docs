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

- fix: deploy plugin finding zip files
- fix: deploy jar file task created for non jar files
- fix: added genesis-notify to the bom
- feat: Add viewHistory param to symphony create channel
- feat: Resource Daemon support for using consul for healthchecks
- fix(webmon): fixing guice provider injection
- fix(genesis-environment): Improve robustness of MigrateFDBCounter
- feat: use consul from docker
- fix(remap): Fix incorrect check for free space in FoundationDB
- feature(genesis-environment): Add new FDBKeyValueCount command line tool
- fix: Prevent double registration of unreplied_messages custom gauge
- build: Changes to H2 and other SQL GitHub workflows
- fix: Include streamer client name and target process in metric identifier to ensure uniqueness
- fix(ExcelToGenesis): fixing a null println
- feat: Allow processes to be compacted or aggregated as part of the genesis install process
- fix: Removing if statements from services
- fix(genesis-jackson): Avoid printing warning messages when using the JsonSchema Jackson factory
- feat: create mqtt database update queue
- fix: upgrade to fix critical vulnerability in okhttp3
- feat: update artifactory dependency to bouncy castle version
- feat(docker): add flag for starting process in verbose mode
- fix(remap): Fix logger and stack trace issues
- feat: drive docker image config from sys def in site-specific
- fix(remap): Fix issues with table counter changes when renaming a table and/or removing/readding with the same name
- fix: Remove need for a seperate module for compacted processes
- fix(remap): fixed underflow errors happening when using FDBIndexWriterHelper on FDB2
- feat(genesis-db): Introduce parallel get bulk operations for FDB and FDB2 storage engines
- fix: Use TransactSQL syntax for rename when MSSQL
- feat(genesis-criteria): Provide a generic mechanism to analyse and compile criteria expressions
- fix: rename db workflow runners
- feat: add category flag to select DB tests
- fix: updated apache shiro version, using latest owasp checker version
- fix: use bounded thread pool to prevent out of memory error
- fix: remove the task outputs for wsl paths
- fix: fix concurrent modification exception
- feat(docker): wait until cluster is running before running setPrimary
- feat: Allow use of authenticated MQTT brokers by adding options for username and password
- fix: Reverts the change made to use PID files
- fix: Don't require a / at the end of GENESIS_HOME
- feat: Allow tls certificate verification to be disabled for mqtt connection
- fix: processRestarter.py use python2 syntax
- fix: setting GENESIS_HOME env variable doesn't depend on site-specific
- fix(remap): Adding support for SQL column resizing
- fix: Make Remap tests use DictionaryCreatedAliasStore instead of SqlAliasStore
- fix: revert changes in sys def script; this is causing issues in the maven build
- feat: initial gpal script for auth permissions
- fix: Remove feature switch for docker gradle tasks
- fix: Adding genesis-pal-permissions to the distribution
- fix: Auth Perms GPAL fixes
- feat: Use types with Unicode data support for MSSQL
- feat(genesis-pal-requestserver): Add criteria support for pal req/rep
- fix: fix handling of fdb column to row mapper
- fix: handle standby status for consul to prevent processes getting marked as down
- feat: use pattern for service name in consul
- feat: Add support for deserialized fields for in our deserialization layer
- fix(genesis-db): retry transaction after SQL server deadlock
- feat: Added initial sink operations for external database
- fix: update quoted identifier strategy for oracle
- feat(data-pipeline): data pipeline genesis source
- feat: Allow processing of HTTP headers without underscores
- fix: Register the SLF4J and console reporters in MetricService
- fix(genesis-db): Do not include schema in call to SP_RENAME storec proc for mssql
- feat: data pipeline genesis to db sink GPAL
- fix: daemon shows unknown when there is no PROCESS_STATUS_MESSAGE in the GENESIS_PROCESS table
- feat: Adds dynamic rule notification functionality PTC-566
- feat: updated 'USER' table with unique indices for 'REFRESH_TOKEN'
- feat: Add support for sql server instance name in the data pipeline scripts

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

## Foundation UI 5.0.0 changes

- New options-datasource component for connected dropdowns
- foundation-testing package release for app developer / external usage
- Added new charting component covering various types, including: Area, Bar, Column, DualAxes, Line, Pie, Rose
- New charts-datasource component for connected charts
- foundation-header micro frontend restyling
- CLI optimisations for faster app creation
- foundation-reporting micro frontend improvements
- Number / precision work relating to smart forms and zero-number-field

## Early access - DSL changes

- Data integration
  - Real-time streaming data integration from a Postgres database
  - CSV and JSON files can also be ingested from a local file system
- Aggregations
  - Calculations using literal numbers (e.g. int, double) are now supported
- Flexible UI layouts
  - A multitude of flexible layout components can now be combined with existing UI components, such as grids and forms
  - Layouts can be nested to create specific sections within pages or elegant form structures
  - The default component settings can also be easily customised using parameters
- Developer experience
  - Reduction in 'clutter' of new projects at the top level to improve clarity and ease of navigation
  - Login (auth) component is now included by default but can still be overridden if needed

For more information, see [here](../../../gpalx/)
