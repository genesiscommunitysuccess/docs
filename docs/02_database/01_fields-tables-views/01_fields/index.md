---
title: 'Fields - introduction'
sidebar_label: 'Fields - introduction'
id: fields-intro
---

Fields are the individual elements that hold data in your application. This could be a price, for example, an instrument name, an instrument code, or a date. Every basic individual item of data you need has to be defined as a field.  

A single field can be used in multiple tables.

You define your fields in a specific file that has the name _application_**-fields-dictionary.kts**.

Here is a very simple example of such a file, with only three fields defined.

```kotlin
fields {
    field(name = "ORDER_ID", type = STRING)
    field(name = "DESCRIPTION", type = STRING, nullable = true)
    field(name = "PRICE", type = DOUBLE, nullable = false)
}
```



