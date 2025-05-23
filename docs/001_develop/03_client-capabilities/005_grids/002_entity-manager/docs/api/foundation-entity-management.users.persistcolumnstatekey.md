---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-entity-management](./foundation-entity-management.md) &gt; [Users](./foundation-entity-management.users.md) &gt; [persistColumnStateKey](./foundation-entity-management.users.persistcolumnstatekey.md)

## Users.persistColumnStateKey property

This attribute controls whether and how the user manager stores the state of the columns when the user edits them. Defaulted to `entity_users_management`.

**Signature:**

```typescript
persistColumnStateKey: string;
```

## Remarks

Setting this value will set the entity manager to persist the column states through page refreshes etc. An example of what is stored is when the user resizes or reorders columns. This value must be unique for each table in your app otherwise the persisted data will be corrupted. There is an option on the grid for the user to reset the table to the default layout if they wish.

This does \*not\* store the filter state, to store that use the separate `persist-filter-model-key` attribute

