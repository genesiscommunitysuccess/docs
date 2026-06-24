# Proposed docs change: permissioning

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (770 non-space chars) is much smaller than the existing one (2586) and would delete content. Review and apply this to `docs/001_develop/02_server-capabilities/011_integrations/04_custom-endpoints/index.mdx` manually.**

### permissioning

You can define authorization and permissioning rules for your custom endpoints.

Unlike Data Servers, Request Servers, or Event Handlers, the `userHasRight` helper function is not available directly in the custom-endpoints DSL. 

To check if a user has a specific right within a custom endpoint, you must inject the `RightSummaryCache` and call its `userHasRight` method.

###### Examples

The following example shows how to inject `RightSummaryCache` and check a user's rights inside the `handleRequest` block:

```kotlin
import global.genesis.session.RightSummaryCache

webHandlers {
    val rightSummaryCache = injector<RightSummaryCache>()

    endpoint(GET, "admin-data") {
        handleRequest {
            val userName = principal.userName
            val hasRight = rightSummaryCache.userHasRight(userName, "AdminRight")
            
            if (!hasRight) {
                // Handle unauthorized access
            }
            
            "Sensitive Admin Data"
        }
    }
}
```
