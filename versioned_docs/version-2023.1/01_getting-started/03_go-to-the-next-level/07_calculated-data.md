---
title: 'Go to the next level - Calculated data using derived fields'
sidebar_label: 'Calculated data using derived fields'
id: calculated-data
keywords: [getting started, quick start, next level, calculated data, derived fields]
tags:
    - getting started
    - quick start
    - next level
    - calculated data
    - derived fields
---

## Section objectives
The goal of this section is to add a derived field to our existing `TRADE_VIEW`.

## Adding a derived field

In certain cases, you might want to display pieces of information that can be derived from the data in hand. To achieve that, you can use [derived fields](../../../database/fields-tables-views/views/views-advanced/#derived-fields). They are a useful way of providing calculated data and can be added to views. Note that you can only use fields that are in the view to create a derived field.

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

            COUNTERPARTY.COUNTERPARTY_NAME withPrefix COUNTERPARTY
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

## Conclusion
We just added a derived field. To see it in action, follow the steps on the next page that will show you how to glue the consolidator and view together.

You can use the [positions app tutorial repo](https://github.com/genesiscommunitysuccess/positions-app-tutorial/tree/Complete_positions_app/server/jvm/positions-app-tutorial-config/src/main/resources/cfg) as a reference point for the view. 

