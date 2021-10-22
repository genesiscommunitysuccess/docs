---
title: Custom request servers 
sidebar_label: Custom request servers
sidebar_position: 30
id: custom

---




## Custom request servers

By defining your own request servers, you have maximum flexibility. You can specify any class for the input and output, similar to event handlers. For the request, optional fields should have a default value in the primary constructor.

### Syntax

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