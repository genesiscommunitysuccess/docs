---
title: 'Operations - Remap'
sidebar_label: 'Remap'
id: Remap
keywords: [operations, server, commands, Remap, schema]
tags:
    - database
    - server
    - commands
    - Remap
    - schema
---

# Remap

Remap is a schema-migration tool that applies the current schema (defined in the deployed field and table GPAL dictionaries) to the underlying database layer. 

Remap should be run in the following scenarios:

- If the Genesis Server Framework or any Genesis server component has been upgraded, which could include schema changes.
- If a new version of an application is deployed and any dictionary file has changed (this means changes to fields, tables, or views GPAL).

## Syntax

```bash
remap [-c | --commit]
```

| Argument | Argument long name     | Mandatory | Description                                                                            | Restricted values |
|----------|------------------------|-----------|----------------------------------------------------------------------------------------|-------------------|
| -f       | --force                | no        | Forces the unlocking of a locked database                                              | No                |
| -c       | --commit               | no        | Applies dictionary changes to the database                                             | No                |
|          | --force-dao-generation | no        | Forces the re-generation of DAOs on the given host                                     | No                |
|          | --skip-dao-generation  | no        | Skips the re-generation of DAOs on the given host                                      | No                |
|          | --ask-db-password      | no        | Prompts for a DB user password to be manually entered                                   | No                |
| -d       | --dumpSQL              | no        | Outputs the SQL DDL statements to the console instead of applying them to the db        | No                |
| -m       | --metadataOnly         | no        | Only updates the GSF dictionary and alias stores; does not apply any table changes    | No                |
|          | --skip-unchanged       | no        | Forces remap to fail if the `--commit` option is used and schema changes are present  | No                |
| -dm      | --dumpMode             | no        | Determines where the DDL statements are outputted when using `--dumpSQL`. The user will have the option of specifying the CONSOLE or a .sql file. | Yes: CONSOLE, FILE |
|          | --db-username          | no        | Allows the user to enter the username for override credentials via the cli. This command works with fdb and Oracle.                               | No                 |
|          | --db-password          | no        | Allows the user to enter the password for override credentials via the cli. This command works with fdb and Oracle.                               | No                 |

If you run `remap` with no arguments, it simply gives a report of changes that exist in the configuration:

```bash
==================================

Table Changes

==================================

Added ADMINISTRATOR.NAME

==================================

Field changes

==================================

No changes

==================================

Key changes

==================================

No changes
```

To commit the changes to the database, use the `--commit` argument.

:::note
If no changes between the schema files and the current database schema are detected, remap will not perform any action.
:::

## How it works

For clarity, we refer here to the schema being used by the database layer as "schema" and the current file system schema as "dictionaries".

When you initially deploy your application to the platform, `remap` generates the schema from the dictionaries. No changes will be required as there is no existing schema.
The next time you run `remap` this previously generated schema will be compared against the dictionaries to find any changes.

Once it has finished the comparison, it will print the change list (see above), and if the "--commit" option was provided, it will attempt to modify the current schema to match the deployed dictionaries.

Once generated, `remap` then re-generates code (i.e. database entities and repositories) based on the schema to ensure that the deployed application works as expected. This step can be time- and memory-consuming, and we have already implemented the option to deploy the generated code directly as part of the application package, instead of relying on remap for re-generating the code every time.

The `remap` command will return `0` if everything is successful, and any other number if something has gone wrong.

### Additional operations

If using Aerospike or FoundationDB, `remap` will save the internal field and table aliases to the Alias Store.

The Aerospike DB layer needs UDFs (user-defined functions) to work correctly, because these are also generated by `remap`.

## Rollback

If a successful `remap` needs to be rolled back for any reason, you can:

- run `remap` again in an environment containing the previous Genesis schema files to apply the reverse changes
- use the CSV files generated during the remap process (located in **$GENESIS_HOME/runtime/Remap**) and reload the old data using the `SendIt` tool
- manually dump the database contents to CSV using `DumpIt` before performing remap and then recover them back using `SendIt`; this would have to be done as part of the CI/CD configuration
- create a database backup using native database tools (i.e. native PostgreSQL backup, native FoundationDB backup, etc.) and then use native database restore tools to return to the previous state

## Considerations and limitations

### Locks

When you run `remap`, the database is automatically locked to ensure that no other `remap` can run concurrently.

If the database crashes during a `remap` and the database remains locked (or if the database is locked for any other reason), run the following to unlock the database:

```shell
remap --force --commit
```

### Transactions

Either all changes are applied or none are. In the case of databases that don't support transactional DDL (Oracle) or have transactional limitations (FoundationDB and Aerospike), `remap` clones each affected table and performs the changes on each cloned table instead of the original tables; this can add to the time it takes to perform the operation.

### Data migration

Remap does not perform any complex data migration, only schema changes. Some custom steps may be required to handle more complex changes.

### Field changes

Renaming fields is unsupported by `remap`, as there is no way to identify individual fields (indices and tables are identified by an "id"). For this purpose, we have the [rename fields script](./01_server-commands.md#renamefields-script).

### Field-type migration

As a rule, all sensible migrations are supported. However, some migrations require checks and validations, such as migrating a STRING to an ENUM type.

The following are valid without additional changes or caveats:

| Original Field Type | New Field Type |
|---------------------|----------------|
| Integer             | Long           |
| Integer             | Float          |
| Integer             | Double         |
| Integer             | BigDecimal     |
| Short               | Integer        |
| Short               | Long           |
| Short               | Float          |
| Short               | Double         |
| Short               | BigDecimal     |
| Long                | BigDecimal     |
| Float               | Double         |
| Enum                | String         |
| Float               | BigDecimal     |
| Double              | BigDecimal     |
| Date                | DateTime       |
| Long                | Float          |
| Long                | Double         |

### String to Enum Conversion

A common issue with type conversions is a String to Enum conversion where not all the data matches the allowed list of Enum values. Often, this mismatch is just a case of needing to capitalise the non-matching value, or add an underscore, or both. Where this is the case, you can run the `FixEnumValues` script, or add an installHook that calls it for you. See the section in [server commands](./01_server-commands.md#FixEnumValues)).
