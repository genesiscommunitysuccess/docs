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
* **Revamped pending approval workflow** - The pending approval workflow has been revamped to support GPAL configuration and other improvements. More information [here](../../../server/event-handler/advanced/#pending-approvals).
* **Self-service password reset functionality** - The platform now supports self-service password reset capabilities. Please see this [page](../../../server/access-control/password-authentication/#selfservicereset) for more information.
* **JSON Schema validation** - Event Handlers now validate each incoming message based on the implicit JSON schema definition. See more information in [schema validation](../../../server/event-handler/advanced/#disabling-schema-validation) and [inter-process messages](../../../server/inter-process-messages/metadata-annotations/).
* **Case-insensitive user login** - The user name field is now case-insensitive when attempting login operations.
* **Custom permissions support** - A new function called `customPermissions` is available within the `permissioning` block to improve integration with third-party entitlement systems. More information in this [page](../../../server/access-control/authorisation-overview/#custom-permissions-function).
* **OpenID Connect improvements** - It is now possible to set up a new logout workflow within Genesis that also logs out the user from the underlying SSO identity provider.

## Genesis Server Framework (GSF)

:::info

GSF and its modules are compiled using Kotlin 1.7.10 and Gradle 7.5.0.

:::

## GSF

### Breaking changes
- Make username available in scope within a permissioning 'where' clause (see [sample code](../../../server/access-control/authorisation/#where-clauses))
- MS SQL fields now use the appropriate "max length" parameter when the `maxSize` value goes beyond the MS SQL limit. 
- The 'USER' table has been updated to include a unique index for the 'REFRESH_TOKEN' field.
- The minimal safe TLS version is now set to 1.2.
- The pending approval mechanism has had a [major revamp](../../../server/event-handler/advanced/#pending-approvals)).
- JSON [schema validation](../../../server/event-handler/advanced/#disabling-schema-validation) and [inter-process messages](../../../server/inter-process-messages/metadata-annotations/) have been enabled for Event Handlers in GSF.

### Features

- There is now a simple "toValue" extension function to transform/project POJO-like classes between each other.
- We have added '--dumpSQL' feature to remap to allow export of DDL statements.
- DumpIt: Added support to query data based on the TIMESTAMP field.
- There is now a "customPermission" block in GPAL "permissioning" to support integration with third-party entitlement systems.
- We have enabled access to injector property and inject() method in the Data Server GPAL script definition.
- We now allow running containers as non-root users.
- There is now access to self-service password reset without logging in.
- We have enabled case-insensitive support for username as part of the login workflow in GENESIS_ROUTER.
- Auth map is now optional in permissioning GPAL (see this [example](../../../server/access-control/authorisation-overview/#auth-sub-block)).
- Mon process statuses now include a new HEALTHY state when a process has passed its health checks.
- Auto-increment ids can be shared between more than one table definition to have their own sequence value.

### Bugfixes

- ClearCodeGenCache: Add args to main method so compiler recognises it as a valid main method.
- "toDbRecord" method in generated GPAL view entities now sets all view fields.
- Issues around H2 compatibility have been fixed. 
- Check alias store type is SQL to ensure compatibility when using FILE store.
- Various fixes for SQL operations within custom database schemas.
- Correctly resolve dictionary when using a custom database schema in SQL.
- Aliased fields can now be used as part of criteria expressions definitions for dataserver and request reply. 
- Sequences are not deleted and recreated during Oracle remap. 
- Ensure sequences on autoincrement fields are deleted when the relevant tables are deleted (as part of a remap).
- The issue where the main docker image and the debug docker image would both be named "debug" has been fixed.
- An issue where codegen would fail when using a formatter in the GPAL fields definition has been fixed.
- Resource maps handling for Consul cluster mode has been fixed.
- get/set AutoIncrement values now works as expected for Oracle and MSSQL layers.
- RT command will now wait for log file generation before tailing, up to 20 seconds.
- Remap: we now avoid check remap lock flag, rewriting AliasStore and rewriting DictionaryStore if there are no changes to be made.
- Remap should not attempt to create a backup of tables that have been added to the schema when using Oracle.
- We have removed the hard requirement to provide a REQUIRES_APPROVAL field as part of the json schema definition.
- We have removed sequences from backed up tables to avoid exception on creation of new table.
- Checking existing constraints before trying to rename them.
- Cleaning the data after test execution.
- In case of process unavailability the user authentication state is now rolled back correctly.
- Initialise SysDef object during process bootstrap.
- Issues with `killProcessRestarter` implementation have been fixed.
- Fixed race condition happening very rarely as part of dataserver query priming for views.
- Only concat database schema name with table name when using DbNamespace option to ensure table match can be found (SQL databases).

### Other changes
- The `Env` helper for Sysdef files has been deprecated.
- We have renamed `backwardsJoins` to `backwardsJoin` in Data Server GPAL API and deprecate `backwardsJoins`.
- camel-bom dependency has been upgraded to version 3.18.4 and symphony-bom dependency to version 2.11.1 to avoid critical vulnerabilities.
- Excessive logging in dataservers has been deprecated.
- GenesisResourceDaemon script endpoint is now disabled by default to avoid security vulnerabilities.

## Auth

### Features

- We have added "customLoginAck" block to auth-preferences, so we can [further customise the login ack message](../../../server/access-control/password-authentication/#customloginack)).
- New fields have been added to ALL_APPROVAL_ALERTS and add new query for ALL_APPROVAL_ALERTS_AUDITS as part of the pending approval workflow revamp.
- We have added allowedClockSkewSeconds property to the OIDC verification configuration.
- There is now logout functionality for OIDC.
- We now allow configuration of the default user state for the user after creation.
- There is now support for multiple LDAP connections.
- There is now a workflow for self-service password reset.
- We have enabled system definition implicit receiver in SAML script.
- User login is now case-insensitive.
- Returning OIDC logout URL on Logout.

### Bugfixes
- Issues with "loginAuthAck" implementation have been fixed.
- We have fixed an issue where updates triggered by updateOn would throw an exception
- ENTITY_VISIBILITY implementation has been fixed to work as expected in terms of generated permissions.
- The index reference in auth-consolidator.xml has been fixed to match the index name in APPROVAL table.
- `id_token` is now the only mandatory field as part of OIDC response.
- OIDC Configuration that uses ALWAYS_ALLOW user strategy now works when used in combination with generic entity permissioning.

#### Other changes
- RECORD_NOT_FOUND is not logged at error level when cleaning up expired sessions.
- We have added username to incoming messages for non-SSO login requests when a refresh token is present.
- The auth dataserver and consolidator configuration have been updated to match the pending approval logic in GSF.
- Remove permissioning block from ALL_APPROVAL_ALERTS and ALL_APPROVAL_ALERTS_AUDITS.

## Foundation UI changes
This is a high-level overview of the changes.

### Features


### Maintenance


### Mapping


### Migration guide
