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

```html title="Streaming data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-grid-pro>
    <grid-pro-genesis-datasource resourceName="ALL_PROCESSES_STATUS" />
    ...
  </alpha-grid-pro>
  ...
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-grid-pro>
    <grid-pro-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" />
    ...
  </alpha-grid-pro>
  ...
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server limited to 5 rows"
<alpha-card>
  <alpha-grid-pro>
    <grid-pro-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" maxRows="5" />
    ...
  </alpha-grid-pro>
  ...
</alpha-card>
```
