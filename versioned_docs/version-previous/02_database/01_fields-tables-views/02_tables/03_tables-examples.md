---
title: 'Tables - examples'
sidebar_label: 'Tables - examples'
id: tables-examples
keywords: [database, tables, examples]
tags:
    - database
    - tables
    - examples
---



Our example below shows an application's **tables-dictionary.kts** file containing two tables. The first contains trades and the second contains simple position information for each instrument.

However, note that the first table has been declared with an audit table, so this creates two tables: one called TRADE and one called TRADE_AUDIT. The schema will actually have three tables:

- TRADE
- TRADE_AUDIT
- POSITION


```kotlin
tables {
  table(name = "TRADE", id = 11000, audit = details(id = 11001, sequence = "TR", tsKey = true)) {
    // Source: Trade
    sequence(TRADE_ID, "TR")
    INSTRUMENT_ID not null
    COUNTERPARTY_ID not null
    QUANTITY not null
    SIDE not null
    PRICE not null
    TRADE_DATETIME
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
      TRADE_ID
    }

    indices {
      nonUnique {
        TRADE_DATETIME
      }
    }
  }

  table(name = "POSITION", id = 11002) {
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
