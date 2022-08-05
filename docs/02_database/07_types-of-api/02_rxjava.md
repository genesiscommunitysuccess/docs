---
title: 'RxJava'
sidebar_label: 'RxJava'
id: rxjava
---

RxJava API
==========

[RxJava](https://www.rxjava.com/) is a java implementation of reactive extensions. The genesis database use this library to represent asynchronous database operations in java.

The RxJava API is the only way of accessing the database in java. For kotlin the [asynch](/database/types-of-api/asynch/) API is preferred, but the RxJava API is also supported.

Subscription[​](/database/types-of-api/rxjava/#subscriptiondirect-link-to-heading)
-------------------------------------------------------------------------------------------------------------------------------------------------

It is important to note that any database operation with RxJava return type is cold until it is subscribed to. This means that the operation is not send to the database until that time.

RxJava return types[​](/database/types-of-api/rxjava/#rxjava-return-typesdirect-link-to-heading)
---------------------------------------------------------------------------------------------------------------------------------------------------------------

The genesis database uses three RxJava return types:

| Return type | minimum returns | maximum returns |
| --- | --- | --- |
| Single | 1 | 1 |
| Maybe | 0 | 1 |
| Flowable | 0 | ∞ |

### Single[​](/database/types-of-api/rxjava/#singledirect-link-to-heading)

In the RxJava API, a `Single` represents an asynchronous operation, that has two possible outcomes:

1.  a success with result
2.  a failure

For example, on the database, `delete` returns a `Single`, with the following possible outcomes:

1.  the record was deleted, it provides a [write result](/database/helper-classes/write-results/overview/)
2.  the operation was not successful, for example the record was not found

### Maybe[​](/database/types-of-api/rxjava/#maybedirect-link-to-heading)

In the RxJava API, a `Maybe` represents an asynchronous operation, that has three possible outcomes:

1.  a success with result
2.  a success with no result
3.  a failure

For example, on the database, `get` returns a `Maybe`, with the following possible outcomes:

1.  a record is found
2.  no record is found
3.  the operation was not successful, for example the index was incorrect

### Flowable[​](/database/types-of-api/rxjava/#flowabledirect-link-to-heading)

In the RxJava API, a `Flowable` represents an asynchronous operation, that has undefined number of outputs.