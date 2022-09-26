---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server/integration/rest-endpoints/introduction/) | [Where to define](/server/integration/rest-endpoints/where-to-define) | [Basics](/server/integration/rest-endpoints/basics/) | [Advanced](/server/integration/rest-endpoints/advanced/) | [Configuring runtime](/server/integration/rest-endpoints/configuring-runtime/) | [Testing](/server/integration/rest-endpoints/testing/)

## Authentication
As mentioned in the introduction, all requests to all Genesis components require you to have done an intial log in and to have retrieved the `SESSION_AUTH_TOKEN`.

### EVENT_LOGIN_AUTH

Log in requests are submitted via POST requests to
`[host]:[genesis_router_port]/event-login-auth`.

Intial login requests require:

* `USER_NAME` and `PASSWORD` keys in the `DETAILS` object
* `SOURCE_REF` header.

Sample request:

```json
POST /event-login-auth HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789041

{
    "DETAILS": {
        "USER_NAME": "JaneDee",
        "PASSWORD": "beONneON*74"
    }
}
```

Sample response:

```json
{
    "MESSAGE_TYPE": "EVENT_LOGIN_AUTH_ACK",
    "SESSION_AUTH_TOKEN": "y9lNIRTax0pmTdUN0XC1PgVl32KuXGsf",
    "REFRESH_AUTH_TOKEN": "FmqF9CGzo2MiujEZoiRUjGXh8ybDC62L",
    "SESSION_ID": "3f0203a5-e89d-4245-9e8b-c21fb0bcacd9",
    "USER_ID": "",
    "DETAILS": {
        "SYSTEM": {
            "DATE": "Sun Jan 21 20:53:44 UTC 2018"
        },
        "HEARTBEAT_INTERVAL_SECS": 30,
        "FAILED_LOGIN_ATTEMPTS": 0,
        "REJECTED_LOGIN_ATTEMPTS": 0,
        "LAST_LOGIN_DATETIME": 1516567765917,
        "PRODUCT": [
            {
                "NAME": "dta",
                "VERSION": "2.2.2"
            },
            {
                "NAME": "auth",
                "VERSION": "1.1.1"
            }
        ]
    },
    "SOURCE_REF": "123456-789041"
}
```

Now that the `SESSION_AUTH_TOKEN` has been returned, you must add it to every future request, except `EVENT_LOGIN_REFRESH` and `EVENT_LOGOUT`: more on that later. 

## Data Server

Data Servers are the most complex of the REST Endpoints provided by the Genesis low-code platform; HTTP requests can only have a single response, but the Data Server enables you to publish a continuous stream of data to a subscribing client.

For all Data Server requests, a `SOURCE_REF` header is mandatory, as it is used to match requests to the correct client subscription. This in turn allows for multiple subscriptions to the same query for the same session (think multiple grids in the UI using the same query with different filters).

There follows a list of Data Server messages mapped to HTTP endpoints.

### DATA_LOGON

To initiate a Data Server query, a DATA_LOGON message is required to create the subscription. This is requested via a POST request to
`[host]:[genesis_router_port]/[data_server_query_name]`.

A body is optional; if provided, it can contain Data Server parameters, such as `MAX_ROWS` and `FIELDS`

The response contains the initial set of data for the subscription. The `ROW_REF` is a unique handle to each row returned and will be present on all QUERY_UPDATE requests where the given row has changed (e.g. modify/delete).

:::note
To avoid memory leaks, the server will timeout subscriptions that have not been active for a period of time (no GET or PUT requests received). At this point, a new subscription can be made via a new DATA_LOGON request
:::

Sample request:

```json
POST /my-trades HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789031
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0

{
  "DETAILS": {
    "MAX_ROWS" : "3",
    "FIELDS": "TRADE_ID CURRENCY FULLY_FILLED PRICE"
  }
}
```

Sample response:

```json
{
    "MESSAGE_TYPE": "QUERY_UPDATE",
    "ROW": [
        {
            "CURRENCY": "FGF",
            "FULLY_FILLED": true,
            "PRICE": 4856734,
            "TRADE_ID": "000000000000109TRLO1",
            "DETAILS": {
                "OPERATION": "INSERT",
                "ROW_REF": 1516923055488004380
            }
        },
        {
            "CURRENCY": "GBX",
            "FULLY_FILLED": false,
            "PRICE": 56548,
            "TRADE_ID": "000000000000108TRLO1",
            "DETAILS": {
                "OPERATION": "INSERT",
                "ROW_REF": 1516923055487676624
            }
        },
        {
            "CURRENCY": "USD",
            "FULLY_FILLED": false,
            "PRICE": 2.33,
            "TRADE_ID": "000000000000107TRLO1",
            "DETAILS": {
                "OPERATION": "INSERT",
                "ROW_REF": 1516923055486415809
            }
        }
    ],
    "SOURCE_REF": "123456-789031"
}
```

### QUERY_UPDATE

To poll for updates to the given subscription to a Data Server query, you need to send a QUERY_UPDATE message. This is requested via a GET request to
`[host]:[genesis_router_port]/[data_server_query_name]`.

The `SOURCE_REF` should match that used in the original DATA_LOGON (subscription).

The response contains the update of data (new/modified/deleted rows since the last update). The `ROW_REF` value is used to reference the given row previously returned. An empty QUERY_UPDATE response means there was no change to the underlying data since the last request.

Sample request:

```json
GET /my-trades HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789031
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
```

Sample response:

