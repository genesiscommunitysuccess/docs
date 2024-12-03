---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [Connect](./foundation-comms.connect.md) &gt; [getMoreColumns](./foundation-comms.connect.getmorecolumns.md)

## Connect.getMoreColumns() method

Requests additional columns for the specified source reference.

**Signature:**

```typescript
getMoreColumns(sourceRef: string): Promise<Message>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sourceRef | string | The source reference to request more columns for. |

**Returns:**

Promise&lt;[Message](./foundation-comms.message.md)&gt;

A promise that resolves with the additional columns.
