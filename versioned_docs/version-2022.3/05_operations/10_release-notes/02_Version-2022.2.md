---
title: 'Release notes - Version 2022.2'
sidebar_label: 'Version 2022.2'
sidebar_position: 2
id: version-2022-2
keywords: [operations, release notes, v-2022.2]
tags:
    - operations
    - release notes
    - v-2022.2
---

## Release notes
This is version v2022.2 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version |
|---------------|---------|
| server        | 6.1.0   |
| web           | 2.0.0   |

Release date: July 08, 2022. Note that there is sub-release, [2022.2.1](../../../operations/release-notes/version-2022-2/#release-202221), which is dated September 30, 2022.

## Genesis Server Framework (GSF)

- **GPAL Camel [Breaking Change]**. The Genesis Camel component now has a GPAL interface. This brings all the benefits of GPAL,  including intellisense, autocompletion, compile-time errors and remote debugging capabilities. The Genesis Camel component is typically used for custom integration of external systems, such as file-based ingestion from SFTP sites or S3 buckets.
- **GPAL Data Pipeline component**. This is a new component created to simplify the ingestion of pipelines of data from external sources, and to map them into a Genesis application. It supports real-time data ingestion from Postgres, Oracle, and MSSQL RDBs. Files can be ingested from local filesystem and external sources. Csv and Json file contents are supported.
- **Oracle Support**. Oracle Server is now supported as a database layer.
- **DSL**. The first release (version 0.0.1) of our proprietary DSL now enables you to define full-stack applications, unifying front-end and back-end development.
    This is designed to improve the speed and efficiency of development on the Genesis low-code platform. You can now:

    - enable authentication more easily across your applications- more easily authorise access to grids, views or commands
    - create custom commands and advanced views (via custom cell renderers).

Main details are:

- CLI Integration
    - New seed with DSL support

- Dynamic UI routing
    - DSL-driven dynamic routing configuration
    - Dynamic navigation bar component
    - Configurable page visibility (public/private)
    - Configurable default page

- Rendering & creation of model instances
    - UI views dynamically derived from a data model
    - Read-only grid view: columns derived from model fields with support for custom cell renderers (e.g. Buy/Sell) e.g. list of trades
    - Create form view: inputs are derived from model fields e.g. insert trade form

- Dynamic page structure
    - DSL-driven pages with dynamic structure
    - Declarative way of describing page elements and their attributes
    - Support for both standard HTML elements and custom Web Components (Genesis/third-party)
    - No constraints on nesting-levels

- Triggering commands
    - DSL-driven method for triggering commands (e.g. cancel trade)
    - Custom grid cell renderer to display buttons associated with commands
    - Context-specific commands (e.g. trade cancel command available in trade context)

- Automatic inference of required services
    - Back-end services inferred from UI definition (Data Server/Event Handler)
    - Back-end project dynamically generated
    - Gradle plugin driving DSL code generation

- Cross-cutting UI concerns (services)
    - Support for functionality spanning multiple pages (e.g. auth, analytics etc.)
    - Login service integrating the existing login micro front-end

- Versioned schema for generated DSL code
    - Formal contract between generators and consumers; this can be used for validation and ensuring interoperability
    - Versions allow evolving functionality over time

- Defining the data model
    - Define data model in DSL
    - Basic workflow definition
    - Joining data sources into views

### Auth

Auth now offers periodic JWT (JSON Web Token) revalidation for a logged-on user. Users that fail revalidation are automatically logged off from their session. This improves security options for applications that use JWT SSO.

You can now use a Pubic URL to obtain a JWT public key for token validation. Auth enables you to configure JWT (JSON Web Token) SSO to implement this. (You can, of course, still use pre-configured Public Keys.)

The way that operations in the AUTH API are permissioned has changed. The Event Handlers listed below are now defined using GPAL, which means that they are only accessible to users with the ADMIN profile, or users with a specific ACCESS_TYPE. They are now permissioned using RIGHT codes. This gives you more flexibility to decide what is and what is not an ‘admin’ operation in your system.

As part of the upgrade, these Event Handlers now support validation operations.

| Event Handler              | Permission Code       | Visibility      |
|----------------------------|-----------------------|-----------------|
| EVENT_INSERT_USER          | ADD_USER              | USER_VISIBILITY |
| EVENT_AMEND_USER           | AMEND_USER            | USER_VISIBILITY |
| EVENT_DELETE_USER          | DELETE_USER           | USER_VISIBILITY |
| EVENT_ENABLE_USER          | ENABLE_USER           | USER_VISIBILITY |
| EVENT_DISABLE_USER         | DISABLE_USER          | USER_VISIBILITY |
| EVENT_USER_PROFILE_AMEND   | USER_PROFILE_AMEND    | USER_VISIBILITY |
| EVENT_INSERT_PROFILE       | ADD_PROFILE           |                 |
| EVENT_AMEND_PROFILE        | AMEND_PROFILE         |                 |
| EVENT_DELETE_PROFILE       | EVENT_DELETE_PROFILE  |                 |
| EVENT_RESET_USER_PASSWORD  | RESET_PWD, `<SELF>`   | USER_VISIBILITY |
| EVENT_CHANGE_USER_PASSWORD | CHANGE_PWD, `<SELF>`  | USER_VISIBILITY |
| EVENT_EXPIRE_USER_PASSWORD | EXPIRE_PWD, `<SELF>`  | USER_VISIBILITY |
| EVENT_MFA_CREATE_SECRET    | MFA_SECRET, `<SELF>`  | USER_VISIBILITY |
| EVENT_MFA_CONFIRM_SECRET   | MFA_CONFIRM,` <SELF>` | USER_VISIBILITY |
| EVENT_ENABLE_MFA_FOR_USER  | MFA_ENABLE, `<SELF>`  | USER_VISIBILITY |
| EVENT_DISABLE_MFA_FOR_USER | MFA_DISABLE, `<SELF>` | USER_VISIBILITY |
| VALIDATE_JWT               | No permission code    |                 |

:::warning
The new GPAL Event Handlers are transactional, as long as the underlying DB layer supports it. **If it does not, there is no central locking mechanism to prevent concurrent transactions.**

If you are using Aerospike, exercise caution. We expect to implement a locking mechanism in a later release. Further in the future, AUTH will be extracted to a separate installation, which will be locked to Postgres.
:::

### FIX
You can now configure a FIX gateway for a number of different logging levels. Use the XML element `<LogFactoryImpl>`. Valid values are FILE, SLF4J, CONSOLE, NONE.

For improved message processing, a FIX gateway can now be configured for a number of different threading models. Use the XML element `<threadModel>`. Valid values are SINGLE, THREAD_PER_SESSION, IO_THREAD.

- `THREAD_PER_SESSION` - This setting is ideal for gateways hosting multiple sessions; each session has a dedicated queue with a single processing thread.
- `IO_THREAD` - To be used with care, in situations where the gateway must deal with a very high volume of messages. Messages will not be buffered in application memory, as they are handled directly on the MINA IO thread without being handed off to an intermediate queue. This prevents the application running out of memory when messages cannot be processed and offloaded faster than they are received. However, it is paramount that the application code never blocks this thread, otherwise the IO pool can be starved.

- The FIX_SESSION_AUTH table now has a boolean `ENABLED` flag. This can be used as a kill switch for sessions using credential-based authentication.
- QuickFIX DataDictionary objects are now cached based on path. This prevents high memory consumption when many concurrent sessions are running.
- The FIXAdmin groovy script has been updated to allow sequence-number resets for named sessions. This creates increased reliability.
- Dynamic sessions are no longer de-registered on Logout. Ths allows you to administer the session when it is not connected (for example, to reset sequence numbers).

### Router

The Router now supports `blockList` as well as `allowList` for restricting message types that can be accessed. `blockList` and `allowList` can not be used together and an error is reported if an attempt is made to do so. This offers additional flexibility in restricting message types for any additional security issues that may arise.

### Reporting capability

A new micro front-end on Reporting enables users to create, configure, run and maintain ad-hoc reports.

### General

- `startProcess` now supports additional VM parameters that start with `-agentlib`. This gives you easier remote debugging of Genesis-based processes; previously, developers had to modify the `<options>` tag in the process definition file and then run a `genesisInstall`.

- Backwards join cache for views is not in use anymore, unless enabled in configuration
- Performance improvements for view join operations
- Multiple bug fixes for cache configuration
- We have implemented SQL db alias store
- Changes in pal-dataserver to avoid `ConcurrentModificationException` when using real-time updates for dynamic auth
- Added support for MAX_ROWS in custom Request Servers
- Fixed “return” statement in derived fields implementation
- Fixed issue in which primary node would constantly “forget” its role after being set for the first time
- Fixed DropTable operation for FDB2 layer
- Changed internal table-counter implementation. This creates better performance when executing many inserts/deletes to the same table in FDB and FDB2 layers
- Added support for view objects as metadata in Event Handlers

### Breaking changes
`writeTransaction` and `readTransaction` methods at the database API for the RxJava flavour expected the usage of `blockingGet()` operations within the transaction. This approach had the potential to introduce deadlocks at the database level, and also reduce performance by forcing you to use blocking operations.

The lambda provided to `writeTransaction` and `readTransaction` should never call blocking operations now. Instead, it should return a `Single<>` type.

## Foundation UI changes
This is a high-level overview of the changes.

### Features
- DI based connect and http.connect configs, which can be set at an app level.
- Reporting micro front-end has been added.
- Entity Management micro front-end improvements and user management use-case refinement.
- Flyout component (Menus etc.)
- HTTP Polling functionality has been added to foundation-comms; in addition, a number of comms-related issues have been fixed, edge cases etc. The  REFRESH_AUTH_TOKEN feature has been added.
- Updates to foundation-zero (a.k.a. Rapid) to make it both dark- and light-mode compatible. Some tokens have been removed or re-mapped. **Breaking changes** may occur in the form of app-level style shifts.
- Grid Pro related improvements, both grid and datasource, events, styles, action-menu etc. This has introduced some **breaking changes**.
- Auth error messaging has been improved to bring greater clarity the Login micro front-end.
- Dialog and modal behaviour improvements.
- Minor styling improvements to Form and Zero Tabs.
- Genx CLI improvements, code gen templating, support for multibyte characters in jfrog usernames/passwords.
- Ability to export component assets such as template, styles etc. consistently. This aids extension.
- Improved Icon component.

### Maintenance
- Issues with the inheritance chain between DS-level components, our foundation components, and the FAST component / element baseline have been fixed.
- Conventional commits to `foundation-ui repo`, `commit linting` etc, have been introduced. This enables us to create detailed release notes and to correctly set semver numbers across our packages.
- Other linting task settings have been improved.
- We have added build-stats generation to all our packages; this helps us monitor our dependency graphs.
- Update to Lerna 5.

## Release 2022.2.1
This is version 6.2.0 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version |
|---------------|---------|
| server        | 6.2.0   |
| web           | 4.0.0   |

## Foundation UI (Web)
### Features
- New flex-layout component added for easy-to-use Flexbox layouts (there’s also an upcoming app-layout component with UI persistence features).
- **IMPORTANT** select / combobox / multiselect now have their own datasource adapters, allowing quick and easy integration with back-end data (this is the same as in our grids, but for list elements!)
- New error-boundary component, which enables improved error management for UI elements.
- [Grid column persistence](../../../getting-started/go-to-the-next-level/data-grid/#saving-user-preferences) to restore a user’s column preferences between app reloads.
- **IMPORTANT** charts component wrapper for [@ant-design/charts](https://github.com/ant-design/ant-design-charts/) added, allowing the following types: Line, Area, Bar, Column, Pie, Dual Axes, Rose.
- Added SSO login support for Symphony. WebSocket connection addresses now fully configurable (auto assignment of ws: or wss:, and allowing other extensions - default still /gwf/)
- New CLI tasks to help end users analyse their component usage and switch design-system prefixes. These generate sample code for users to copy from the terminal to their projects.
- `@Auth` / `@Session` bug fixes involving user roles and session storage.
- Added reconnect streams logic for more fault-tolerant connection handling.
- A number of (`foundation-header`, `foundation-reporting`) styling improvements to micro front-ends.
- The `foundation-header` for micro front-ends is more configurable.
- Created How-To and API documentation for several of our micro front-ends:
    - [Header](../../../web/micro-front-ends/foundation-header)
    - [Entity Management](../../../web/micro-front-ends/foundation-entity-management)
    - [User Management](../../../web/micro-front-ends/foundation-user-management)
    - [Profile Management](../../../web/micro-front-ends/foundation-profile-management)
    - [Login](../../../web/micro-front-ends/foundation-login)
    - [Reporting](../../../web/micro-front-ends/front-end-reporting)
- Added multiple parameter support for Testing Suite in foundation-testing
- More code examples in our Showcase Client App, including selecting values and labels in our combobox programmatically.
- Added [slotted-styles](https://docs.genesis.global/secure/getting-started/go-to-the-next-level/customize-look-and-feel/#styling-grid-pro) component to allow overriding component styles.

### Maintenance
- Various CLI tweaks to support continuing DSL work.
- A named release process now supports ad-hoc release requests from App Dev.
- [commitlint](https://commitlint.js.org/#/) improvements.
- Added [prettier](https://prettier.io/) to provide unified code formatting automatically.
- Defined a pattern for providing E2E selector hooks for our micro front-ends, which we’ll continue to roll out.
- CLI will now offer the user a choice between downloading tarballs or using git to clone seeds.
- **IMPORTANT** http.connect GSF is now using [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) with hyphens to match with [nginx](https://www.nginx.com/) default settings. This release (4.0.0) will only be compatible if you’re also with GSF 6.1.4+.

## Genesis Server Framework

## Important notes
- After the introduction of support for MSSQL and Postgres namespaces (schemas) in genesis-db, the `DbNamespace` SysDef item is now applicable to platform implementations using MSSQL and Postgres databases. Previously, this item would be ignored. Many standard system definition files specify a placeholder value for this configuration key. In order to use the default database schema (previous behaviour), this item must be removed from the system definition.
- MSSQL and Postgres namespaces (schemas) are supported in genesis-db. You can now use namespaces/schemas to segregate data from different Genesis apps while still using the same logical database. This means that you do not need a separate database for Genesis app. You don't need the additional set-up effort and you can save on operations costs.
- The `DbNamespace` item in the system definition file is now applicable to platform implementations using MSSQL and Postgres databases. Previously, this item would be ignored. Many standard system definition files specify a placeholder value for this configuration key. In order to use the default database schema (previous behaviour), this item must be removed from the system definition.
## Breaking changes
- Kotlin has been upgraded to version 1.7.10. Any applications that depend on GSF 6.2.0 must upgrade their Kotlin version.
- Gradle has been upgraded to version 7.5. Any applications that depend on GSF 6.2.0 must upgrade their Gradle version.
- The NAME field in genesis-fields-dictionary.kts now has a max size definition of 255. If your application redefines the NAME field, this will cause a conflict.

## New
### Data Pipeline
- Auditable tables. You can now add auditable = true to tables to enable auto-auditing, so that every interaction with the table is audited.
- Complex data-pipeline sink strategies. You can change the state of your Genesis application based on data sources, such as relational databases and files (CSV, JSON, etc.), using business logic that you define. So, you can delete and edit records without additionally needing to store a new record. You can edit a record if it exists, or else create a new record. This can be used with Debezium and Camel sources.
Source operation type is passed to sink and where functions. This is useful for creating a data pipeline from a relational database. The application can be notified when a given row in the upstream database is modified or deleted. The operation is clearly identified: insert, modify or delete. Thus, you can implement different logic to handle each type.
- Database history is now stored to the database. This replaces the NoopDatabaseHistory.

### Deploy to a local Docker image
Docker jobs have been added to the deploy plugin. You can now deploy to a local docker image via SSH. Both the front end and back end can be deployed from Docker.
There is now an install site-specific distribution task to `genesissetup` group. You can now add csv files to **$productName-site-specific/src/main/resources/data** - which can be loaded into the database using `loadInitialData`. The csv files must be deployed to the site-specific folder in genesis home. This enables the `loadInitialData` Gradle task to work correctly for generated projects.

### ZeroMQ logging
ZeroMQ publishers and subscribers (and the ZeroMQ proxy implementation) now have extra logging. There is extra trace logging for message publication and subscription in the ZeroMQ layer. These should aid debugging.

- PublisherWorker.java. We have added trace logging inside:

    - “publish” method for the UpdateQueueMessage instance
    - “this.socket.sendMore” and “this.socket.send” method calls inside “onEvent” method. These method calls return a boolean value to indicate if the send operation was successful or not.

- SubscriberWorker.java. We have added trace logging inside recv() method for:

    - this.socket.recvStr();
    - final byte msgTrimmed = this.socket.recv();
    - the unpacked message (final V message = handler.getUpdateQueueUnpacker().unpack(tlUnpacker);
    - ZeroMQForwarder.kt. This is used when proxying ZeroMQ updates via the GENESIS_CLUSTER implementation. Publishers will send messages to GENESIS_CLUSTER and GENESIS_CLUSTER will redistribute those to any other process subscribed to it.

- Methods. We have added trace logging for the following methods:
    - `recvStr()`
    - `recv()`
    - `sendMore()`
    - `send()`

    These have been applied in a similar fashion to both Subscriber worker and PublisherWorker. When logging a bytearray, ensure you call Arrays.toString() (or similar) to ensure you are not just printing the object reference.

### AUTH
The Auth module is now updated to GSF 6.2.0, Kotlin 1.7.10 and Gradle 7.5. This is a breaking change.

New features for the module are:

- added onLoginSuccess callback into auth-preferences GPAL
- added config flag to bypass internal auth check on Login
- added installHook to load new profile rights data from relevant CSV

The following bugs have been fixed:

- Auth refresh tokens are regenerated on each use to prevent security issues.
- Issues with resolving user attributes for entity-visibility-checks have been addressed.
- We now do not perform user entity-change-logic on unnecessary user fields. I

### FIX
- The FIX module is now updated to GSF 6.2.0, Kotlin 1.7.10 and Gradle 7.5. This is a breaking change.

New features for the module are:

- hostname has been added to the connection status table
- core FIX framework now has a new set of metrics

### Market Data
The Elektron data source is now updated to GSF 6.2.0, Kotlin 1.7.10 and Gradle 7.5. This is a breaking change.

### Other new features
- **Install hooks**. `genesisInstall` handles exit codes of 2 for installHooks that need to run after a remap. The install hooks populate the database with new rights codes (provided as csv files) as part of the new release.
- **New configOverridesFile tag**. This new flag for the processes.xml file enables server-specific system-definition overrides.
- **Site-specific module for project templates**. You can now create a template module for further definition using pro-code.
- **Flag to disable genesis console endpoints**. A new flag for the system definition file provides a simple way of disabling access to Genesis Console endpoints and securing applications.
- **Running processes now maintain a PID file**. These PID files can be used by mon (and other scripts) to track the processes.
field size and filename have been removed from codegen. This addresses occasional issues with the cache.
- **Optional remap user for running DDL queries** Genesis apps can now optionally bundle their generated classes.
- **remap credentials and the CLI**. Database credentials can now be provided via the CLI when you are running remap.
- **Migration Hooks now support a database state store as well as a file system**. Install hooks are now from a database migration script.
- **Standard out and err are not redirected when running in docker**. Logs for all relevant processes of a container’s PID 1 are available via `stdout`. This can be integrated into existing logging solutions where necessary.
- **Auto restart on GENESIS_CLUSTER and GENESIS_ROUTER**. These processes now restart automatically in the event of an unexpected system shutdown.
- **CDC support for Oracle**. Oracle CDC (Change Data Capture) identifies and captures data added to, updated, and deleted from Oracle tables. This data can then be used by your application.

## Bug fixes
This release incorporates the following bug fixes:

- On the deploy plugin, the broken sys def generation has been fixed.
- There have been various Streamer Client fixes.
- we have improved tracking of responses in Streamer Client **EventHandlerClient.kt**
- The GPAL Request Server implementation has been amended, ensuring recordsLimit is applied after running where clause and permissioning logic.
- Handling of enum fields in joins (views) has been fixed.
- GPAL Consolidator throwing exception when multiple permanent consolidations target the same table.
- The phenomenon of the database remaining open after the server has been closed has been fixed.
- Gradle file-locking issues have been resolved.
- The database status checker now considers WARNING status valid for `isDatabaseUp` checks; the warning threshold has been increased to 80%.
- genesis-db: The `selectAllTables` statement now always returns the table name without the schema prefix.
- The method for calculating free space in FoundationDB has been changed.
- Queries to **SQLDictionaryStore.kt** now return identical column names across different SQL databases.
- deploy-plugin: we have updated the use of the `sed` command, which is used in `setupEnvironment` task.
- We now allow resolution of kts script files from **src/main/resources/script directory** for backwards compatibility.
- RenameFields is now not applied when the input and output are in the same table.
remap cache issues have been addressed.
- Fixes have been applied to ensure H2 support.
- There have been various fixes and improvements to `DbMon`.
- Exception handling has been improved in `GenesisScriptHost`.
- The bashrc script has been updated to include the latest deploy plugin 6.1.x (so the wsl user home is the same as the user home on the host).
- auth and router modules now work correctly when auth is disabled.
- Field size handling in `genesis-dataserver2` and `genesis-pal-dataserver` has been improved.
- We now prevent an exception on invocation of `renameFields`.
- We have stopped unnecessary folder deletion in the `killServer` script.
- Issues with Oracle and MSSQL support have been fixed.
- Issues with Data Pipeline for RDBs have been corrected.
