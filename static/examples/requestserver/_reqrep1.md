<!--Below is an example of a **reqrep.kts** file where the single `requestReply` code block includes a `filterWithParameters` block. You can find out more about `filterWithParameters` on the [Request Server](/develop/server-capabilities/query-data/snapshot-queries-request-server/#filterwithparameters) page. -->

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