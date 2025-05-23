---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [Connect](./foundation-comms.connect.md) &gt; [streamState](./foundation-comms.connect.streamstate.md)

## Connect.streamState() method

Starts listening for updates on the specified resource.

**Signature:**

```typescript
streamState(resourceName: string, onMessage: Function, onError: Function, params?: DataserverParams, initialState?: any[]): Observable<any[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  resourceName | string | The name of the resource to listen for updates on. |
|  onMessage | Function | A callback function to handle received messages. |
|  onError | Function | A callback function to handle errors. |
|  params | [DataserverParams](./foundation-comms.dataserverparams.md) | _(Optional)_ Additional parameters to pass to the server. |
|  initialState | any\[\] | _(Optional)_ State of the list to start with, defaults to empty array. |

**Returns:**

Observable&lt;any\[\]&gt;

An observable that emits latest state of the list it subscribes to.

