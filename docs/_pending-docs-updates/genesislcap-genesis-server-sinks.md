# Proposed docs change: Sinks

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (1069 non-space chars) is much smaller than the existing one (4116) and would delete content. Review and apply this to `docs/001_develop/02_server-capabilities/011_integrations/01_data-pipelines/index.mdx` manually.**

### Sinks

Sinks are the final elements of a data pipeline, responsible for writing the processed data to a destination.

#### Database sink (`dbSink`)

The `dbSink` writes data to the Genesis database. It is a transactional sink, meaning that for batch pipelines, the entire stream is processed within a single transaction. For real-time pipelines, each input element is processed in its own transaction.

To perform database operations, you map your stream elements to `DbOperation` instances. `DbOperation` is a sealed class with the following subtypes:

* `DbOperation.Insert(entity)` - inserts a new record.
* `DbOperation.Upsert(entity, modifiedFields)` - inserts a new record or updates an existing one with the specified modified fields.
* `DbOperation.Modify(entity, modifiedFields)` - modifies an existing record with the specified modified fields.
* `DbOperation.Delete(entity)` - deletes a record.

###### Examples

The following example maps incoming trade data to a `DbOperation.Modify` operation to update the status of an existing trade:

```kotlin
pipeline(name = "Trade Status Update Pipeline") {
    source(tradeSource)
        .map { trade ->
            DbOperation.Modify(
                entity = trade,
                modifiedFields = listOf(Trade.STATUS)
            )
        }
        .sink(dbSink())
}
```
