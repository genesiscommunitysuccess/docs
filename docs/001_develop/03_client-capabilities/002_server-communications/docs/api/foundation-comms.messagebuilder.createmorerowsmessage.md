---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [MessageBuilder](./foundation-comms.messagebuilder.md) &gt; [createMoreRowsMessage](./foundation-comms.messagebuilder.createmorerowsmessage.md)

## MessageBuilder.createMoreRowsMessage() method

Creates a message to request more rows. This is only relevant when you are connected to a real-time (Data Server) datasource.

**Signature:**

```typescript
createMoreRowsMessage(sourceRef: string, viewNumber?: number): Message<MessageDetails.MoreRows>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sourceRef | string | The unique source reference. |
|  viewNumber | number | _(Optional)_ The desired view number. Default: the first view. |

**Returns:**

[Message](./foundation-comms.message.md)&lt;[MessageDetails.MoreRows](./foundation-comms.messagedetails.morerows.md)&gt;

The more rows message.

## Remarks

MORE\_ROWS

