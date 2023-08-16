<!--Below is an example of a **reqrep.kts** file where the single `requestReply` code block includes a `where` clause. You can find out more about `where` clauses on the [Basics](../../../server/request-server/basics/#where-block) page. -->

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
        }

        where { row, parameters ->
            row.instrumentCode == "ALLL3" &&                         
            parameters.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
        }
    }
}
```