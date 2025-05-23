---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-store](./foundation-store.md) &gt; [AbstractStore](./foundation-store.abstractstore.md) &gt; [commitValue](./foundation-store.abstractstore.commitvalue.md)

## AbstractStore.commitValue() method

> This API is provided as a beta preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Alternative value commit api.

**Signature:**

```typescript
protected commitValue<K extends keyof TStore>(key: K, value: TStore[K]): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | K | The property key from the store's interface. |
|  value | TStore\[K\] | The value to set. |

**Returns:**

void

