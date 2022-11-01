---
title: 'Database concepts - Subscribe'
sidebar_label: 'Subscribe'
id: subscribe
keywords: [database, concepts, subscribe]
tags:
    - database
    - concepts
    - subscribe
---



Subscribe operations enable code to react to database changes, rather than [polling](/getting-started/glossary/glossary/#polling) for changes. Code can either listen to changes, or use a combined read/subscribe operation. These mixed read/subscribe operations are useful.

Subscriptions are limited to a single table or view.

## Types of change

A subscribe operation can make three different types of change:

- Insert - a new row is inserted
- Delete - an existing row is deleted
- Modify - an existing row is changed

When subscribing to a view and/or a range, the change will reflect the change to the subscription - rather than directly correlate to a database operation. A database insert or delete update will only be published to the subscriber if the insert appears in the range and/or view. 

Similarly, a database modify update might not show at all, or be transformed into an insert or delete update, if it moves into or out of the subscription.

### Backwards joins

By default, subscriptions on views only publish updates on database changes to the root table. 

If you want to subscribe to changes to sub tables you need to enable [backwards joins](/server/data-server/basics/#backwards-joins) in your view definition: `backwardsJoin = true`. Once specified, the subscription will also publish changes to the sub tables as modify updates. Please click the link for a useful example of a backwards join in the [views examples](/database/fields-tables-views/views/views-examples).

:::note

Backwards join subscriptions are only supported for combined read/subscribe operations, as the subscription needs to cache the joins. This cache requires extra memory and CPU cycles to be maintained.

:::

## Subscribing to updates

When subscribing to updates, there are a number of different parameters:

| Name | Required | Meaning | Default Value |
| --- | --- | --- | --- |
| Table name | ✔️ | The table to subscribe to | n/a |
| fields | ❌ | Only listen to changes on selected fields | listen to all fields |
| delay | ❌ | Group and publish updates every x ms | no grouping |
| subscribeLocally | ❌ | When in a cluster, only listen to local updates | false |

## Mixed read/subscribe operations

Mixed read and subscribe operations are useful in custom components when you need to read a whole or part of a table and need to keep in the loop of changes.

For this purpose, the database exposes two types of operation:

-   `bulkSubscribe` - combines `subscribe` and `getBulk`
-   `rangeSubscribe` - combines `subscribe` and `getRange`

### `bulkSubscribe`

`bulkSubscribe` has the following parameters:

| Name | Required | Meaning | Default Value |
| --- | --- | --- | --- |
| Table name | ✔️ | The table to subscribe to | n/a |
| Index name | ❌ | The index to sort the read by | primary key |
| fields | ❌ | Only listen to changes on selected fields | listen to all fields |
| delay | ❌ | Group and publish updates every x ms | no grouping |
| subscribeLocally | ❌ | When in a cluster, only listen to local updates | false |
| backwardsJoin | ❌ | subscribe to changes on sub tables | false |

### `rangeSubscribe`

`rangeSubscribe` has the following parameters:

| Name | Required | Meaning | Default Value |
| --- | --- | --- | --- |
| Table name | ✔️ | The table to subscribe to | n/a |
| Start index | ✔️ | The index entry to read from | primary key |
| End index | ❌ | The index entry to read to | primary key |
| fields | ❌ | Only listen to changes on selected fields | listen to all fields |
| delay | ❌ | Group and publish updates every x ms | no grouping |
| subscribeLocally | ❌ | When in a cluster, only listen to local updates | false |
| backwardsJoin | ❌ | subscribe to changes on sub tables | false |
