---
title: 'Inter-process messages - GenesisSet'
sidebar_label: 'GenesisSet'
id: genesisSet
keywords: [server, inter-process messages, genesisSet]
tags:
  - server
  - inter-process messages
  - genesisSet
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`GenesisSet` is a generic message format used to send data between Genesis processes. The information in the messages must be stored as key-value pairs. A GenesisSet can store integers, booleans, text, etc. Importantly, it can also contain other GenesisSets.

In this section, we give you some examples that illustrate usage and structure.

## Send message to Event Handler service

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
genesisSet {
    MESSAGE_TYPE with "EVENT_LOGIN_AUTH"
    SERVICE_NAME with "GENESIS_AUTH_MANAGER"
    SOURCE_REF with "sourceRef"
    DETAILS with genesisSet {
        USER_NAME with "User"
        PASSWORD with "Password"
    }
}
```

</TabItem>
<TabItem value="java">

```java
GenesisSet.builder()
    .setString(MESSAGE_TYPE, "EVENT_LOGIN_AUTH")
    .setString(SERVICE_NAME, "GENESIS_AUTH_MANAGER")
    .setString(SOURCE_REF, "sourceRef")
    .setGenesisSet("DETAILS", GenesisSet.builder()
            .setString("USER_NAME", "User")
            .setString("PASSWORD", "Password")
            .build()
    ).build();
```

</TabItem>
</Tabs>

## Send message to Request Server

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
genesisSet {
    MESSAGE_TYPE with "REQ_INSTRUMENT"
    SERVICE_NAME with "GCOM_REQUEST_SERVER"
    SOURCE_REF with "sourceRef"
    REQUEST with genesisSet {
        "INSTRUMENT_ID" with "*"
    }
}
```

</TabItem>
<TabItem value="java">

```java
GenesisSet.builder()
    .setString(MESSAGE_TYPE, "REQ_INSTRUMENT")
    .setString(SERVICE_NAME, "GCOM_REQUEST_SERVER")
    .setString(SOURCE_REF, "sourceRef")
    .setGenesisSet("REQUEST", GenesisSet.builder()
            .setString("INSTRUMENT_ID", "*")
            .build()
    ).build();
```

</TabItem>
</Tabs>

## Using constructor

<Tabs defaultValue="kotlin" values={[{ label: 'Kotlin', value: 'kotlin', }, { label: 'Java', value: 'java', }]}>
<TabItem value="kotlin">

```kotlin
val genesisSet = GenesisSet()
genesisSet.setInteger("PRICE", 10)
genesisSet.setString("MESSAGE_TYPE", "EVENT_LOGIN_AUTH")
```

</TabItem>
<TabItem value="java">

```java
GenesisSet genesisSet = new GenesisSet();
genesisSet.setInteger("PRICE", 10)
genesisSet.setString("MESSAGE_TYPE", "EVENT_LOGIN_AUTH")
```

</TabItem>
</Tabs>

## Constructors

| Signature | Description |
|---|---|
GenesisSet(expectedSize: Int = 32) | Creates a GenesisSet object with a predetermined expected number of key-value pairs.
GenesisSet(fields: MutableMap<String, Any?>) | Creates a GenesisSet object using an already existing `Map` object containing key-value pairs.

## Functions

