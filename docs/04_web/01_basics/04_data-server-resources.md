---
title: 'Data Server resources'
sidebar_label: 'Data Server resources'
id: data-server-resources
keywords: [web, data server, resources, ]
tags:
    - web
    - data server
    - resources
---

The [Data Server](../../../server/data-server/introduction/) is your source of streaming data. It provides a set of queries, each of which serves some or all fields from a specific table or view. These are your resources (along with the resources in the Request Server and the Event Handler). You need to know which queries are available to you, and more importantly, exactly what is available in each query.

## Client-side (runtime) options

In order to receive data from the Data Server query, your front end specifies a datasource configuration, such as a [Grid Pro](../../../web/web-components/grids/grid-pro/grid-pro-connected/), which initiates a subscription and controls the flow of data that is returned by the connection.

These configurations are handled automatically by sending a **DATA_LOGON** message. There are several optional settings that can be sent as part of the DATA_LOGON message:


| Option         | Default   | Description                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| MAX_ROWS       | 250       | Maximum number of rows to be returned as part of the initial message, and as part of any additional [MORE_ROWS](../../../server/integration/rest-endpoints/basics/#more_rows) requests; see below for more information                                                                                                                                                                         |
| MAX_VIEW       | 1000      | Maximum number of rows to track as part of a client view; see below for more information                                                                                                                                                                                                                                                                                                       |
| MOVING_VIEW    | **true**  | Defines the behaviour of the client view when new rows are received in real time. If `MOVING_VIEW` is set to `true`, and `MAX_VIEW` is reached, any new rows arriving to the query will start replacing the oldest rows in the view. This guarantees that only the most recent rows are shown by default                                                                                       |
| CRITERIA_MATCH |           | Clients can send a Groovy expression to perform filters on the query server; these remain active for the life of the subscription. For example: `Expr.dateIsBefore(TRADE_DATE,'20150518')` or `QUANTITY > 10000`                                                                                                                                                                               |
| FIELDS         |           | This optional parameter enables you to select a subset of fields from the query if the client is not interested in receiving all of them. Example: `TRADE_ID QUANTITY PRICE INSTRUMENT_ID`. By default, all fields are returned if this option is not specified                                                                                                                                |
| ORDER_BY       |           | This option can be used to select a [Data Server index](../../../database/data-types/index-entities/) in the Data Server query that is being queried (the index must be defined in the query itself); this is useful if you want the data to be sorted in a specific way. By default, Data Server rows will be returned in the order they were created (from oldest database record to newest) |
| REVERSE        | **false** | This option changes the [Data Server index](../../../database/data-types/index-entities/) iteration. For example, if you are using the default index, the query will return rows from newest database records to oldest                                                                                                                                                                        |

### How MORE_ROWS and MAX_VIEW behave

MAX_ROWS determines how many rows are sent when the front end requests data. It also determines how many rows are sent when the front end makes a [MORE_ROWS request](../../../server/integration/rest-endpoints/basics/#more_rows).

The rows are queried based on the REVERSE setting (which only applies to non-real-time updates). So it is important to note the following behaviour.

For example, when a DATA_LOGON is received with MAX_ROWS set to 500, and REVERSE set to false:

- **If no real-time updates occur on the server**  the initial DATA_LOGON receives all 500 rows in reverse order. If the front end makes another request for MAX_ROWS, it receives another 500 rows in reverse order. From here, the client can make further MORE_ROWS requests until the MAX_VIEW setting is reached.

- **If real-time updates occur on the server** these are sent to the front end regardless of order, and they will count towards the MAX_VIEW.

### MAX_VIEW and MOVING_VIEW
What happens when you reach MAX_VIEW depends on the MOVING_VIEW setting.

- If MOVING_VIEW is set to true, the Data Server discards the oldest rows (by timestamp) and sends newer rows. So if you already have 2000 rows in your view and a new row is inserted, the oldest row in your view will be deleted (the Data Server sends a delete message) and the new row will be sent (the Data Server sends an insert message for that row).

- If MOVING_VIEW is set to false, the Data Server will not send any updates for any new rows whatsoever. Only the rows that are currently in your view will receive updates. In either case, you can only have a total of MAX_VIEW rows in your grid.

This allows for easier implementation of infinite scrolling whilst providing latest and greatest database updates in your view. You just need to send a DATA_LOGON and then continue calling MORE_ROWS to fill the grid as you scroll.

### Receiving specific rows
If you only want receive a limited number of rows, and you only want to receive updates for those rows and nothing else. You have two options. Our scenarios here assume you are interested in receiving only five lines:

- The DATA_LOGON must have MAX_ROWS = 5, MAX_VIEW = 5, and MOVING_VIEW = false. This ensures that you only see those rows and only receive updates for those rows and nothing else.
- If you are interested in a limited number of lines for the purposes of pagination, the DATA_LOGON must have MAX_ROWS = 5 and VIEW_NUMBER = 1. You will receive the first five rows in a pagination mode. If you then send a MORE_ROWS update with VIEW_NUMBER = 2, you will receive an update to delete all your current five rows in your grid and receive the next page of rows (i.e. another 5). These pages will only receive updates for the rows on display, and will respect REVERSE settings.
On successful DATA_LOGON and on any subsequent MORE_ROWS messages, you will receive a field called ROWS_COUNT which contains an estimated number of rows in the server. You can divide this number by your MAX_ROWS setting to know how many pages can be queried on the server.

:::info
Let's summarise all that.
- Normal DATA_LOGONs without MAX_ROWS = MAX_VIEW and MOVING_VIEW false always send new updates to the front end automatically once they occur in the server, regardless of the value of REVERSE.
- If you only want to see a subset of rows, or to use pagination, use either MAX_ROWS = MAX_VIEW and MOVING_VIEW = false.
:::

## Criteria matching

Used to perform filters on the server, you can send a Groovy expression as part of your Data Server request for client-side filtering. Criteria matching supports Groovy expressions and some common expressions. All expressions must return a boolean value (`true` or `false`).
You can mix and match both common expressions and custom groovy expressions using the && (logical AND) and || (logical OR) boolean operators. These are explained in more detail below.

## Common expressions

The platform provides common expressions that are especially helpful for `Date` and `DateTime` client-side filtering. Common expressions are called using the `Expr` binding and take one or two parameters:

- The first parameter is always a query field. In the case of date/datetime, this can either represent the epoch time in milliseconds or a `String` value representing the actual `Date` and `DateTime` in the supported formats.
- The second parameter (if applicable) is a predefined `String` value

## String operations

### containsIgnoreCase(String, String)
This returns `true` when our field contains the string. Casing is ignored.

For example:
`Expr.containsIgnoreCase(EXCHANGE_NAME, 'oves')`

### containsWordsStartingWithIgnoreCase(String, String)
This returns `true` when our field starts with the string. Casing is ignored.

## Date operations

The allowed String formats are:
- DateTime with milliseconds precision: _yyyyMMdd-HH:mm:ss.SSS_
- DateTime with seconds precision: _yyyyMMdd-HH:mm:ss_
- DateTime with minutes precision: _yyyyMMdd-HH:mm_
- DateTime as Date: _yyyyMMdd_

### dateIsBefore(date as DateTime|String|Long, String)
This returns `true` when the date in the given field is before the date specified.

For example:
`Expr.dateIsBefore(TRADE_DATE,'20150518')`

### dateIsAfter(date as DateTime|String|Long, String)
This returns true when the date in the given field is after the date specified.

For example:
`Expr.dateIsAfter(TRADE_DATE,'20150518')`

### dateIsGreaterEqual(date as DateTime|String|Long, String)

This returns `true` when the date in the given field is greater or equal to the date specified.

For example:
`Expr.dateIsGreaterEqual(TRADE_DATE,'20150518')`

### dateIsLessEqual(date as DateTime|String|Long, String)

This returns `true` when the date in the given field is less or equal to the date specified.

For example:
`Expr.dateIsLessEqual(TRADE_DATE,'20150518')`

### dateIsEqual(date as DateTime|String|Long, String)
This returns `true` when the date in the given field is equal to the date specified

For example:
`Expr.dateIsEqual(TRADE_DATE,'20150518')`

### dateIsToday(date as DateTime|String|Long)
This returns `true` when the data in the given field is equal to today's date (using system local time).

For example:
`Expr.dateIsToday(TRADE_DATE)`

## DateTime operations

### dateTimeIsBefore(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is before the datetime specified.

For example:
`Expr.dateTimeIsBefore(TRADE_DATETIME,'20150518-10:50:24')`

### dateTimeIsAfter(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is after the datetime specified.

For example:
`Expr.dateTimeIsAfter(TRADE_DATETIME,'20150518-10:50:24')`

### dateTimeIsGreaterEqual(datetime as DateTime|String|Long, String)

This returns `true` when the datetime in the given field is greater or equal to the datetime specified.

For example:
`Expr.dateTimeIsGreaterEqual(TRADE_DATETIME,'20150518-10:50:24')`

### dateTimeIsLessEqual(datetime as DateTime|String|Long, String)


This returns `true` when the datetime in the given field is less or equal to the datetime specified.

For example:
`Expr.dateTimeIsLessEqual(TRADE_DATETIME,'20150518-10:50:24')`

## Groovy expressions

Groovy expressions provide the most flexibility for client-side filtering. This approach allows you to use complex boolean logic to filter over your fields using Java syntax.

Note - You can not filter over derived fields.

Below are a few examples of valid Groovy expressions.

```
// Quantity is more than 10000
QUANTITY > 10000

// Quantity is more than or equal to 10000
QUANTITY >= 10000

// Quantity is less than 10000
QUANTITY < 10000

// Quantity is less than or equal to 10000
QUANTITY <= 10000

// Quantity is equal to 10000
QUANTITY == 10000

// Quantity is not equal 10000
QUANTITY != 10000
```

You can also join multiple expressions together. These expressions can even be the common expressions mentioned above.

```
// Quantity is more than 100 AND less than 500
QUANTITY > 100 && QUANTITY < 500

// Quantity is less than 100 OR more than or equal to 500
QUANTITY < 100 || QUANTITY >= 500

// Date is today AND QUANTITY is more than 100
Expr.dateIsToday(TRADE_DATE) && QUANTITY > 100
```

### Advanced boolean logic
If you use logical OR in your filter, you lose the ability to use indexing for searches. If you want to use more advanced boolean logic, you can pass brackets to ensure that each part of your filter is checked in line with your business needs.

The following complex example defines:
- If the date is today, the QUANTITY must be over 100
- If the date is 1st of April 2022, the QUANTITY must be between 250 and 350

```
(Expr.dateIsToday(TRADE_DATE) && QUANTITY > 100) || (Expr.dateIsEqual(TRADE_DATE, "20220401") && (QUANTITY > 250 || QUANTITY < 350))
```

In Java's operator precedence, logical AND is evaluated before logical OR. For this reason, we must add `QUANTITY > 250 || QUANTITY < 350` within brackets.
