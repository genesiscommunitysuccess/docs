# Docs update needed: Custom endpoints configuration
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## Custom endpoints configuration

You can configure custom HTTP endpoints for your Genesis application. This configuration allows you to control various settings, such as the maximum number of records returned by the endpoint.

###### Configuration properties

| Property | Type | Description | Default |
|---|---|---|---|
| `maxRecords` | `Int` | The maximum number of records that can be returned by a single request to the endpoint. | `2000` |

###### Examples

The following example shows how to configure `maxRecords` within the `router` configuration block:

```kotlin
router {
    config {
        maxRecords = 1000
    }
}
```
