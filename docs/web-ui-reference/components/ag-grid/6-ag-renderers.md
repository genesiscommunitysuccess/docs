---
id: ag-renderers
title: Genesis AG Renderers
sidebar_position: 16
---

This is a `slotted` component that allows a "visual" way of configuring cell renderers. Each `ag-cell` will take an `ICellRendererFunc` typed function that is an exact match to the official AG Grid's [Cell Renderer](https://www.ag-grid.com/javascript-data-grid/component-cell-renderer/). It will also take an `ICellRendererParams` typed params object to be used with the `ICellRendererFunc`.

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
