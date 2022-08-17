---
title: 'Calculated data using Derived fields'
sidebar_label: 'Calculated data using Derived fields'
id: calculated-data
---

Derived fields are a useful way of providing calculated data, but note that you must only use fields that are in the view.

```kotlin
derivedField("CONSIDERATION", DOUBLE) {
    withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
        QUANTITY * PRICE
    }
}
```

Add this derivedField to your view now.​ The final view should be like this.
```kotlin
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
```