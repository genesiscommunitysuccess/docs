---
title: 'Data model - Inside a fields dictionary'
sidebar_label: 'Inside a fields dictionary'
id: inside-a-fields-dictionary
keywords: [getting started, basics, data, model, fields dictionary]
tags:
    - getting started
    - basics
    - data model
    - fields dictionary
---

The fields dictionary is where you specify all the fields you need for your data model.

This is all contained in a single Kotlin script file. If your application is called bravo, then the file would be called **bravo-fields-dictionary.kts**.

Within the file, you simply need to specify all the fields that you need - name and type. Here is a short and very simple example:

```kotlin
fields {
    field(name = "ORDER_ID", type = STRING)
    field(name = "DESCRIPTION", type = STRING, nullable = true)
    field(name = "PRICE", type = DOUBLE, nullable = false)
}
```
OK, you have probably spotted that two of the fields here also have specifications for `nullable`. There are other options that can be specified, but you already know the key information on this.

One more useful item here is that there is a useful Gradle menu on the right of your IntelliJ screen. After you have finished defining all your fields, you can run the following script:

`genesis-generated-fields`

This creates database objects, so that all the fields are available for text completion when you define your tables and views.
