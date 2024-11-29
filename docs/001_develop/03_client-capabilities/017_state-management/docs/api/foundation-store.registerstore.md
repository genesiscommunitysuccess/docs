---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-store](./foundation-store.md) &gt; [registerStore](./foundation-store.registerstore.md)

## registerStore variable

Creates a dependency injection key for the store being registered.

**Signature:**

```typescript
registerStore: <K extends Key>(Base: Constructable<Store>, name?: string) => import("@microsoft/fast-foundation").InterfaceSymbol<K>
```

## Example


```ts
export const TradeEntry = registerStore<TradeEntry>(DefaultTradeEntry, 'TradeEntry');
```
