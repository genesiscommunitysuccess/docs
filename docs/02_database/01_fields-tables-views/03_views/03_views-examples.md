---
title: 'Views - examples'
sidebar_label: 'Views - examples'
id: views-examples
keywords: [database, views, examples]
tags:
    - database
    - views
    - examples
---


Here is an example **view-dictionary.kts** from our tutorial.

The file has two views:

* The first view is called TRADE_VIEW. It joins the TRADE table to the COUNTERPARTY table and to the INSTRUMENT table.
* The second view is called POSITION_VIEW. It joins the POSITION table to the ALT_INSTRUMENT_ID table (this is a backwards join, because it includes real-time price data) and the INSTRUMENT table.

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
        // I: F2*H2
        withInput(TRADE.QUANTITY, TRADE.PRICE) { QUANTITY, PRICE ->
          QUANTITY * PRICE
        }
      }
    }
  }

  view("POSITION_VIEW", POSITION) {

    joins {
      joining(ALT_INSTRUMENT_ID, backwardsJoin = true) {
        on(POSITION.INSTRUMENT_ID to ALT_INSTRUMENT_ID { INSTRUMENT_ID })
          .and(ALT_INSTRUMENT_ID { ALTERNATE_TYPE } to "REFINITIV")

          .joining(INSTRUMENT_L1_PRICE, backwardsJoin = true) {
            on(ALT_INSTRUMENT_ID.INSTRUMENT_CODE to INSTRUMENT_L1_PRICE { INSTRUMENT_CODE })
          }
      }

      joining(INSTRUMENT) {
        on(POSITION.INSTRUMENT_ID to INSTRUMENT { INSTRUMENT_ID })
      }
    }

    fields {
      POSITION.allFields()

      INSTRUMENT.NAME withPrefix INSTRUMENT
      INSTRUMENT.CURRENCY_ID withAlias "CURRENCY"

      derivedField("VALUE", DOUBLE) {
        withInput(
          POSITION.QUANTITY,
          INSTRUMENT_L1_PRICE.EMS_BID_PRICE,
          INSTRUMENT_L1_PRICE.EMS_ASK_PRICE
        ) { quantity, bid, ask ->
          val quant = quantity ?: 0
          //Use BID if positive position, else ask if negative
          val price = when {
              quant > 0 -> bid ?: 0.0
              quant < 0 -> ask ?: 0.0
              else -> 0.0
          }
          price * 1000 * quant
        }
      }

      derivedField("PNL", DOUBLE) {
        withInput(
          POSITION.QUANTITY,
          POSITION.NOTIONAL,
          INSTRUMENT_L1_PRICE.EMS_BID_PRICE,
          INSTRUMENT_L1_PRICE.EMS_ASK_PRICE
        ) { quantity, notional, bid, ask ->
          val quant = quantity ?: 0
          //Use BID if positive position, else ask if negative
          val price = when {
            quant > 0 -> bid ?: 0.0
            quant < 0 -> ask ?: 0.0
            else -> 0.0
          }
          val marketVal = price * 1000 * quant
          marketVal - notional
        }
      }
    }
  }
}

```

