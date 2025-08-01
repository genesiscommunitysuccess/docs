---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [GenesisResources](./foundation-comms.genesisresources.md)

## GenesisResources interface

GenesisResources DI interface.

**Signature:**

```typescript
export interface GenesisResources 
```

## Remarks

A lazy shared Genesis Resources lookup system. N number of callers can request information in succession, but only the first will invoke the server request, and each caller will receive their results when that returns.

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [destroy](./foundation-comms.genesisresources.destroy.md) |  | () =&gt; void | Destroy and garbage collect |
|  [getAllResources](./foundation-comms.genesisresources.getallresources.md) |  | () =&gt; Promise&lt;[ResourceItem](./foundation-comms.resourceitem.md)\[\]&gt; | Returns all available resources. |
|  [getResourceTypeFor](./foundation-comms.genesisresources.getresourcetypefor.md) |  | (resourceName: string) =&gt; Promise&lt;[ResourceType](./foundation-comms.resourcetype.md)&gt; | Gets the type of resource |
|  [isValidResource](./foundation-comms.genesisresources.isvalidresource.md) |  | (resourceName: string) =&gt; Promise&lt;boolean&gt; | Checks if the resource exists |

