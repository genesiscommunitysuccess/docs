---
title: Request servers reference
sidebar_label: Request servers reference
sidebar_position: 20
id: reference

---
## Defining a request server in GPAL

### Default imports

The following properties are automatically available inside GPAL request servers:

```kotlin
val systemDefinition: SystemDefinitionService
val rxDb: RxDb
val entityDb: AsyncEntityDb
val metaData: MetaDataRegistry
val evaluatorPool: EvaluatorPool
val messageDelegator: MessageDelegator
val serviceDetailProvider: ServiceDetailProvider
val genesisHFT: GenesisHFT
val clientConnectionsManager: ClientConnectionsManager
```

### Basic definition

Here is the definition of a simple request server. You need to specify either a table or a view. In this example, we are using the table INSTRUMENT_DETAILS.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS)
}
```

### Multiple request servers

You can include multiple request servers in a single file.

```kotlin
requestReplies {
    requestReply(COUNTERPARTY)

    requestReply(INSTRUMENT_DETAILS)
}
```

### Specify fields on request and reply

You can also specify which fields are on the request and which fields are on the response.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
            INSTRUMENT_CODE withAlias "ALTERNATE_CODE"
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

### Using an index

You can use an index for the request definition.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {

        request(INSTRUMENT_DETAILS.BY_ALTERNATE_TYPE_ALTERNATE_CODE)

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

### Where block

The `where` block enables you to specify the conditions for running the particular code block.

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
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

        where { instrumentDetails, _ ->
            "ALLL3" == instrumentDetails.instrumentCode
        }
    }
}
```

### Pre-processing the request

Request server scripts can optionally transform a request parameter’s value using `withTransformation`. This takes two inputs:
* the request parameter’s value (which is nullable)
* the full request message

In the example  below, `withTransformation` is used twice.

* If the ALTERNATE_TYPE parameter value is null, then the request server will use "UNKNOWN" by default.
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

### Limit the number of rows returned

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

### Timeout

You can specify a timeout (in seconds) for a request server using the property `timeout`. In this example, we set a timeout of 10 seconds.

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

## Custom request servers

To enable more flexibility in defining request replies, Genesis supports custom request servers (request replies). This enables you to specify any class for the input and output for the request reply, similar to event handlers. For the request, optional fields should have a default value in the primary constructor.

Syntax:

```kotlin
// the name is optional, if none is provide, then request will be based on the 
// output class, e.g. REQ_OUTPUT_CLASS
requestReply<[input class], [output class]> ("{optional name}") {
  // permissioning is optional
  permissioning {
    // multiple auth blocks can be conbined with the and operator and the or operator
    auth("{map name}") {
        // use a single field
        field { fieldName }
        // or use multiple fields
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

### Examples

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

In this next example, we are using the generated dao classes to get a single record from the INSTRUMENT table using the INSTRUMENT_BY_ID index. We use the `db` property to access the entity db.

```kotlin
requestReply<Instrument.ById, Instrument> {
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