---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-testing](./foundation-testing.md) &gt; [SpiedFunctions](./foundation-testing.spiedfunctions.md)

## SpiedFunctions type

Filters out all key/value pairs which are not functions, and omits the constructor

**Signature:**

```typescript
export type SpiedFunctions<T> = Omit<FilterConditionally<T, (...args: any[]) => any>, 'constructor'>;
```
**References:** [FilterConditionally](./foundation-testing.filterconditionally.md)
