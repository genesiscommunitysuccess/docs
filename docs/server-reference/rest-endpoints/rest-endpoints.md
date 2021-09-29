---
id: rest-endpoints
title: REST Endpoints
sidebar_label: REST Endpoints
sidebar_position: 1

---
The Genesis Platform automatically exposes all configured resources as HTTP endpoints via the GENESIS_ROUTER service.

All requests and responses that contain a body are represented in JSON format.

There is a switch in GENESIS_ROUTER that enables you to set whether authentication is required or not.

All requests require a valid `SESSION_AUTH_TOKEN` HTTP header. A `SESSION_AUTH_TOKEN` is retrieved after successful user Authentication.

Here, we provide a list of the endpoints for each resource.

## Event handler
Events are submitted via a POST request to
`[host]:[genesis_router_port]/[event_name]`


Event fields are represented as JSON properties in a `DETAILS` object.

A unique `SOURCE_REF` header should be supplied on every request with a unique value and will be supplied back on the relative response.

Sample request:

```json
POST /event-order-insert HTTP/1.1
Host: myhost.acme.com:9064
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

## Request server

Request Servers are accessed via a GET request to
`[host]:[genesis_router_port]/[request_reply_name]`.

Any request parameters should be set as URL parameters prefixed by `REQUEST`. E.g. `REQUEST.[request_parameter]=[value]`.

Parameter values can be wild-carded (`*`, `A*`, `_A`, `_A*`, etc.) or left blank (and assumed to be `*`).

A unique `SOURCE_REF` header should be supplied on every request with a unique value and will be supplied back on the relative response.

Sample request:

```json
GET /req-counterparty-details HTTP/1.1?REQUEST.CPTY_TYPE=MARKET&REQUEST.CPTY_REGION=US
Host: myhost.acme.com:9064
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

## Data server

Data servers are slightly more complex; HTTP requests can only have a single response, but the data server enables you to publish a continuous stream of data to a subscribing client.

For all data server requests, a `SOURCE_REF` header is mandatory, as it is used to match requests to the correct client subscription. This in turn allows for multiple subscriptions to the same query for the same session (think multiple grids in the UI using the same query with different filters).

Following is a list of data server messages mapped to HTTP endpoints.

### DATA_LOGON

To initiate a data server query, a DATA_LOGON message is required to create the subscription. This is requested via a POST request to 
`[host]:[genesis_router_port]/[data_server_query_name]`.

A body is optional; if provided, it can contain data server parameters, such as `MAX_ROWS` and `FIELDS`

The response contains the initial set of data for the subscription. The `ROW_REF` is a unique handle to each row returned and will be present on all QUERY_UPDATE requests where the given row has changed (e.g. modify/delete).

:::note
To avoid memory leaks, the server will timeout subscriptions that have not been active for a period of time (no GET or PUT requests received). At this point, a new subscription can be made via a new DATA_LOGON request
:::

Sample request:

```json
POST /my-trades HTTP/1.1
Host: myhost.acme.com:9064
Content-Type: application/json
SOURCE_REF: 123456-789031
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0

{
  "DETAILS": {
    "MAX_ROWS" : "5",
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
        },
        {
            "CURRENCY": "GBX",
            "FULLY_FILLED": false,
            "PRICE": 230.79,
            "TRADE_ID": "000000000000008TRLO1",
            "DETAILS": {
                "OPERATION": "INSERT",
                "ROW_REF": 1516923055486007935
            }
        },
        {
            "CURRENCY": "EUR",
            "FULLY_FILLED": true,
            "PRICE": 92.64,
            "TRADE_ID": "000000000000009TRLO1",
            "DETAILS": {
                "OPERATION": "INSERT",
                "ROW_REF": 1516923055484123909
            }
        }
    ],
    "SOURCE_REF": "123456-789031"
}
```

### QUERY_UPDATE

