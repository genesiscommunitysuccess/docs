---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-comms](./foundation-comms.md) &gt; [getSocket](./foundation-comms.getsocket.md)

## getSocket() function

Gets Socket from the DI container.

**Signature:**

```typescript
export declare function getSocket(): Socket;
```
**Returns:**

[Socket](./foundation-comms.socket.md)

## Remarks

A utility method for host applications that are not using decorators or the DI container.

## Example


```ts
import { getSocket } from '@genesislcap/foundation-comms';
...
private socket = getSocket();
```

