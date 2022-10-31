---
title: 'Request Server: advanced'
sidebar_label: 'Advanced'
id: advanced
---



## Pre-processing a request

Request Server scripts can optionally transform a request parameter’s value using `withTransformation`. This takes two inputs:
* the request parameter’s value (which is nullable)
* the full request message

In the example below, `withTransformation` is used twice.

* If the ALTERNATE_TYPE parameter value is null, then the Request Server will use "UNKNOWN" by default.
* If the ALTERNATE_TYPE parameter has the value "RIC", then the transformation block will use the value of INSTRUMENT_CODE from the request. Otherwise, it will assign it the value "NOT_RIC" before making the database lookup. 

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE withTransformation { type, _ ->
                type?.toUpperCase() ?: "UNKNOWN"
            }
            INSTRUMENT_CODE withTransformation { type, set ->
                val value = if (set.fields["ALTERNATE_TYPE"].toString().toUpperCase() == "RIC") {
                    type
                } else {
                    "NOT_RIC"
                }
                value
            } withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_CODE
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

## Limit the number of rows returned

You can limit the number of rows returned using the property `rowReturnLimit`. In this example, we limit it to 2.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {

        rowReturnLimit = 2

        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

## Timeout

You can specify a timeout (in seconds) for a Request Server using the property `timeout`. In this example, we set a timeout of 10 seconds.

```kotlin
requestReplies {
    requestReply("QUICK_INSTRUMENT", INSTRUMENT_DETAILS) {

        timeout = 10

        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
        }

        reply {
            INSTRUMENT_ID
            INSTRUMENT_NAME
            LAST_TRADED_PRICE
            VWAP
            SPREAD
            TRADED_CURRENCY
            EXCHANGE_ID
        }
    }
}
```

## Ranges

You can specify ranges from the client of the requestReply server by post-fixing the request parameter names with _FROM and _TO. The example below shows a client building a GenesisSet request based upon
the requestReplies defined from previous example. This example stipulates a price range between 1,000 and 10,000. Leaving out FROM will define a top-end range, leaving out TO will define a bottom-end range. 


```kotlin

    // client building request  
    val request = genesisSet {
    
        "DETAILS" with genesisSet {
            "LAST_TRADED_PRICE_FROM" to 1_000
            "LAST_TRADED_PRICE_TO" to 10_000
        }
    }

    reply(request)
```
Note that ranges that are not based on indexes perform more slowly than those that are.

## Permission

You can use a permissioning block to define both dynamic permissions (AUTH) and permission codes (based on RIGHT_SUMMARY rights) on Request Servers, which is similar to Event Handler and Data Server.

### Dynamic permission:

Similar to Data Server, you can provide dynamic permissioning on Request Server by using table/view reference.

```kotlin
    requestReply("MARKET_INSTRUMENTS", INSTRUMENT_DETAILS) {

        permissioning {
            auth("EXCHANGE") {
                INSTRUMENT_DETAILS.EXCHANGE_ID // This cannot be done on Custom request-server see ex below
            }
        }

        request {
            ...
        }

        reply {
            ...
        }
    }
```

Permissioning is different when you use [Custom Request Servers](/server/request-server/advanced/#custom-request-servers), which is similar to Event-Handler permissioning.
As you use any class/DAO as input and output classes - you cannot use field syntax under auth block ex: Use instrumentId instead of INSTRUMENT_DETAILS.INSTRUMENT_ID

```kotlin
requestReply<AltInstrumentId.ByAlternateTypeAlternateCode, AltInstrumentId> {
    permissioning {
        auth("INSTRUMENT") {
            field { instrumentId }
        }
    }

    reply { byAlternateTypeAlternateCode ->
        ...
    }
}
```

### Permission codes

Similar to Event handlers and Request Servers you can add permission code as specified below.

```kotlin
    requestReply(INSTRUMENT_DETAILS) {

        permissioning {
            permissionCodes = listOf("LICENSE_TO_KILL", "LICENSE_TO_BILL")
        }

        request {
            ...
        }

        reply {
            ...
        }
    }
```

You can find out more details in our section on [authorisation](/server/access-control/authorisation-overview/).

## Custom Request Servers
By defining your own Request Servers, you have maximum flexibility. You can specify any class for the input and output, similar to Event Handlers. For the request, optional fields should have a default value in the primary constructor. You cannot use native Kotlin classes. You should wrap these in custom input and output classes.

We recommend that you locate your classes within the messages module of your application. This is where we place all the custom message types for our application. You need to ensure that the _app-name_**-script-config** module has a dependency on the messages module.

```bash
    api(project(":{app-name}-messages"))
```

The `requestReply` code blocks can be as simple or complex as your requirements. They are useful, for example, if you want to request data from a number of different tables and views that are not related. By nesting and joining all the relevant data in your `requestReply` statement, you create your own metadata for the Request Server, so it can then be used anywhere in the module.

### Syntax

```kotlin
// the name is optional, if none is provided, then request will be based on the 
// output class, e.g. REQ_OUTPUT_CLASS
requestReply<[input class], [output class]> ("{optional name}") {
  // permissioning is optional
  permissioning {
    // multiple auth blocks can be combined with the and operator and the or operator
    auth("{map name}") {
        // use a single field of output_class
        field { fieldName }
        // or use multiple fields of output_class
        fields { listof(fieldNameA, fieldNameB) }
        
        // hide fields are supported
        hideFields { userName ->
            listOf("FIELD_NAME_A")
        }
        
        // predicates are supported
        where {
        }
    }
  }
  
  // a reply tag is required; there are three types.
  // the reply tag will have a single parameter, the request, which will be of type 
  // [input class]
  // all three have these fields available:
  // 1. db          - readonly entity database 
  // 2. userName    - the name of the user who made the request
  // 3. LOG         - logger with name: global.genesis.requestreply.pal.{request name}
  
  // either:
  reply { request -> 
  }
  
  // or: 
  replySingle { request -> 
  }
  
  // or:
  replyList { request ->
  }
}
```

In this example, we define two data classes; Hello and World. We use these to create a Hello World request:

```kotlin
data class Hello(val name: String)
data class World(val message: String)

requestReply<Hello, World>("HELLO_WORLD") {
    replySingle { hello: Hello ->
        World("Hello ${hello.name}")
    }
}
```

We can also check who made the request by accessing the `userName` property:

```kotlin
requestReply<Hello, World>("HELLO_WORLD_CHECK") {
    replySingle { hello: Hello ->
        when (userName) {
            hello.name -> World("Hello ${hello.name}")
            else -> World("You're not ${hello.name}!")
        }
    }
}
```

In this next example, we are using the generated dao classes to get a single record from the `INSTRUMENT_DETAILS` table using the `ByInstrumentId` index. We use the `db` property to access the entity db.

```kotlin
requestReply<InstrumentDetails.ByInstrumentId, InstrumentDetails> {
    replySingle { byId->
        db.get(byId)
    }
}
```

Next is a more complex example. 
The first block checks that the user is authorised to view the instrument.

The second block uses the ALT_INSTRUMENT_ID table. The index is used as the input, but we return either a `getBulk`, a `getRange` or a `get`, depending on the input.

```kotlin
requestReply<AltInstrumentId.ByAlternateTypeAlternateCode, AltInstrumentId> {
    permissioning {
        auth("INSTRUMENT") {
            field { instrumentId }
        }
    }
    
    reply { byAlternateTypeAlternateCode ->
        when {
            byAlternateTypeAlternateCode.alternateType == "*" ->
                db.getBulk(ALT_INSTRUMENT_ID)
            byAlternateTypeAlternateCode.alternateCode == "*" ->
                db.getRange(byAlternateTypeAlternateCode, 1)
            else -> db.get(byAlternateTypeAlternateCode).flow()
        }
    }
}
```

In the example below, we have defined a more complicated auth logic:

```kotlin
requestReply<AltInstrumentId.ByAlternateTypeAlternateCode, AltInstrumentId>("FANCY_INSTRUMENT") {
    permissioning {
        auth("INSTRUMENT") {
            field { instrumentId }
            where {
                alternateType == "FOO"
            }
        } or auth("ALTERNATE_CODE") {
            field { alternateCode }
            where {
                alternateType == "BAR"
            }
        }
    }
    reply { byAlternateTypeAlternateCode ->
        db.getRange(byAlternateTypeAlternateCode, 1)
    }
}
```

Helpers exist to assist interacting with the Kotlin Flow type, which is the return type within the reply block. These helpers are:
* T.flow() - Converts to the Flow type
* T.distinct() - Returns a Flow of all distinct values
* T.distinctBy(selector: (T) -> K?) - Returns a Flow of all distinct values given a selector
* T.sorted() - Returns a Flow of all sorted values
* T.sortedBy(selector: (T) -> K?) - Returns a Flow of all sorted values given a selector

