---
sidebar_position: 2
title: Generic Record Update 
sidebar_label: Record Update
id: record-update

---

Generic record provide a generic way of publishing updates by the database. All updates have the same super type 
`GenericRecordUpdate`, which is a [sealed kotlin class](https://kotlinlang.org/docs/sealed-classes.html). This means
that all instances are guaranteed to be one of the implementation types:

* `GenericRecordUpdate.Insert`
* `GenericRecordUpdate.Delete`
* `GenericRecordUpdate.Modify`

Each one of these has the following properties:

* `tableName`: `String`
* `recordId`: `Long`
* `timestamp`: `Long`
* `emitter`: `String?`

Additionally, `GenericRecordUpdate.Insert` and `GenericRecordUpdate.Delete` also have a `record` field. Whereas
`GenericRecordUpdate.Modify` has an `oldRecord` and a `newRecord` field. 