| Name | Signature | Description |
|---|---|---|
| containsField | fun containsField(fieldName: String): Boolean | Checks whether provided field name exists in GenesisSet |
| equals | override fun equals(other: Any?): Boolean | Checks equality of two GenesisSets |
| getArray | open operator override fun equals(other: Any?): Boolean | Get an array value, or default value if property not present. |
| getBigDecimal | fun getBigDecimal(property: String, defaultValue: BigDecimal) | Get a BigDecimal value, or default value if property not present. |
| getBoolean | fun getBoolean(property: String, defaultValue: Boolean) | Get a boolean value, or the 'defaultValue' parameter if field not found. |
| getByteArray | fun getByteArray(property: String): ByteArray? | Get a byte array value (assume a Base64 string if a string is found).  You can use a full stop to denote an embedded Genesis set, or retrieve the set directly. |
| getDate | fun getDate(key: String, defaultValue: DateTime) | Get a DateTime value, or default value if property not present. |
| getDouble | fun getDouble(property: String, defaultValue: Double) | Get a double value, or default value if property not present. |
| getGenesisSet | fun getGenesisSet(property: String, defaultValue: GenesisSet) | Get a Genesis set, or default value if property not present. |
| getInteger | fun getInteger(property: String, defaultValue: Int) | Get an integer value, or default value if property not present. |
| getLong | fun getLong(property: String, defaultValue: Long) | Get a long value, or default value if property not present. |
| getObject | tailrec fun getObject(property: String, genesisSet: GenesisSet = this): Any? | Recursively get an object. |
| getShort | fun getShort(property: String, defaultValue: Short) | Get a short value, or default value if property not present. |
| getString | fun getString(property: String, defaultValue: String) | Get a string value, or the default value if property not found.  You can use a full stop to denote an embedded Genesis set, or retrieve the set directly. |
| setArray | fun setArray(key: String, value: Any?) | Set an array value.  Method can be called repeatedly with the same key to build up a list of values. |
| setBigDecimal | fun setBigDecimal(key: String, value: BigDecimal?) | Set BigDecimal value.  If the value exists in the set it is overwritten. |
| setBoolean | fun setBoolean(key: String, value: Boolean?) | Set integer value.  If the value exists in the set it is overwritten. |
| setByteArray | fun setByteArray(key: String, value: ByteArray?) | Set byte array value.  If the value exists in the set it is overwritten. |
| setDate | fun setDate(key: String, date: DateTime?) | Set date value.  If the value exists in the set it is overwritten. |
| setDirect | fun setDirect(property: String, value: Any?) | Shorthand method to set a field that may be multiple sets deep. |
| setDirectNull | fun setDirectNull(property: String, value: Any?, defaultValue: Any) | Shorthand method to set a field that may be multiple sets deep, and accepts a default value for null parameters. |
| setDouble | fun setDouble(key: String, value: Double?) | Set integer value.  If the value exists in the set it is overwritten. |
| setFullArray | fun setFullArray(key: String, array: Iterable<*>) | Set a full list of values. |
| setGenesisSet | setGenesisSet(key: String, set: GenesisSet?) | Embed a set inside this set.  If the value exists in the set it is overwritten. |
| setInteger | fun setInteger(key: String, value: Int?) | Set integer value.  If the value exists in the set it is overwritten. |
| setLong | fun setLong(key: String, value: Long?) | Set long value.  If the value exists in the set it is overwritten. |
| setString | fun setString(key: String, value: String? | Set string value.  If the value exists in the set it is overwritten. |
| toString | override fun toString(): String | Returns a pretty-print string. |
| unSet | fun unSet(field: String) | Shorthand method to unset a single field. |
| unSetDirect | tailrec fun unSetDirect(property: String, genesisSet: GenesisSet = this) | Shorthand method to unset a field that may be multiple sets deep |
| unSetGenesisSet | fun unSetGenesisSet(key: String) | Shorthand method to unset a GenesisSet. |
| with | infix fun String.with(any: Any?) | Sets key-value in GenesisSet Ex: MESSAGE_TYPE with EVENT_INSERT |

## Companion object

**Functions**

`fun genesisSet(init: GenesisSet.() -> Unit): GenesisSet` : This function enables the Kotlin DSL builder used in these [examples](#send-message-to-event-handler-service).

`fun builder(): GenesisSetBuilder` : This method is commonly used as an alternative to the Kotlin DSL builder when creating GenesisSet objects in Java. GenesisSetBuilder allows you to create new instances of GenesisSet in a fluent way, as shown in the above [examples](#send-message-to-event-handler-service).
