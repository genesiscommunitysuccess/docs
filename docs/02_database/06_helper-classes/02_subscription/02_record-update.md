---
title: 'Record update'
sidebar_label: 'Record update'
id: record-update
---

## Generic record update


Generic records provide a generic way of publishing updates by the database. All updates have the same super type, `GenericRecordUpdate`, which is a [sealed Kotlin class](https://kotlinlang.org/docs/sealed-classes.html). This means that all instances are guaranteed to be one of the implementation types:

-   `GenericRecordUpdate.Insert`
-   `GenericRecordUpdate.Delete`
-   `GenericRecordUpdate.Modify`

All these types have the following properties:

-   `tableName`: `String`
-   `recordId`: `Long`
-   `timestamp`: `Long`
-   `emitter`: `String?`

Additionally, `GenericRecordUpdate.Insert` and `GenericRecordUpdate.Delete` also have a `record` field. Whereas `GenericRecordUpdate.Modify` has an `oldRecord` and a `newRecord` field.