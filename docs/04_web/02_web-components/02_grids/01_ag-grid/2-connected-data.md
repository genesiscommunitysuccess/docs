---
id: ag-grid-connected
title: Connected data
---

The examples below use JSX syntax. Real-world scenarions might be different, depending on the client application tooling and structure.

For `foundation-ui` versions after **0.0.17** the [Genesis Datasource](/web/web-components/grids/ag-grid/ag-genesis-datasource/) has its own slotted component. The documentation should be valid for both usages (current vs. previous), since attributes/props are the same.

## Set-up

:::info
In the examples below, we refer to a sample `@genesislcap/alpha-design-system` design system with an `alpha` prefix. Your design system would probably have a different name/prefix, while still exposing the same API.
:::

:::warning
Make sure you check which version is currently being used in your application. The examples below reflect the available scenarios for each version.
:::

```ts
import { provideDesignSystem, alphaAgGrid } from '@genesislcap/alpha-design-system';

provideDesignSystem().register(alphaAgGrid());
```

## Usage (0.0.18+)

```html title="Streaming data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid>
    <ag-genesis-datasource resourceName="ALL_PROCESSES_STATUS" />
    ...
  </alpha-ag-grid>
  ...
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid>
    <ag-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" />
    ...
  </alpha-ag-grid>
  ...
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server limited to 5 rows"
<alpha-card>
  <alpha-ag-grid>
    <ag-genesis-datasource resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" maxRows="5" />
    ...
  </alpha-ag-grid>
  ...
</alpha-card>
```

## Usage (0.0.17 and prior)

```html title="Streaming data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid resourceName="ALL_PROCESSES_STATUS"></alpha-ag-grid>
  ...
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server"
<alpha-card>
  <alpha-ag-grid resourceName="ALL_PROCESSES_STATUS" isSnapshot="true"></alpha-ag-grid>
  ...
</alpha-card>
```

```html title="Spanshot (one-time) data from ALL_PROCESS_STATUS data server limited to 5 rows"
<alpha-card>
  <alpha-ag-grid resourceName="ALL_PROCESSES_STATUS" isSnapshot="true" maxRows="5"></alpha-ag-grid>
  ...
</alpha-card>
```
