---
title: 'Calculated data using derived fields'
sidebar_label: 'Calculated data using derived fields'
id: calculated-data
---

In certain cases, you might want to display pieces of information that can be derived from the data in hand. To achieve that, you can use [derived fields](/database/fields-tables-views/views/views-advanced/#derived-fields). They are a useful way of providing calculated data and can be added to views. Note that you can only use fields that are in the view to create a derived field.

Let's add a derived field named `CONSIDERATION` that uses the `QUANTITY` and the `PRICE` from the `TRADE` table and returns their product:

```kotlin
derivedField("CONSIDERATION", DOUBLE) {
    withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
        QUANTITY * PRICE
    }
}
```

Add this `derivedField` to your view now. The final view should be like this:

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
            INSTRUMENT.INSTRUMENT_SYMBOL withPrefix INSTRUMENT
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

### Conclusion
We just added a derived field. To see it in action, follow the steps on the next page which will show you how to glue the consolidator and view together.
