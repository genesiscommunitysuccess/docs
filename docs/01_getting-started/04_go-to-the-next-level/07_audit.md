---
title: 'Track the data changes using Auditable Tables'
sidebar_label: 'Track the data changes using Auditable Tables'
id: audit
---

The first step to add basic auditing is to change the relevant table dictionary. In this instance, we will be making changes to the **alpha-tables-dictionary.kts**, in order to add the parameter `audit = details()` to the table definition. It should resemble the following:

```kotlin {1}
table (name = "TRADE", id = 2000, audit = details(id = 2100, sequence = "TR")) {
    sequence(TRADE_ID, "TR")
    COUNTERPARTY_ID 
    INSTRUMENT_ID 
    QUANTITY
    PRICE
    SYMBOL
    DIRECTION
    SIDE
    TRADE_DATE
    ENTERED_BY
    TRADE_STATUS

    primaryKey {
        TRADE_ID
    }
}
```

The id parameter indicates the id of the newly created audit table, and will need to be different from any other table id.

As we are using the GPAL event handlers, this is sufficient to enable auditing on this table. A new table is created by the name of the original table, with the **_AUDIT** suffix added to the end. In this instance that would be the **TRADE_AUDIT** table.