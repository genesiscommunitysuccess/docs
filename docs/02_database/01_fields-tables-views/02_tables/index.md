---
title: 'Tables - introduction'
sidebar_label: 'Tables - introduction'
id: tables-intro
---

Tables are used to store the underlying data in your application. A table is made up of [fields](/database/fields-tables-views/fields). For example:

- Your application might want to display a grid of trades. For those trades, you will want to see the instruments traded, the trade price and the quantity. That means you want a table, probably called TRADES, with three fields (and almost certainly other fields, as well).
- Your users might want to select a counterparty from a dropdown list. So, you would have a table of counterparties; this could include your internal ID for the counterparty, the counterparty short name and the counterparty's full business name. Again, it's easy to see what you would call your table and what fields you would include in it.

So, really, a table is just a useful grouping of fields: users, trades, orders or even types of citrus fruit (you never know).

Finally (for now), note that every table must have a `primaryKey`; this tells the underlying database how to index the table's data.

Here below is a very simple file containing one table and three fields. You can see that one of these fields has been specified as the primary key.

```kotlin
tables {

  table( name= "POSITION", id = 11002) {
    sequence(POSITION_ID, "PS")
    INSTRUMENT_ID
    QUANTITY
    NOTIONAL

    primaryKey {
     POSITION_ID
    }
  }

}
```

Tables are defined in the file _application-name_**-tables-dictionary.kts**. 

So, if your application is called **heracleum**, the file name will be **heracleum-tables-dictionary.kts**.

