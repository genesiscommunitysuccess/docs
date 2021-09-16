---
title: Request Servers Reference
sidebar_label: Request Servers Reference
sidebar_position: 2
id: reference
---

## Custom Request Replies
To enable more flexibility in defining request replies, Genesis supports custom request replies. It allows developers to specify any class for the input and output for their request replies, similar to event handlers. For the request, optional fields should have a default value in the primary constructor.

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

In this example we define two data classes; Hello and World and we use it to create a hello world request:

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
In this next example we are using the generated dao classes to get a single record from the INSTRUMENT table using the INSTRUMENT_BY_ID index. We use the db property to access the entity db.

```kotlin
requestReply<Instrument.ById, Instrument> {
    replySingle { byId->
        db.get(byId)
    }
}
```
Next is a more complex example; using the ALT_INSTRUMENT_ID table. We are using the index as input, but we return either a getBulk, a getRange or a get, depending on the input. Also, we check if the user is authorised to view the instrument:

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
Also, we can have more complicated auth logic:

```kotlin
requestReply<AltInstrumentId.ByAlternateTypeAlternateCode, AltInstrumentId>("FANCY_INSTRUMENT") {
    permissioning {
        auth("INSTRUMENT") {
            field { instrumentId }
            where {
                alternateType == "RIC"
            }
        } or auth("ALTERNATE_CODE") {
            field { alternateCode }
            where {
                alternateType == "BLOOMBERG"
            }
        }
    }
    reply { byAlternateTypeAlternateCode ->
        db.getRange(byAlternateTypeAlternateCode, 1)
    }
}
```