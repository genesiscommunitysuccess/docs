---
id: ag-grid-connected
title: Connected Data
sidebar_position: 12
---

The examples below are using JSX syntax, real-world scenarions might be different depending on the client application tooling & structure.

## Setup

:::info
In the examples below we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would likely have a different name/prefix while still exposing the same API.
:::

```ts
import { provideDesignSystem, alphaAgGrid } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAgGrid());
```

## Usages

```html title="Streaming data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid></alpha-ag-grid>
  <ag-genesis-datasource resourceName="ALL_PROCESSES_STATUS" />
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid></alpha-ag-grid>
  <ag-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" />
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server limited to 5 rows"
<alpha-card>
  <alpha-ag-grid></alpha-ag-grid>
  <ag-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" maxRows="5" />
</alpha-card>
```
