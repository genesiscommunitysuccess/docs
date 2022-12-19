---
title: 'Types of API - RxJava API'
sidebar_label: 'RxJava'
id: rxjava
keywords: [database, types of api, api, types, rxjava]
tags:
    - database
    - types of api
    - api
    - types
    - rxjava
---

[Async](../../../database/types-of-api/async/) |
[RxJava](../../../database/types-of-api/rxjava/) 

[RxJava](https://www.rxjava.com/) is a Java implementation of reactive extensions. The Genesis database uses this library to represent asynchronous database operations in java.

If you are using Java. RxJava API is the only way of accessing the database. For Kotlin, the [async](../../../database/types-of-api/async/) API is preferred (although the RxJava API is also supported).

Subscription[​](../../../database/types-of-api/rxjava/#subscriptiondirect-link-to-heading)
-------------------------------------------------------------------------------------------------------------------------------------------------

It is important to note that any database operation with RxJava return type is cold until it is subscribed to. This means that the operation is not sent to the database until that time.

RxJava return types[​](../../../database/types-of-api/rxjava/#rxjava-return-typesdirect-link-to-heading)
---------------------------------------------------------------------------------------------------------------------------------------------------------------

The Genesis database uses three RxJava return types:

| Return type | minimum returns | maximum returns |
| --- | --- | --- |
| Single | 1 | 1 |
| Maybe | 0 | 1 |
| Flowable | 0 | ∞ |

### Single[​](../../../database/types-of-api/rxjava/#singledirect-link-to-heading)

In the RxJava API, a `Single` represents an asynchronous operation that has two possible outcomes:

- a success with result, or
- a failure

For example, on the database, `delete` returns a `Single`, with the following possible outcomes:

- the record was deleted; it provides a [write result](../../../database/helper-classes/write-result/)
- the operation was not successful; for example, the record was not found

### Maybe[​](../../../database/types-of-api/rxjava/#maybedirect-link-to-heading)

In the RxJava API, a `Maybe` represents an asynchronous operation that has three possible outcomes:

- a success with result
- a success with no result
- a failure

For example, on the database, `get` returns a `Maybe`, with the following possible outcomes:

- a record is found
- no record is found
- the operation was not successful, for example the index was incorrect

### Flowable[​](../../../database/types-of-api/rxjava/#flowabledirect-link-to-heading)

In the RxJava API, a `Flowable` represents an asynchronous operation that has an undefined number of outputs.