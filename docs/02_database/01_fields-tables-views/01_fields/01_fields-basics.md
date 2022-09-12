---
title: 'Fields - basics'
sidebar_label: 'Fields - basics'
id: fields-basics
---

[Introduction](/database/fields-tables-views/fields/)  | [Basics](/database/fields-tables-views/fields/fields-basics/) |  [Advanced](/database/fields-tables-views/fields/fields-advanced/) | [Examples](/database/fields-tables-views/fields/fields-examples/) | [Generating DAOs](/database/fields-tables-views/genesisDao/) 

## Field types

The following field types are available:

* STRING
* DATE
* DATETIME
* ENUM
* LONG
* INT
* SHORT
* DOUBLE
* BIGDECIMAL
* NANO_TIMESTAMP
* RAW

You can define each field, supplying a unique `name` and `type`. There are also optional parameters you can specify, such as default value and non-nullable. (Some options are only relevant for certain types.)

For example, here we define two `STRING` fields. (The second is nullable; the first is not nullable):

```kotlin
fields {
    field(name = "ORDER_ID", type = STRING)
    field(name = "DESCRIPTION", type = STRING, nullable = true)
}
```
## Field type parameters

| Parameter | Default value | Sample Usage | Value Type | Description |
|---|---|---|---|---|
| default | null | `field(name = "AGE", type = INT, default=20)` | The same type as the field | Set a default value for the field where not supplied on a database insert. Mandatory for `ENUM` |
| maxSize | 64 (unlimited for non sql DB) | `field(name = "DESCRIPTION", type = STRING, maxSize=1000)` | integer | Set the maxSize of a field. Applicable for `STRING`, `ENUM`, `RAW`. Needed for [HFT](/getting-started/glossary/glossary/#hft) and SQL data structures. See below for more details |
| format | N/A | `field(name = "DESCRIPTION", type = BIG_DECIMALS, format="#,##0.000")` | Dependent on type | Set the maxSize of a field. Applicable for `STRING`, `RAW`  |
| sensitive | false | `field(name = "PASSWORD", type = STRING, sensitive=true)` | boolean | true if the field should be masked on its toString() output  |
| nullable | true | `field(name = "USER_NAME", type = STRING, sensitive=true)` | boolean | true if the field should be masked on its toString() output  |

## Naming fields

As is always the case, it is worth being careful with the names you give fields. It is good practice to use clear descriptive names.

### Duplicate names

If you create a field name that already exists, there are no consequences - as long as the field type is also the same. In effect, the second definition is simply ignored.

However, if you create a field name that matches an existing name and you give it a different field type, this generates a duplication error.

The error is shown when you generate the code.

If the code has already been generated - typically, if you are making changes to an existing server - the error is generated when you run `genesisInstall` after the change.

More specifically, when you build, this generates a duplication warning if the fields are defined in the same way, or an error if they are defined differently. If the duplication is between your own field and one you have inherited from another module, make sure you change the name of your own field, not the one from the other module.

When you define a new field, it is good practice to run `codegen:generateSysDef`. This will generate code based on the fields you have defined, and you will be able to use Intellisense to pick this new field within table definitions.

### Using the maxSize parameter 

When using an SQL database and you want a field's max size to be the same as that supported by the underlying database, you can use the helper function `dbMaxSize()`.

For example, if using Postgres and wanting a `STRING` field's size to be equal to the max size Postgres supports, then you would define the field as:

```kotlin
field(name = "DESCRIPTION", type = STRING, maxSize = dbMaxSize())
```

You can also specify a target `maxSize`. This is useful when you want to limit a field's size to a particular length, but you want to be flexible enough to support different SQL databases.

For example:

```kotlin
field(name = "DESCRIPTION", type = STRING, maxSize = dbMaxSize(target = 9000))
```
If the underlying database is Postgres, this sets the field's `maxSize` to 9000, because Postgres can support up to 65535. But if you are using MS SQL, then the `maxSize` is set to 8000, the maximum supported size for MS SQL.

## Pre-defined fields

By default, you have access to all the standard field definitions in the Genesis low-code platform. You also have access to all the fields in any module that you include in your application (for example, the Auth module comes with a set of pre-defined fields).