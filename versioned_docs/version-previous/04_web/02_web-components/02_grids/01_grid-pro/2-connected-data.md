---
id: grid-pro-connected
title: Grid Pro - Connected data
keywords: [web, web components, grid, grid pro]
tags:
    - web
    - web components
    - grid
    - grid pro
---

## Set-up

:::info
In the examples below, we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would probably have a different name/prefix, while still exposing the same API.
:::

```ts
import { provideDesignSystem } from '@genesislcap/alpha-design-system';
import { foundationGridComponents } from '@genesislcap/grid-pro';

provideDesignSystem().register(alphaAgGrid(), foundationGridComponents);
```

This is an example of how to retrieve information from ALL_PROCESS_STATUS query

```html title="Streaming data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-grid-pro>
    <grid-pro-genesis-datasource resourceName="ALL_PROCESSES_STATUS" />
    ...
  </alpha-grid-pro>
  ...
</alpha-card>
```

This is an example of a simple snapshot of the ALL_PROCESS_STATUS query

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-grid-pro>
    <grid-pro-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" />
    ...
  </alpha-grid-pro>
  ...
</alpha-card>
```

and lastly, this is an example of a simple snapshot of the ALL_PROCESS_STATUS query limiting the rows to a fixed number

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server limited to 5 rows"
<alpha-card>
  <alpha-grid-pro>
    <grid-pro-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" maxRows="5" />
    ...
  </alpha-grid-pro>
  ...
</alpha-card>
```
