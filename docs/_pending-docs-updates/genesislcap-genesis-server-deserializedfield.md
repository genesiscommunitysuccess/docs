# Docs update needed: DeserializedField
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## DeserializedField

When you work with serialized data in the Genesis Platform, you can use the `DeserializedField` sealed class to represent parsed JSON structures. This class has two primary subtypes:

- `DeserializedField.Object`: Represents a JSON object. It contains a `fields` property of type `Map<String, DeserializedField>`.
- `DeserializedField.Array`: Represents a JSON array. It contains an `elements` property of type `List<DeserializedField>`.

###### Examples

The following Kotlin example shows how you can pattern-match on `DeserializedField` to process different JSON structures:

```kotlin
fun processField(field: DeserializedField) {
    when (field) {
        is DeserializedField.Object -> {
            val fieldsMap: Map<String, DeserializedField> = field.fields
            // Process object fields
        }
        is DeserializedField.Array -> {
            val elementsList: List<DeserializedField> = field.elements
            // Process array elements
        }
    }
}
```
