---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-entity-management](./foundation-entity-management.md) &gt; [EntityManagement](./foundation-entity-management.entitymanagement.md) &gt; [persistFilterModelKey](./foundation-entity-management.entitymanagement.persistfiltermodelkey.md)

## EntityManagement.persistFilterModelKey property

The key to use for persisting the filter model in local browser or KV storage.

**Signature:**

```typescript
persistFilterModelKey: string;
```

## Remarks

Default behaviour when unset is to not save the filter config. This value must be unique for each table in your app otherwise the persisted data will be corrupted.

