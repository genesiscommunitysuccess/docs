---
title: GenesisSet
sidebar_label: GenesisSet
id: genesis-set
sidebar_position: 6

---

Genesis Set is a key/value store that is used to communicate with other Genesis components. Sets can store primitives as well as other sets.
Any request/reply to and from Genesis components is in the form of GenesisSet.

Examples: 

1. GenesisSet to send message to Event handler service using genesisSet method of companion object explained below
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

2. GenesisSet to send message to request reply service using genesisSet method of companion object explained below
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

3. GenesisSet using constructor
```kotlin
val genesisSet = GenesisSet()
genesisSet.setInteger("PRICE", 10)
genesisSet.setString("MESSAGE_TYPE", "EVENT_LOGIN_AUTH")
```

## Constructors

| | |
|---|---|
| GenesisSet | fun GenesisSet(expectedSize: Int = 32) |
| GenesisSet | fun GenesisSet(fields: MutableMap<String, Any?>) |

## Functions

| Name | Signature | Description |
|---|---|---|
| containsField | fun containsField(fieldName: String): Boolean | Checks whether provided field name exists in GenesisSet |
| equals | override fun equals(other: Any?): Boolean | Checks equality of two GenesisSets |
| getArray | open operator override fun equals(other: Any?): Boolean | Get an array value, or default value if property not present. |
| getBigDecimal | fun getBigDecimal(property: String, defaultValue: BigDecimal) | Get a BigDecimal value, or default value if property not present. |
| getBoolean | fun getBoolean(property: String, defaultValue: Boolean) | Get a boolean value, or the 'defaultValue' parameter if field not found. |
| getByteArray | fun getByteArray(property: String): ByteArray? | Get a byte array value (assume a Base64 string if a string is found).  You can use a full stop to denote an embedded Genesis set, or retrieve the set directly. |
| getData | override fun getData(): MutableMap<String, *> | Provides data for reporting service. |
| getDate | fun getDate(key: String, defaultValue: DateTime) | Get a DateTime value, or default value if property not present. |
| getDouble | fun getDouble(property: String, defaultValue: Double) | Get a double value, or default value if property not present. |
| getGenesisSet | fun getGenesisSet(property: String, defaultValue: GenesisSet) | Get a Genesis set, or default value if property not present. |
| getInteger | fun getInteger(property: String, defaultValue: Int) | Get an integer value, or default value if property not present. |
| getLong | fun getLong(property: String, defaultValue: Long) | Get a long value, or default value if property not present. |
| getObject | tailrec fun getObject(property: String, genesisSet: GenesisSet = this): Any? | Recursively get an object. |
| getShort | fun getShort(property: String, defaultValue: Short) | Get a short value, or default value if property not present. |
| getString | fun getString(property: String, defaultValue: String) | Get a string value, or the default value if property not found.  You can use a full stop to denote an embedded Genesis set, or retrieve the set directly. |
| readFrom | fun readFrom(unpacker: MessageUnpacker) | Deserialize object from given unpacker.  Provided for MessagePack. |
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
| writeTo | fun writeTo(pk: MessagePacker) | Serialize object into specified packer.  Provided for MessagePack |

## Companion object

**Functions**

`fun genesisSet(init: GenesisSet.() -> Unit): GenesisSet`

`fun builder(): GenesisSetBuilder`

`fun toStringNanos(timeNs: Long): String`

**Fields**

`val EMPTY_SET = GenesisSet()`