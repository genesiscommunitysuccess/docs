---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-utils](./foundation-utils.md) &gt; [JSONSerializer](./foundation-utils.jsonserializer.md) &gt; [deserialize](./foundation-utils.jsonserializer.deserialize.md)

## JSONSerializer.deserialize() method

Deserializes a response object from a HTTP request to a JavaScript object.

**Signature:**

```typescript
deserialize<T = any>(response: Response): Promise<T>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  response | Response | The HTTP response object. |

**Returns:**

Promise&lt;T&gt;

A promise that resolves to the deserialized JavaScript object.