```json
{
    "MESSAGE_TYPE": "QUERY_UPDATE",
    "ROW": [
        {
            "DETAILS": {
                "OPERATION": "DELETE",
                "ROW_REF": 1516923055488004380
            }
        },
        {
            "PRICE": 56549
            "DETAILS": {
                "OPERATION": "MODIFY",
                "ROW_REF": 1516923055487676624
            }
        },
        {
            "CURRENCY": "GBP",
            "FULLY_FILLED": false,
            "PRICE": 2.45,
            "TRADE_ID": "000000000000201TRLO1",
            "DETAILS": {
                "OPERATION": "INSERT",
                "ROW_REF": 1516923055486415912
            }
        }
    ],
    "SOURCE_REF": "123456-789031"
}
```

### CHANGE_COLUMNS

It is possible to change the columns supplied on updates to the given subscription to a Data Server query.

This is requested via a PUT request to
`[host]:[genesis_router_port]/[data_server_query_name]`.

This particular message is slightly different from other Data Server messages; specifically, the `SOURCE_REF` should be unique. A `SUBSCRIPTION_REF` is also needed and must match that `SOURCE_REF` value used in the original DATA_LOGON (subscription). The reason for the change in this message is that the response is a simple ACK/NACK, and the client should use this to know if it was successful or not. If an ACK is received, a further GET for the original `SOURCE_REF` (this request's `SUBSCRIPTION_REF`) will provide the added columns for each row the client has received, but nothing regarding the deleted columns. So the ACK is a means of telling the client it is OK to remove the deleted columns from the UI.

The body of this request should contain a `DETAILS` object with `ADD_COLUMNS` (further replies should include these columns) and/or `DROP_COLUMNS` (further replies should not include these columns)

Sample request:

```json
PUT /my-trades HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789032
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
SUBSCRIPTION_REF: 123456-789031

{
  "DETAILS": {
    "ADD_COLUMNS": "BROKER_ID INSTRUMENT_ID", 
    "DROP_COLUMNS": "FULLY_FILLED"
  }
}
```

Sample response:

```json
{
    "MESSAGE_TYPE": "MORE_COLUMNS_ACK",
    "SOURCE_REF": "123456-789032"
}
```

### MORE_ROWS

PUT requests can also be used to request MORE_ROWS. This is when the client has specified a `MAX_ROWS` and received that many rows, but would like to get more. This is handy for pagination implementations.

This is requested via a PUT request to
`[host]:[genesis_router_port]/[data_server_query_name]`.

The body of this request should contain a `MESSAGE_TYPE` element with the value MORE_ROWS.

The reply will be a simple ACK/NACK. Assuming an ACK, the next QUERY_UPDATE request will include the additional rows.

Sample request:

```json
PUT /my-trades HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789031
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0

{
    "MESSAGE_TYPE": "MORE_ROWS"
}
```

Sample response:

```json
{
    "MESSAGE_TYPE": "MORE_ROWS_ACK",
    "SOURCE_REF": "123456-789031"
}
```

### DATA_LOGOFF

A DELETE request is made to log off and end the subscription for the given `SOURCE_REF`.

This is requested via a DELETE request to
`[host]:[genesis_router_port]/[data_server_query_name]`.

The `SOURCE_REF` should match that used in the original DATA_LOGON (subscription).

No body is required for DATA_LOGOFF.

Sample request:

```json
DELETE /my-trades HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789031
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
```

Sample response:

```json
{
    "MESSAGE_TYPE": "DATA_LOGOFF",
    "SOURCE_REF": "123456-789031"
}
```


## Request Server

Request Servers are accessed via GET requests to
`[host]:[genesis_router_port]/[request_reply_name]`.

Any request parameters should be prefixed with `request.`. E.g. `request.[request_parameter]=[value]`. For example `localhost:9064/req-counterparty-details?request.[request_parameter]=[value]&request.[request_parameter]=[value]`.

Parameter values can be wild-carded (`*`, `A*`, `_A`, `_A*`, etc.) or left blank (and assumed to be `*`).

Request Server requests require:

* `SOURCE_REF` header (a unique value should be supplied on every request with a unique value)
* `SESSION_AUTH_TOKEN` header
* A request body as per your event handler in side the `DETAILS` object.

Sample request:

```json
GET /req-counterparty-details?request.CPTY_TYPE=MARKET&request.CPTY_REGION=US HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
SOURCE_REF: 123456-789021
```

Sample response:

```json
{
    "MESSAGE_TYPE": "REP_COUNTERPARTY_DETAILS",
    "SOURCE_REF": "123456-789021",
    "REPLY": [
        {
            "CPTY_NAME": "ROAD_RUNNER_FUNDS"
        },
        {
            "CPTY_NAME": "COYOTE_BROKERING"
        }
    ]
}
```

## Event Handler
Events are submitted via POST requests to
`[host]:[genesis_router_port]/event_[<event_name>]`.

All resource paths should be prefixed with `event_`. For example `localhost:9064/event_order_insert`. In this example `order_insert` is our custom event route and `event_` is the prefix.

Event Handler requests require:

* `SOURCE_REF` header (a unique value should be supplied on every request with a unique value)
* `SESSION_AUTH_TOKEN` header
* A request body as per your event handler in side the `DETAILS` object.

Sample request:

```json
POST /event-order-insert HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
SOURCE_REF: 123456-789011

{ 
    "DETAILS": { 
        "INSTRUMENT_CODE":"VOD",
        "QUANTITY":"100",
        "PRICE":"225"
    }
}
```

Sample response:

```json
{
    "MESSAGE_TYPE": "EVENT_ACK",
    "SOURCE_REF": "123456-789011"
}
```
