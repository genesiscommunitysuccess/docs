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

You can specify which fields are on the request and which fields are on the response. Here is an example:

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

The `where` block enables you to specify the conditions for running the particular code block. The where block can take two optional parameters:
    * instrumentDetails - this represents a row from the table or view
    * parameters - this a GenesisSet which holds the parameters that are passed on the request. The parameters can be accessed by using the GenesisSet getters to access named parameters.

In this contrived example below, the where block filters rows  hose instrumentCode is not equal to "ALLL3" and the request parameter "ALTERNATE_TYPE" is either "RIC" or "BLOOMBERG". 
The row parameter represents the rows returned from the table or view definined at the top of the requestReply definition, in this case INSTRUMENT_DETAILS.



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

        where { row, parameters ->
            "ALLL3" == row.instrumentCode &&                         
             parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
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
