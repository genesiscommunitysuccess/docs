---
title: 'Version 2022.2'
sidebar_label: 'Version 2022.2'
sidebar_position: 5
id: version-2022-2
---

This is version v2022.2 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.1.0   |  
| web           | 2.0.0   |   

Release date: July 08, 2022.

# Release notes

## GPAL Camel [Breaking Change]
The Genesis Camel component now has a GPAL interface. This brings all the benefits of GPAL,  including intellisense, autocompletion, compile-time errors and remote debugging capabilities.

The Genesis Camel component is typically used for custom integration of external systems, such as file-based ingestion from SFTP sites or S3 buckets.

## GPAL Data Pipeline component

This is a new component created to simplify the ingestion of pipelines of data from external sources, and to map them into a Genesis application.

It supports real-time data ingestion from Postgres, Oracle, and MSSQL RDBs. Files can be ingested from local filesystem and external sources. Csv and Json file contents are supported.

## Oracle Support

Oracle Server is now supported as a database layer.

## DSL

The first release (version 0.0.1) of our proprietary DSL now enables you to define full-stack applications, unifying front-end and back-end development.

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

## Auth

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

## FIX
You can now configure a FIX gateway for a number of different logging levels. Use the XML element `<LogFactoryImpl>`. Valid values are FILE, SLF4J, CONSOLE, NONE.

For improved message processing, a FIX gateway can now be configured for a number of different threading models. Use the XML element `<threadModel>`. Valid values are SINGLE, THREAD_PER_SESSION, IO_THREAD.

- `THREAD_PER_SESSION` - This setting is ideal for gateways hosting multiple sessions; each session has a dedicated queue with a single processing thread.
- `IO_THREAD` - To be used with care, in situations where the gateway must deal with a very high volume of messages. Messages will not be buffered in application memory, as they are handled directly on the MINA IO thread without being handed off to an intermediate queue. This prevents the application running out of memory when messages cannot be processed and offloaded faster than they are received. However, it is paramount that the application code never blocks this thread, otherwise the IO pool can be starved.

- The FIX_SESSION_AUTH table now has a boolean `ENABLED` flag. This can be used as a kill switch for sessions using credential-based authentication.
- QuickFIX DataDictionary objects are now cached based on path. This prevents high memory consumption when many concurrent sessions are running.
- The FIXAdmin groovy script has been updated to allow sequence-number resets for named sessions. This creates increased reliability.
- Dynamic sessions are no longer de-registered on Logout. Ths allows you to administer the session when it is not connected (for example, to reset sequence numbers).

## Router

The Router now supports `blockList` as well as `allowList` for restricting message types that can be accessed. `blockList` and `allowList` can not be used together and an error is reported if an attempt is made to do so. This offers additional flexibility in restricting message types for any additional security issues that may arise.

## Reporting capability

A new micro front-end on Reporting enables users to create, configure, run and maintain ad-hoc reports.

## General

- `startProcess` now supports additional VM parameters that start with `-agentlib`. This gives you easier remote debugging of Genesis-based processes; previously, developers had to modify the `<options>` tag in the process definition file and then run a `genesisInstall`.

### Other improvements

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

## Breaking changes
`writeTransaction` and `readTransaction` methods at the database API for the RxJava flavour expected the usage of `blockingGet()` operations within the transaction. This approach had the potential to introduce deadlocks at the database level, and also reduce performance by forcing you to use blocking operations.

The lambda provided to `writeTransaction` and `readTransaction` should never call blocking operations now. Instead, it should return a `Single<>` type.

## FoundationUI changes
This is a high-level overview of the changes.

### Features
- DI based connect and http.connect configs, which can be set at an app level.
- Reporting micro front-end has been added.
- Entity Management micro front-end improvements and user management use-case refinement.
- Flyout component (Menus etc.)
- HTTP Polling functionality has been added to foundation-comms; in addition, a number of comms-related issues have been fixed, edge cases etc. The  REFRESH_AUTH_TOKEN feature has been added.
- Updates to foundation-zero (a.k.a. Rapid) to make it both dark- and light-mode compatible. Some tokens have been removed or re-mapped. **Breaking changes** may occur in the form of app-level style shifts.
- AG-Grid related improvements, both grid and datasource, events, styles, action-menu etc. This has introduced some **breaking changes**.
- Auth error messaging has been improved to bring greater clarity the Login micro front-end.
- Dialog and modal behaviour improvements.
- Minor styling improvements to Form and Zero Tabs.
- Genx CLI improvements, code gen templating, support for multibyte characters in jfrog usernames/passwords.
- Ability to export component assets such as template, styles etc. consistently. This aids extension.
- Improved Icon component.

### Maintenance
- Issues with the inheritance chain between DS-level components, our foundation components, and the FAST component / element baseline have been fixed.
- Conventional commits to foundation-ui repo, commit linting etc, have been introduced. This enables us to create detailed release notes and to correctly set semver numbers across our packages.
- Other linting task settings have been improved.
- We have added build-stats generation to all our packages; this helps us monitor our dependency graphs.
- Update to Lerna 5.