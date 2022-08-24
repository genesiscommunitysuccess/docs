---
title: 'WriteResult'
sidebar_label: 'WriteResult'
id: write-result
---

## Entity write result

The entity database will return type-safe results for write operations. There are four main write results, one for each type of write operation. Each of these operations are of type `EntityWriteResult`.

In all cases, the records in the result will be a generated entity that matches the input. So, for inserting a `Trade` instance, the database will return a result of type `InsertResult<Trade>` where the property `record` will be of type `Trade`.

-   `InsertResult`
-   `DeleteResult`
-   `ModifyResult`
-   `UpsertResult`; either a `InsertResult` or a `ModifyResult`

### InsertResult

The `InsertResult` has a single property `record` which is the inserted record. This includes any generated values.

### DeleteResult

The `DeleteResult` has a single property `record` which is the record as it was in the database before it was deleted.

### ModifyResult

The `ModifyResult` is slightly more complex. It has three properties:

-   a `record` property, which is the record in the database after the modify operation
-   a `previous` property, which is the record as it was *before* the modify operation
-   a `modifiedFields` property, which holds a `Set<String>` of the fields that were changed in the modify

### UpsertResult

This could be either an `InsertResult` or a `ModifyResult`.

## Write result

A single catch-all type for results of a write operation when using generated repositories or RxDb.

This type has the following fields:

- `savedRecords` - the saved records
- `removedRecords` - the deleted records
- `modifiedFields` - the updated fields
- `numRecordsDeleted` - the number of records deleted
- `isError` - there was an error during the database operation. Needs to be checked when `ValidationMode.LEGACY` is used
- `errorText` - the error description. Needs to be checked when `ValidationMode.LEGACY` is used

:::warning

Using `RxDb` instead of [entityDb](/database/database-interface/entity-db/) or [generated repositories](/database/database-interface/generated-repositories/) will circumvent compile-time validation of database interactions. This means that errors might not appear until runtime or might lead to unexpected results.

:::