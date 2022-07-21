---
title: 'Views - advanced'
sidebar_label: 'Views - advanced'
id: views-advanced
---

[Introduction](/database/fields-tables-views/views/)  | [Basics](/database/fields-tables-views/views/views-basics/) |  [Advanced](/database/fields-tables-views/views/views-advanced/) | [Examples](/database/fields-tables-views/views/views-examples/) 

## Fields

### Derived fields

Derived fields are used to serve up fields that are not part of the tables that make up a given view. Their values are typically derived from fields in the tables.

It is possible to specify field inputs for derived fields as well as being able to specify a single entity as input. This has a number of advantages:

- when a derived field has multiple inputs from a single table, only one input is required
- non-null fields on the entity will be non-null

Syntax:
```kotlin
derivedField("{field name}", FIELD_TYPE) {
    withEntity(TABLE_NAME) { {optional parameter name} ->
        {code}
    }
}
```

With field input:
```kotlin
derivedField("SPREAD", DOUBLE) {
  withInput(INSTRUMENT_PRICE.BID_PRICE, INSTRUMENT_PRICE.ASK_PRICE) { bid, ask ->
    if (ask == null || bid == null) null
      else ask - bid
    }
}
```

With entity input:
```kotlin
derivedField("SPREAD", DOUBLE) {
    withEntity(INSTRUMENT_PRICE) { price ->
        price.askPrice - price.bidPrice
    }
}
```
By default, all fields are populated in the entity. For larger tables, this might have a performance impact if many fields are loaded that are not used in the calculation or the final view. To mitigate this, you can specify to either only load non-null fields, or specify fields to be populated. Non-null fields will always be populated.

Only load non-null fields:

```kotlin
derivedField("SPREAD", DOUBLE) {
    withEntity(INSTRUMENT_PRICE, onlyNonNullFields = true) { price ->
        price.askPrice - price.bidPrice
    }
}
```
Specify list of fields:

```kotlin
derivedField("SPREAD", DOUBLE) {
    withEntity(INSTRUMENT_PRICE, fields = listOf(INSTRUMENT_PRICE.ASK_PRICE, INSTRUMENT_PRICE.BID_PRICE)) { price ->
        price.askPrice - price.bidPrice
    }
}
```

## Joins

### INNER vs OUTER joins

Available join types are INNER and OUTER. If you do not specify the type, it defaults to OUTER.

- `INNER` joins require that all joins match exactly; if one single join fails to match, the row will be discarded.
- `OUTER` joins provide null references for failed joins and will still allow the row to be built.

```kotlin
joining(INSTRUMENT, JoinType.INNER) {
    on(TRADE { INSTRUMENT_ID } to INSTRUMENT { INSTRUMENT_ID })
```

### Dictionary-joined tables
When tables are joined in the dictionary, you are able to join to those tables in views directly, without having to specify the fields on which to join. This does not currently work with aliased tables.

Joining on fields:

```kotlin
joining(TRADE_TO_SIDE) {
    on(TRADE { TRADE_ID } to TRADE_TO_SIDE { TRADE_ID })
```
Joining using join:

```kotlin
joining(TRADE.JOIN_TRADE_TO_SIDE)
```

### Parameterised joins
Some join operations require external parameters that are not available in the context of the table-join definition, but will be available when the view repository is access (e.g. client enriched definitions), so an option exists to create parametrised joins.

These are typically used in Request Server queries:

```kotlin
view("INSTRUMENT_PARAMETERS", INSTRUMENT) {
    joins {
        joining(ALT_INSTRUMENT_ID, JoinType.INNER) {
            on(INSTRUMENT.ID to ALT_INSTRUMENT_ID.INSTRUMENT_ID)
                .and(ALT_INSTRUMENT_ID.ALTERNATE_TYPE.asParameter())
        }
    }
    fields {
        ALT_INSTRUMENT_ID {
            ALTERNATE_CODE withAlias "INSTRUMENT_CODE"
        }
        INSTRUMENT {
            NAME withPrefix INSTRUMENT
        }
    }
}
```

So for the above, if we had a Request Server using the view, it would make `ALTERNATE_TYPE` available as a field input parameter.

### Dynamic joins
These have a shared syntax with derived fields. However, rather than specifying a field name and type, it should always return an entity index type of the table you’re joining on.

:::warning
When using dynamic joins on aliased tables, the alias name should match the alias variable name. E.g.: ```val fixCal = TRADE_CALENDAR withAlias "fixCal"```, here it is ```fixCal``` in both cases.
:::

| Object Type | Name |
| ----------- | ---- |
|Table | TRADE
|Entity | Trade
| Index | TRADE_BY_ID
| Entity Index | Trade.ById

As with derived fields, you can use the `withEntity` and the `withInput` syntax. However, the lambda should always return an entity index object or null. Also, it should always return the same type. It is not possible to switch dynamically between indices, so it should ways return the same type or null. It is possible to add further `and` clauses afterwards.

Syntax:

```kotlin
joining({usual join syntax}) {
   on {  
      // either
      withEntity({table name}) {
        // build index entity here
      }
      // or
      withInput({field 1}, {field 2}, .., {field 9}) { a, b, .. ->
        // build index entity here
      }
   }
}
```
### Examples

#### Example 1
Before:
```kotlin
joining(fix, backwardsJoin = true) {
   on(TRADE_TO_SIDE { FIX_ID } to fix { SIDE_ID })
      .and(fix { SIDE_TYPE } to SideType.FIX)
      .joining(fixCal, JoinType.INNER, backwardsJoin = true) {
        on(fix { CALENDAR_ID } to fixCal { CALENDAR_ID })
      }
```
After:
```kotlin
joining(fix, backwardsJoin = true) {
   on {
      withEntity(TRADE_TO_SIDE) { tradeToSide ->
        TradeSide.BySideId(tradeToSide.fixId)
      }
   }
   .and(fix { SIDE_TYPE } to SideType.FIX)
   .joining(fixCal, JoinType.INNER, backwardsJoin = true)
```

#### Example 2
Before:
```kotlin
joining(fixCal, JoinType.INNER, backwardsJoin = true) {
    on(fix { CALENDAR_ID } to fixCal { CALENDAR_ID })
}
```
After:
```kotlin
.joining(fixCal, JoinType.INNER, backwardsJoin = true) {
   on {
      withInput(fix { CALENDAR_ID }) { calendarId ->
         when (calendarId) {
            null -> null
            else -> TradeCalendar.ByCalendarId(calendarId)
         }
      }
   }
}
```



