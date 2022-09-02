---
title: 'ModifyDetails'
sidebar_label: 'ModifyDetails'
id: modify-details
---

## Entity Modify details

When performing modify and upsert operations with EntityDb, you must specify the index of the record you wish to perform the operation to. The `EntityModifyDetails` class enables you to identify the record and the fields to modify.

## Modify details

Similarly to the `EntityModifyDetails`, `ModifyDetails` does the same job and takes similar arguments for use with RxDb.

:::warning

Using `RxDb` instead of [entityDb](/database/database-interface/entity-db/) or [generated repositories](/database/database-interface/generated-repositories/) will circumvent compile-time validation of database interactions. This means that errors might not appear until runtime or might lead to unexpected results.

:::
