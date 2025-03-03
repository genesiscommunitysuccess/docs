---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [MessageBuilder](./foundation-comms.messagebuilder.md) &gt; [createDataLogonMessage](./foundation-comms.messagebuilder.createdatalogonmessage.md)

## MessageBuilder.createDataLogonMessage() method

Creates a message to logon to a DATASERVER. Used for data fetching.

**Signature:**

```typescript
createDataLogonMessage(resourceName: string, params?: DataserverParams): Message<MessageDetails.DataserverRequest>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  resourceName | string | The resource name. |
|  params | [DataserverParams](./foundation-comms.dataserverparams.md) | _(Optional)_ The additional parameters. |

**Returns:**

[Message](./foundation-comms.message.md)&lt;[MessageDetails.DataserverRequest](./foundation-comms.messagedetails.dataserverrequest.md)&gt;

The data logon message.

## Remarks

DATA\_LOGON