To poll for updates to the given subscription to a DataServer query, you need to send a QUERY_UPDATE message. This is requested via a GET request to 
`[host]:[genesis_router_port]/[data_server_query_name]`.



The `SOURCE_REF` should match that used in the original DATA_LOGON (subscription).

The response contains the update of data (new/modified/deleted rows since the last update). The `ROW_REF` value is used to reference the given row previously returned. An empty QUERY_UPDATE response means there was no change to the underlying data since the last request.

Sample request:

```json
GET /my-trades HTTP/1.1
Host: myhost.acme.com:9064
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

It is possible to change the columns supplied on updates to the given subscription to a data server query.

This is requested via a PUT request to 
`[host]:[genesis_router_port]/[data_server_query_name]`.

This particular message is slightly different from other data server messages; specifically, the `SOURCE_REF` should be unique. A `SUBSCRIPTION_REF` is also needed and must match that `SOURCE_REF` value used in the original DATA_LOGON (subscription). The reason for the change in this message is that the response is a simple ACK/NACK, and the client should use this to know if it was successful or not. If an ACK is received, a further GET for the original `SOURCE_REF` (this request's `SUBSCRIPTION_REF`) will provide the added columns for each row the client has received, but nothing regarding the deleted columns. So the ACK is a means of telling the client it is OK to remove the deleted columns from the UI.

The body of this request should contain a `DETAILS` object with `ADD_COLUMNS` (further replies should include these columns) and/or `DROP_COLUMNS` (further replies should not include these columns)

Sample request:

```json
PUT /my-trades HTTP/1.1
Host: myhost.acme.com:9064
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
Host: myhost.acme.com:9064
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
Host: myhost.acme.com:9064
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

## Authentication

If AUTH is enabled on the server, for any new session you will need to log in to retrieve a valid `SESSION_AUTH_TOKEN` to supply on your requests.

### EVENT_LOGIN_AUTH

The URL for the login transaction is 
`[host]:[genesis_router_port]/ehandler-login-auth`.


Requests require a `USER_NAME` parameter in the `DETAILS` object.

* Initial login requires the `PASSWORD` parameter with a value of the user's password.
* Refresh requires the `REFRESH_AUTH_TOKEN` parameter with the value associated with the session (supplied on the last login reply payload)

To login initially

Sample request:

```json
POST /event-login-auth HTTP/1.1
Host: myhost.acme.com:9064
Content-Type: application/json
SOURCE_REF: 123456-789041

{
    "DETAILS": {
        "USER_NAME": "JohnDoe",
        "PASSWORD": "Password11*"
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

To refresh the token

Sample request:

```json
POST /event-login-auth HTTP/1.1
Host: myhost.acme.com:9064
Content-Type: application/json
SOURCE_REF: 123456-789042

