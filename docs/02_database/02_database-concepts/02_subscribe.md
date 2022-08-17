---
title: 'Subscribe'
sidebar_label: 'Subscribe'
id: subscribe
---

[Read](/database/database-concepts/read/)  | [Subscribe](/database/database-concepts/subscribe/) |  [Write](/database/database-concepts/write/) 

Subscribe operations enable code to react to database changes, rather than polling for changes. Code can either just listen to changes, or use a combined read/subscribe operation. These mixed read/subscribe operations are useful.

Subscriptions are limited to a single table or view.

Types of change[​](/database/database-concepts/subscribe/#types-of-changesdirect-link-to-heading)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------

There are 3 categories of change:

- Insert - a new row is inserted
- Delete - an existing row is deleted
- Modify - an existing row is changed

When subscribing to a view and/or a range, the change will reflect the change to the subscription -
rather than directly correlate to a database operation. A database insert or delete update will only be published to the subscriber if the insert appears in the range and/or view. 

Similarly, a database modify update might not show at all, or be transformed into an insert or delete update, if it moves into or out of the subscription.

### Backwards joins[​](/database/database-concepts/subscribe/#backward-joinsdirect-link-to-heading)

By default, subscriptions on views will only publish updates on database changes to the root table. However, in view definitions, a join to a child table can be defined as `backwardsJoin = true`. For these joins, the subscription will also publish changes to the child tables as modify updates. Note that this is only supported for combined read/subscribe operations, as the subscription needs to cache the joins. This cache will require extra memory and CPU cycles to maintain.

Subscribing to updates[​](/database/database-concepts/subscribe/#subscribing-to-updatesdirect-link-to-heading)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

When subscribing to updates, there are a number of different parameters:

| Name | Required | Meaning | Default Value |
| --- | --- | --- | --- |
| Table name | ✔️ | The table to subscribe to | n/a |
| fields | ❌ | Only listen to changes on selected fields | listen to all fields |
| delay | ❌ | Group and publish updates every x ms | no grouping |
| subscribeLocally | ❌ | When in a cluster, only listen to local updates | false |

Mixed read/subscribe operations[​](/database/database-concepts/subscribe/#mixed-readsubscribe-operationsdirect-link-to-heading)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Mixed read and subscribe operations are useful in custom components when you need to read a whole or part of a table and need to keep in the loop of changes.

For this purpose, the database exposes two types of operation:

-   `bulkSubscribe` - combines `subscribe` and `getBulk`
-   `rangeSubscribe` - combines `subscribe` and `getRange`

### `bulkSubscribe`[​](/database/database-concepts/subscribe/#bulksubscribedirect-link-to-heading)

`bulkSubscribe` has the following parameters:

| Name | Required | Meaning | Default Value |
| --- | --- | --- | --- |
| Table name | ✔️ | The table to subscribe to | n/a |
| Index name | ❌ | The index to sort the read by | primary key |
| fields | ❌ | Only listen to changes on selected fields | listen to all fields |
| delay | ❌ | Group and publish updates every x ms | no grouping |
| subscribeLocally | ❌ | When in a cluster, only listen to local updates | false |
| backwardsJoin | ❌ | subscribe to changes on child tables | false |

### `rangeSubscribe`[​](/database/database-concepts/subscribe/#rangesubscribedirect-link-to-heading)

`rangeSubscribe` has the following parameters:

| Name | Required | Meaning | Default Value |
| --- | --- | --- | --- |
| Table name | ✔️ | The table to subscribe to | n/a |
| Start index | ✔️ | The index entry to read from | primary key |
| End index | ❌ | The index entry to read to | primary key |
| fields | ❌ | Only listen to changes on selected fields | listen to all fields |
| delay | ❌ | Group and publish updates every x ms | no grouping |
| subscribeLocally | ❌ | When in a cluster, only listen to local updates | false |
| backwardsJoin | ❌ | subscribe to changes on child tables | false |