---
title: 'Advanced'
sidebar_label: 'Advanced'
id: advanced
---

[Introduction](/server-modules/integration/rest-endpoints/introduction/)  | [Basics](/server-modules/integration/rest-endpoints/basics/) | [Advanced](/server-modules/integration/rest-endpoints/advanced/) | [Configuring runtime](/server-modules/integration/rest-endpoints/configuring-runtime/) | [Testing](/server-modules/integration/rest-endpoints/testing/)

## Authentication

If AUTH is enabled on the server, for any new session you will need to log in to retrieve a valid `SESSION_AUTH_TOKEN` to supply on your requests.

### EVENT_LOGIN_AUTH

The URL for the login transaction is
`[host]:[genesis_router_port]/ehandler-login-auth`.


Requests require a `USER_NAME` parameter in the `DETAILS` object.

* Initial login requires the `PASSWORD` parameter with a value of the user's password.
* Refresh requires the `REFRESH_AUTH_TOKEN` parameter with the value associated with the session (supplied on the last login reply payload).

To login initially

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

To refresh the token

Sample request:

```json
POST /event-login-auth HTTP/1.1
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789042

{
    "DETAILS": {
        "USER_NAME": "JaneDee",
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
Host: localhost:9064
Content-Type: application/json
SOURCE_REF: 123456-789043
SESSION_ID: 7043f539-160a-418a-be92-d5813a13a5fd
USER_NAME: JaneDee
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
Host: localhost:9064
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

* Request Server resources will return the request and reply fields available to the resource and their associated metadata.

* Data Server resources will return the fields available to the resource and their associated metadata.

* Event Handler resources will return the transaction fields available to the resource and their associated metadata.

Sample request:

```json
GET /meta-request?DETAILS[FEATURE]=MY_TRADES HTTP/1.1
Host: localhost:9064
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