---
format: md
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@genesislcap/foundation-entity-management](./foundation-entity-management.md) &gt; [EntityManagement](./foundation-entity-management.entitymanagement.md) &gt; [setDSConfigWithoutUpdatingBaseCriteria](./foundation-entity-management.entitymanagement.setdsconfigwithoutupdatingbasecriteria.md)

## EntityManagement.setDSConfigWithoutUpdatingBaseCriteria() method

Usually when the datasource config is updated we need to cache the criteria so it can be combined with the searchbar, but this function allows you to set the datasource config without doing that (so we don't cache the search bar criteria)

**Signature:**

```typescript
setDSConfigWithoutUpdatingBaseCriteria(config: DatasourceConfiguration): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  config | [DatasourceConfiguration](./foundation-entity-management.datasourceconfiguration.md) |  |

**Returns:**

void

