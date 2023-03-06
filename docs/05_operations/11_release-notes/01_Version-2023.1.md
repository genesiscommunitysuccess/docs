---
title: 'Release notes - Version 2023.1'
sidebar_label: 'Version 2023.1'
sidebar_position: 2
id: version-2023-1
keywords: [operations, release notes, v-2023.1]
tags:
    - operations
    - release notes
    - v-2023.1
---

## Release notes
This is version v2023.1 of the documentation for the Genesis low-code platform.

The basis of this version is:

| part of stack | version | 
|---------------|---------|
| server        | 6.5.1   |  
| web           | 6.0.0   |   

Release date: Februrary 28, 2023. 

## Feature highlights
* **Revamped pending approval workflow** - The pending approval workflow has been revamped to support GPAL configuration and other improvements. More information [here](../../server/event-handler/advanced.md#pending-approvals).
* **Self-service password reset functionality** - The platform now supports self-service password reset capabilities. Please see this [page](../../server/access-control/password_authentication.md#selfservicereset) for more information.
* **JSON Schema validation** - Event handlers will now validate each incoming message based on the implicit JSON schema definition. See more information in [schema validation](../../03_server/04_event-handler/03_advanced.md#disabling-schema-validation) and [inter-process messages](../../server/inter-process-messages/metadata-annotations.md).
* **Case insensitive user login** - The user name field is now case-insensitive when attempting login operations.
* **Custom permissions support** - A new function called `customPermissions` is available within the `permissioning` block to improve integration with third-party entitlement systems. More information in this [page](../../03_server/05_access-control/05_authorisation-overview.md#custom-permissions-function).
* **OpenID Connect improvements** - It is now possible to set up a new logout workflow within Genesis to also log out the user from the underlying SSO identity provider.

## Genesis Server Framework (GSF)

### GSF

#### Breaking changes
- Make username available in scope within permissioning 'where' clause (see sample code in [here](../../server/access-control/authorisation.md#where-clauses))
- MS SQL fields will now use the appropriate "max length" parameter when `maxSize` value goes beyond the MS SQL limit. 
- Updated 'USER' table to have a unique index for 'REFRESH_TOKEN' field.
- Set minimal safe TLS version to 1.2.
- Revamp pending approval mechanism (more information [here](../../server/event-handler/advanced.md#pending-approvals)).
- Enable JSON schema validation for event handlers in GSF. See more information in [schema validation](../../server/event-handler/advanced.md#disabling-schema-validation) and [inter-process messages](../../server/inter-process-messages/metadata-annotations.md).

#### Features

- Add simple "toValue" extension function to transform/project POJO-like classes between each other.
- Added '--dumpSQL' feature to remap to allow export of DDL statements.
- DumpIt: Added support to query data based on the TIMESTAMP field.
- Create "customPermission" block in GPAL "permissioning" to support integration with third-party entitlement systems.
- Enable access to injector property and inject() method in Dataserver GPAL script definition.
- Allow running containers as non-root users.
- Allow access to self-service password reset without logging in.
- Enable case-insensitive support for username as part of login workflow in GENESIS_ROUTER.
- Make auth map optional in permissioning GPAL (see example in [here](../../server/access-control/authorisation-overview.md#auth-sub-block)).
- Update mon process statuses to include a new HEALTHY state when a process is passing its health checks.
- Allow auto-increment ids shared between more than one table definition to have their own sequence value.

#### Bugfixes

- ClearCodeGenCache: Add args to main method so compiler recognises it as a valid main method.
- "toDbRecord" method in generated GPAL view entities now sets all view fields.
- Fix issues around H2 compatibility. 
- Check alias store type is SQL to ensure compatibility when using FILE store.
- Correctly resolve dictionary when using a custom database schema in SQL.
- Aliased fields can now be used as part of criteria expressions definitions for dataserver and request reply. 
- Sequences are not deleted and recreated during Oracle remap. 
- Ensure sequences on autoincrement fields are deleted when the relevant tables are as part of remap.
- Fixed issue where the main docker image and the debug docker image would both be named "debug".
- Fixed issue whereby codegen would fail when using a formatter in GPAL fields definition.
- Fixes resource maps handling for Consul cluster mode.
- get/set AutoIncrement values now works as expected for Oracle and MSSQL layers.
- RT command will now wait for log file generation before tailing, up to 20 seconds.
- Remap: avoid check remap lock flag, rewriting AliasStore and rewriting DictionaryStore if there are no changes to be made.
- Removed hard requirement to provide a REQUIRES_APPROVAL field as part of the json schema definition.
- Remove sequences from backed up tables to avoid exception on creation of new table.
- Various fixes for SQL operations within custom database schemas.
- Checking existing constraints before trying to rename them.
- Cleaning the data after test execution.
- In case of process unavailability the user authentication state is now rolled back correctly.
- Initialise SysDef object during process bootstrap.
- Fix issues with `killProcessRestarter` implementation.
- Remap should not attempt to create a backup of tables that have been added to the schema when using Oracle.
- Fixed race condition happening very rarely as part of dataserver query priming for views.
- Only concat database schema name with table name when using DbNamespace option to ensure table match can be found (SQL databases)

#### Other changes
- Deprecate `Env` helper for Sysdef files
- Rename `backwardsJoins` to `backwardsJoin` in Dataserver GPAL API and deprecate `backwardsJoins`.
- Upgrade camel-bom dependency to version 3.18.4 and symphony-bom dependency to version 2.11.1 to avoid critical vulnerabilities.
- Reduced excessive logging in dataservers.
- Disable GenesisResourceDaemon script endpoint by default to avoid security vulnerabilities.

### Auth

#### Features

- Add "customLoginAck" block to auth-preferences, so we can further customise the login ack message (see this [page](../../server/access-control/password_authentication.md#customloginack)).
- Add new fields to ALL_APPROVAL_ALERTS and add new query for ALL_APPROVAL_ALERTS_AUDITS as part of pending approval workflow revamp.
- Added allowedClockSkewSeconds property to the OIDC verification configuration.
- Added logout functionality for OIDC.
- Allow configuration of default user state for user after creation.
- Implemented support for multiple LDAP connections.
- Add self-service password reset workflow.
- Enable system definition implicit receiver in SAML script.
- Make user login case-insensitive.
- Returning OIDC logout URL on Logout.

#### Bugfixes
- Fix issues with "loginAuthAck" implementation.
- Fixed issue where updates triggered by updateOn would throw an exception
- Fix ENTITY_VISIBILITY implementation to work as expected in terms of generated permissions.
- Fix index reference in auth-consolidator.xml to match index name in APPROVAL table.
- Make `id_token` the only mandatory field as part of OIDC response.
- OIDC Configuration that uses ALWAYS_ALLOW user strategy now works when used in combination with generic entity permissioning.

#### Other changes
- Do not log RECORD_NOT_FOUND at error level when cleaning up expired sessions
- Adds username to incoming messages for non-SSO login requests when refresh token is present.
- Update auth dataserver and consolidator configuration to match pending approval logic in GSF.
- Remove permissioning block from ALL_APPROVAL_ALERTS and ALL_APPROVAL_ALERTS_AUDITS.

## Foundation UI changes
This is a high-level overview of the changes.

### Features


### Maintenance


### Mapping


### Migration guide
