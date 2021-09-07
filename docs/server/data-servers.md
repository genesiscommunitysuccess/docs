---
sidebar_label: 'Configure your data servers'
---

# Configure your data servers

Data servers monitor specific tables or views in the database. When a change in data occurs, the data server makes the changed data available to the User Interface.

The data server configuration is refreshingly light, because all the hard work is done by the views.

You need to define queries to handle each event in the required way. You can define any number of queries. A query can be on to an individual table or view. All the details of the table or view are inherited from the definition, so you don’t need to supply any further details.

The initial run of the query serves all the data that is defined by the table or view. From then on, it automatically monitors the user who has requested the data. Whenever a value in the underlying table or view changes, that change is sent to the user. In this way, the user’s data is maintained up to date in real time, without the unnecessary burden of sending the whole data set each time there is a change.

Note that any table or view that you are monitoring might contain a join. By default, the fields that are joined are not monitored for updates - typically these are used for reference data that does not change intraday. If you need these fields to be monitored in real time along with the fields in the primary table, then you need to use a backwards join (see below).

Typically in Genesis, each module has its own data server process, which points at this configuration.

### Where clauses

These are server-side criteria. If you include a **where** clause, the request is only processed if the criteria specified in the clause are met. For example, If you have an application that deals with derivatives that have parent and child trades, you can use a **where** clause to confine the query only to parent trades.

Also you can use these clauses to focus on a specific set of fields or a single field. You can then use Java syntax, such as **contains**, or string/numeric operations.

Finally, note that **where** clauses can also be used for permissioning. If only users with a specific ID are permitted to have access to this data, you could permission them here.

### Backwards joins

As we have seen, each query to a data server creates what is effectively an open connection between each requesting user and the data server. After the initial send of all the data, the data server only sends modifications, deletes and inserts in real time.

However, it is only the primary table or view that is monitored by default. Any tables or views that are joined are not monitored, so changes to these are not sent automatically.

The solution to this is to use a backwards join. Any table or view that specifies this in the join will be monitored in real time, along with the primary table or view. When creating the data handler, you need to include the statement have **backwardsJoin = true**.

There is a cost to this, as it can cause significant extra processing, so do not use backwards joins unless there is a need for the data in question to be updated in real time. Counterparty data, if changed, can wait until overnight, for example. The rule of thumb is that you should only use backwards joins where the underlying data is being updated intraday.

:::danger WIP
* (below material needs to be moved to an advanced features section.)
* (Also needs a clear intro and use case.)
:::

### Ranged Dataserver Queries

It is possible to defined ranged data servers. These data servers only cache a defined ranged of a table or view. This makes the data server more responsive and reducse resource requirements.

Syntax:

```java
// this part is the same as all other dataservers, name is optional
query("TRADE_RANGED_TRADE_RANGE_QTY", TRADE) {
    // the ranged key word makes this a ranged query
    //    the index and the number of key fields needs to be specified
    ranged(Trade.ByQuantity, 1) {
        // optionally refresh keys periodically, for example when we are doing a
        // range on dates
        refresh {
            // either every
            every(2.hours)
            // or at specific time
            at(8.pm)
        }

        // required, starting key
        from {
            Trade.ByQuantity(100)
        }

        // optionally end key
        to {
            Trade.ByQuantity(1000)
        }
    }
}
```

Examples

```java
// all dollar trades:
query("TRADE_RANGED_TRADE_RANGE_USD", TRADE) {
    ranged(Trade.ByCurrencyId, 1) {
        from {
            Trade.ByCurrencyId("USD")
        }
    }
}

// all trades with quantity between 100 and 1,000
query("TRADE_RANGED_TRADE_RANGE_QTY", TRADE) {
    ranged(Trade.ByQuantity, 1) {
        from {
            Trade.ByQuantity(100)
        }
        to {
            Trade.ByQuantity(1000)
        }
    }
}

query("TRADE_RANGED_LAST_2_HOURS", TRADE) {
    ranged(index = Trade.ByTradeDateTimeAndType, numKeyFields = 1) {
        refresh {
            every(15.minutes)
        }
        from {
            Trade.ByTradeDateTime(now().minusHours(2), "")
        }
        to {
            Trade.ByTradeDateTime(now().plusHours(1), "")
        }
    }
}
```

With refresh queries, rows that move out of the filter range will be removed from the cache, while rows that move into the filter will be added.

When using **numKeyFields** that is less than the number of fields in the index, dummy values need to be passed into the index constructor.