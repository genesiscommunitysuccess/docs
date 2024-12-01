<!--Below is an example of a **reqrep.kts** file where the single `requestReply` code block includes a `where` clause. You can find out more about `where` clauses on the [Basics](/develop/server-capabilities/snapshot-queries-request-server/#where-block) page. -->

```kotlin
requestReplies {
    requestReply("INSTRUMENT_DETAILS", INSTRUMENT_DETAILS) {

        request {
            ALTERNATE_TYPE
        }

        filterWithParameters {
            data.instrumentCode == "ALLL3" &&                         
            genesisSet.getString("ALTERNATE_TYPE") in listOf("RIC", "BLOOMBERG") 
        }
    }
}
```