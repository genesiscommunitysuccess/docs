---
title: 'Views - basics'
sidebar_label: 'Views - basics'
id: views-basics
---

[Introduction](/database/fields-tables-views/views/)  | [Basics](/database/fields-tables-views/views/views-basics/) |  [Advanced](/database/fields-tables-views/views/views-advanced/) | [Examples](/database/fields-tables-views/views/views-examples/) 

When you set up a data model, it implies relationships between tables. For example, a TRADE has a COUNTERPARTY_ID and an INSTRUMENT_ID. That means it has a relationship with the COUNTERPARTY and INSTRUMENTS tables.

Views enable you join related tables to create a single holistic view.

They are a lot more powerful than this in practice; they underpin many Genesis components that read data from the database in real time or in static form.

The example below creates a view called `TRADE_VIEW`, which joins the `TRADE` table to the `INSTRUMENT` table.

```kotlin
views {

  view("TRADE_VIEW", TRADE) {

    joins {
      joining(COUNTERPARTY) {
        on(TRADE.COUNTERPARTY_ID to COUNTERPARTY { COUNTERPARTY_ID })
      }
      joining(INSTRUMENT) {
        on(TRADE.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
      }
    }

    fields {
      TRADE.allFields()

      COUNTERPARTY.NAME withPrefix COUNTERPARTY
      INSTRUMENT.NAME withPrefix INSTRUMENT
      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"

      derivedField("CONSIDERATION", DOUBLE) {
        withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
          QUANTITY * PRICE
        }
      }
    }
  }
}
```


Views are made up of joins and fields.

## Joins

Joins enable you to bring other related tables into a view so we can serve up their fields in a single query row.

For example, you might want to join a `TRADE` to an `INSTRUMENT` in order to pull in `INSTRUMENT` fields such as the `NAME` or `CURRENCY` to serve up to a grid.

```kotlin
views {

  view("TRADE_VIEW", TRADE) {

    joins {
      joining(INSTRUMENT) {
        on(TRADE.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
      }
    }

    fields {
      TRADE.allFields()

      INSTRUMENT.NAME withPrefix INSTRUMENT
      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"
    }
  }
}
```

You can define multiple joins onto any given table.

You can also add nested joins (join to a joined table), and so on...

The following example shows three key things:

- It joins the table `POSITION` onto `ALT_INSTRUMENT_ID` on a 2-field key. One of the join values (`ALTERNATE_TYPE`) uses a literal value as opposed to stemming from a field in `POSITION`.

- There is also a nested join, from `ALT_INSTRUMENT_ID` onto `INSTRUMENT_L1_PRICE`.

- Finally, there is a join from `POSITION` onto the `INSTRUMENT` table.

```kotlin

    joins {
      joining(ALT_INSTRUMENT_ID) {
        on(POSITION.INSTRUMENT_ID to ALT_INSTRUMENT_ID { INSTRUMENT_ID })
          .and(ALT_INSTRUMENT_ID { ALTERNATE_TYPE } to "REFINITIV")                            

          .joining(INSTRUMENT_L1_PRICE) {
            on(ALT_INSTRUMENT_ID.INSTRUMENT_CODE to INSTRUMENT_L1_PRICE { INSTRUMENT_CODE }) 
          }
      }

      joining(INSTRUMENT) {
        on(POSITION.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
      }
    }

```

Joins can be one-to-one (key field match) or one-to-many (part-key-field match).

:::warning
Views with one-to-many joins cannot be used with Data Servers.
:::


## Fields

Adding a field is as simple as typing it in the `fields` section of the view.

```kotlin
    fields {
      INSTRUMENT.CURRENCY_ID 
    }
```

You can add all the fields from a given table to a view using the `allFields` accessor.

```kotlin
    fields {
      TRADE.allFields()
    }
```

You can also access derived fields that were defined in the tables dictionary. This is just the same as any other field. For example, if the table TRADE has a derived field called FAVOURITE, you could use it as follows:


```kotlin
    fields {
      TRADE.FAVOURITE
    }
```

### Overriding a field name
You can override the name of a field using various operators:

- `withAlias` - gives the field an alternative name on the view
- `withPrefix` - adds a prefix to the standard field name (handy if you have a clash (e.g. if COUNTERPARTY and INSTRUMENT both have a NAME field)

```kotlin
      COUNTERPARTY.NAME withPrefix COUNTERPARTY
      INSTRUMENT.NAME withPrefix INSTRUMENT
      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"
```

