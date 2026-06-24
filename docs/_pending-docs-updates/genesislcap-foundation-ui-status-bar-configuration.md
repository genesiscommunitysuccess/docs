# Proposed docs change: Status bar configuration

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (1171 non-space chars) is much smaller than the existing one (4060) and would delete content. Review and apply this to `docs/001_develop/03_client-capabilities/005_grids/003_grid-pro/index.mdx` manually.**

## Status bar configuration

To enable the status bar, you must add the `with-status-bar` attribute to the grid. This requires AG Grid Enterprise licensing and module registration.

When you enable the status bar without providing an explicit `:statusBarConfig` property, the grid uses the default configuration. This default configuration enables the following features:

- `rows`: `true` (displays the row count)
- `aggregation`: `true` (displays aggregation values for selected cells)
- `loadMore`: `true` (displays the load more button)
- `reload`: `true` (displays the reload button)
- `maxRows`: `false` (disables the maximum rows limit display)

###### Examples

You can customize the status bar by passing a `GridProStatusBarConfig` object to the `:statusBarConfig` property.

```typescript
import { GridProStatusBarConfig } from '@genesislcap/grid-pro';

const customConfig: GridProStatusBarConfig = {
  rows: true,
  aggregation: false,
  loadMore: false,
  reload: true,
};
```

```html
<rapid-grid-pro
  with-status-bar
  :statusBarConfig="${x => x.customConfig}"
></rapid-grid-pro>
```

### Row count in server-side infinite scroll

When using the server-side row model with infinite scrolling, the status bar displays the number of currently loaded rows. If the total row count is known or returned by the server, the status bar updates to reflect the total count.
