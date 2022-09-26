---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server/request-server/introduction)  | [Basics](/server/request-server/basics) | [Advanced](/server/request-server/advanced) | [Examples](/server/request-server/examples) | [Configuring runtime](/server/request-server/configuring-runtime) | [Testing](/server/request-server/testing)


Let's make things really simple.
- A Request Server is a component that supplies static data to the front end of your application.
- You define your application's Request Reply in a kotlin script file  _application-name_**-reqrep.kts**. This file should be in the _application-name_-script-config module.
- In this file, you define specific `requestReply` codeblocks, each of which is designed to supply different sets of data; this could be a table or view, or just a subset of the fields in a table or view.
- A `requestReply` can include a number of other subtleties, such as `where` clauses or ranges, so that you can create code that matches your precise requirements.
- If you use AppGen to build from your dictionary, then a basic kts file will be built automatically for you, covering all the tables and views in your data model. You can edit this file to add sophistication to the component.
- Otherwise, you can build your kts by defining each `requestReply` codeblock from scratch. 

### Basic definition

Here is the definition of a simple Request Server file. 

- The whole content is wrapped in a single `requestReplies` statement. This applies no matter how many `requestReply` codeblocks you specify.
- In the `requestReply` codeblock, you must at least specify either a table or a view. In this example, we are using the table `INSTRUMENT_DETAILS`. A request to this Request Server will return all the fields in that table.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS)
}
```

### Multiple Request Servers

Almost certainly, your application will need to have more than one `requestReply`. So, let us state the obvious and show you a file with two `requestReply` codeblocks. Again, each is the simplest kind you could possibly have.

```kotlin
requestReplies {
    requestReply(COUNTERPARTY)

    requestReply(INSTRUMENT_DETAILS)
}
```

### Specifying fields on request and reply


With all those basic `requestReply` codeblocks we have seen so far, all the fields in the table are returned.

We can add some precision using `request` and `reply` blocks within a `requestReply` statement.

When defining a `request` block, you must define at least one primary key or index. In the example below, the fields `ALTERNATE_TYPE` AND `INSTRUMENT_CODE` together form the primary key.


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
Note the following:
- When you do not define a `request` block, the primary key for the table or view is used as the default request field.
- When you do not define a `reply block`, all the fields will be returned.

### Specifying derived fields

You can define derived fields to be included on the reply, where the input for the derived field is the reply entity. 

Derived fields cannot be used within a `where` block.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {
        derivedFields {
            derivedField("IS_USD", BOOLEAN) {
                tradedCurrency == "USD"
            }
        }
    }
}
```

### Using an index

The example below uses an index as the request definition. This provides additional indexing at the request level.

```kotlin
requestReplies {
    requestReply(INSTRUMENT_DETAILS) {
        request(INSTRUMENT_DETAILS.BY_INSTRUMENT_ID)
    }
}
```

### Where block

The `where` block enables you to specify the conditions for which data should be returned. The `where` block can take two optional parameters:
* row - this represents a row from the table or view
* parameters - this a GenesisSet that holds the parameters that are passed on the request; the parameters can be accessed by using the GenesisSet getters to access named parameters

In this contrived example below, the `where` block filters rows whose instrumentCode is not equal to "ALLL3" and the request parameter "ALTERNATE_TYPE" is either "RIC" or "BLOOMBERG". 
The row parameter represents the rows returned from the table or view defined at the top of the `requestReply` definition, in this case INSTRUMENT_DETAILS.

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
        }

        where { row, parameters ->
            "ALLL3" == row.instrumentCode &&                         
             parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
        }
    }
}
```

Note - You cannot use derived fields within a `where` block.