{
    "DETAILS": {
        "USER_NAME": "JohnDoe",
        "REFRESH_AUTH_TOKEN": "FmqF9CGzo2MiujEZoiRUjGXh8ybDC62L"
    }
}
```

Sample response:

```json
{
    "MESSAGE_TYPE": "EVENT_LOGIN_AUTH_ACK",
    "SESSION_AUTH_TOKEN": "qeKC5dPAEH1qQgmwW0eFH6LPNWRzIkqi",
    "REFRESH_AUTH_TOKEN": "FmqF9CGzo2MiujEZoiRUjGXh8ybDC62L",
    "SESSION_ID": "7043f539-160a-418a-be92-d5813a13a5fd",
    "USER_ID": "",
    "DETAILS": {
        "SYSTEM": {
            "DATE": "Sun Jan 21 20:53:48 UTC 2018"
        },
        "HEARTBEAT_INTERVAL_SECS": 30,
        "FAILED_LOGIN_ATTEMPTS": 0,
        "REJECTED_LOGIN_ATTEMPTS": 0,
        "LAST_LOGIN_DATETIME": 1516567765917,
        "PRODUCT": [
            {
                "NAME": "genesis",
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

### EVENT_LOGOUT

To end the user's session, you need to send a logout EVENT. This particular request `SESSION_ID` (supplied on the last login reply payload) in the HTTP headers requires no body.

Sample request:

```json
POST /event-logout HTTP/1.1
Host: myhost.acme.com:9064
Content-Type: application/json
SOURCE_REF: 123456-789043
SESSION_ID: 7043f539-160a-418a-be92-d5813a13a5fd
USER_NAME: JohnDoe
```

Sample response:

```json
{
    "MESSAGE_TYPE": "LOGOUT_ACK",
    "SOURCE_REF": "123456-789043"
}
```

## Metadata

There are special requests which can be used to retrieve available system resources and their respective metadata (query fields available, request parameters, transaction fields, etc...)

### RESOURCES

This request will return all the resources available on the server, each resource has a name and a type (e.g. RequestServer, DataServer, EventHandler).

Resources can be accessed with a GET request to 
`[host]:[genesis_router_port]/resources-request`.


Sample request:

```json
GET /resources-request HTTP/1.1
Host: myhost.acme.com:9064
Content-Type: application/json
SOURCE_REF: 123456-789051
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
```

Sample response:

```json
{
    "MESSAGE_TYPE": "RESOURCES_REQUEST_ACK",
    "RESOURCES": [
        {
            "RESOURCE_NAME": "EVENT_ORDER_INSERT",
            "RESOURCE_TYPE": "EVENT_HANDLER"
        },
        {
            "RESOURCE_NAME": "EVENT_ORDER_AMEND",
            "RESOURCE_TYPE": "EVENT_HANDLER"
        },
        {
            "RESOURCE_NAME": "EVENT_ORDER_CANCEL",
            "RESOURCE_TYPE": "EVENT_HANDLER"
        },
        {
            "RESOURCE_NAME": "COUNTERPARTY_DETAILS",
            "RESOURCE_TYPE": "REQUESTSERVER"
        },
        {
            "RESOURCE_NAME": "MY_TRADES",
            "RESOURCE_TYPE": "DATASERVER"
        }
    ],
    "SOURCE_REF": "123456-789051"
}
```

### METADATA

This request will return all the metadata associated with a given resource.

Metadata can be accessed with a GET request to 
`[host]:[genesis_router_port]/meta-request?DETAILS[FEATURE]=[resource_name]`.

* Request server resources will return the request and reply fields available to the resource and their associated metadata.

* Data server resources will return the fields available to the resource and their associated metadata.

* Event handler resources will return the transaction fields available to the resource and their associated metadata.

Sample request:

```json
GET /meta-request?DETAILS[FEATURE]=MY_TRADES HTTP/1.1
Host: myhost.acme.com:9064
Content-Type: application/json
SOURCE_REF: 123456-789052
SESSION_AUTH_TOKEN: 83eLYBnlqjIWt1tqtJhKwTXJj2IL2WA0
```

Sample response:

```json
{
    "MESSAGE_TYPE": "META_ACK",
    "DETAILS": {
        "TYPE": "DATASERVER",
        "NAME": "MY_TRADES",
        "FIELD": [
            {
                "NAME": "TRADE_ID",
                "TYPE": "STRING"
            },
            {
                "NAME": "INSTRUMENT_ID",
                "TYPE": "STRING"
            },
            {
                "NAME": "CURRENCY",
                "TYPE": "STRING"
            },
            {
                "NAME": "QUANTITY",
                "TYPE": "INT"
            },
            {
                "NAME": "BROKER_ID",
                "TYPE": "STRING"
            },
            {
                "NAME": "PRICE",
                "TYPE": "DOUBLE"
            },
            {
                "NAME": "FULLY_FILLED",
                "TYPE": "BOOLEAN"
            },
            {
                "NAME": "DIRECTION",
                "TYPE": "ENUM"
            },
            {
                "NAME": "CLIENT_ID",
                "TYPE": "STRING"
            }
        ]
    },
    "SOURCE_REF": "123456-789052"
}
```