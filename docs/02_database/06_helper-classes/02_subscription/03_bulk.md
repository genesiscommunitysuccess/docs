---
title: 'Bulk'
sidebar_label: 'Bulk'
id: bulk
---


Bulk objects are published to listeners of mixed read/subscribe operations. Like [Record Update](/database/helper-classes/subscription/record-update/), `Bulk` is a [sealed Kotlin class](https://kotlinlang.org/docs/sealed-classes.html). It has the following class hierarchy:

1.  `Bulk`
    1.  `Bulk.Prime`
        1.  `Bulk.Prime.Record`
        2.  `Bulk.Prime.Complete`
    2.  `Bulk.Update`
        1.  `Bulk.Update.Insert`
        2.  `Bulk.Update.Delete`
        3.  `Bulk.Update.Modify`

A bulk flow always follows this sequence:

1.  0 or more `Bulk.Prime.Record`
2.  1 `Bulk.Prime.Complete`
3.  0 or more `Bulk.Update` subtypes