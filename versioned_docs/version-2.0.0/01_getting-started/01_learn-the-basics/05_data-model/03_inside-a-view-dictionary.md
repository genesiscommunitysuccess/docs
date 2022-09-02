---
title: 'Inside a view dictionary'
sidebar_label: 'Inside a view dictionary'
id: inside-a-view-dictionary
---

Whereas tables tend to be groups of related information, a view is a way of looking at data - in many cases, literally. If you want to show all the trades you have done, then you might want to take some of that data from a table of trades, but you might want to add data from one or more other tables - currency details or counterparty IDs, for example.

So, a view is a way of joining tables to form a useful way of displaying data.

The view dictionary is where you specify all the views you need for your data model.

These are all contained in a single Kotlin script file. If your application is called bravo, then the file would be called **bravo-view-dictionary.kts**.

Within the file, you specify the details of each view that you need.  

Here is an example **view-dictionary.kts** file. It has one view, called TRADE_VIEW. This joins the TRADE table (the root table) to the COUNTERPARTY table and to the INSTRUMENT table.

After the joins, we specify the fields that are required:

- from the TRADE table, we include all the fields
- from the COUNTERPARTY table, we are taking the NAME field and we are adding a prefix to make COUNTERPARTY_NAME
- from the INSTRUMENT table, we are taking the NAME FIELD and we are adding a prefix to make INSTRUMENT_NAME
- also from the INSTRUMENT table, we are taking the CURRENCY_ID and we are giving it the alias CURRENCY
- finally, there is a derived field (these are useful for providing calculated values based on other fields in the view); it is called CONSIDERATION, and it simply contains the result of the QUANTITY x PRICE


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
OK, we looked at a bit more detail there. We hope you are happy with that.

