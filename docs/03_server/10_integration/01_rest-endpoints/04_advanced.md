---
title: 'REST endpoints - Advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, integration, REST endpoints, advanced]
tags:
  - server
  - integration
  - REST endpoints
  - advanced
---

[Introduction](/server/integration/rest-endpoints/introduction/) | [Where to define](/server/integration/rest-endpoints/where-to-define) | [Basics](/server/integration/rest-endpoints/basics/) | [Advanced](/server/integration/rest-endpoints/advanced/) | [Configuring runtime](/server/integration/rest-endpoints/configuring-runtime/) | [Testing](/server/integration/rest-endpoints/testing/)

## Authentication

### EVENT_LOGIN_REFRESH

Log in refresh requests are submitted via POST requests to
`[host]:[genesis_router_port]/event-login-auth`.

Log in refresh requests require:

* `SOURCE_REF` header
* `USER_NAME` and `REFRESH_AUTH_TOKEN` (supplied on the last login reply payload in the HTTP headers) parameters in the `DETAILS` object.

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

To end the user's session, you need to send a log out request.

Log out requests are submitted via POST requests to
`[host]:[genesis_router_port]/event-logout`.

Log out requests require:

* `SOURCE_REF` header
* `USER_NAME` header
* `SESSION_ID` header (supplied on the last login reply payload in the HTTP headers)

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

Resource requests are accessed via GET requests to
`[host]:[genesis_router_port]/resources-request`.

Resource requests require:

* `SOURCE_REF` header
* `SESSION_AUTH_TOKEN` header

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

Metadata requests are accessed via GET requests to
`[host]:[genesis_router_port]/meta-request?details[FEATURE]=[RESOURCE_NAME]`.

* Request Server resources will return the request and reply fields available to the resource and their associated metadata.

* Data Server resources will return the fields available to the resource and their associated metadata.

* Event Handler resources will return the transaction fields available to the resource and their associated metadata.

Metadata requests require:

* `SOURCE_REF` header
* `SESSION_AUTH_TOKEN` header

Sample request:

```json
GET /meta-request?details[FEATURE]=MY_TRADES HTTP/1.1
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