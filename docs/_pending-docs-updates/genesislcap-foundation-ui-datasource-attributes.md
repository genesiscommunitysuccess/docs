# Proposed docs change: Datasource attributes

Requested ACTION: UPDATE

**Automatic UPDATE was skipped: the generated section (542 non-space chars) is much smaller than the existing one (10005) and would delete content. Review and apply this to `docs/001_develop/03_client-capabilities/005_grids/003_grid-pro/grid-pro_02_datasources.mdx` manually.**

## Datasource attributes

You can configure the datasource components using the following attributes.

### Resource attributes

These attributes define the connection to the Genesis back-end resource.

| Name | Type | Description | Default |
|---|---|---|---|
| `resource-name` | `string` | The name of the Data Server or Request Server resource. | None |
| `snapshot` | `boolean` | When `true`, retrieves a single snapshot of the data without subscribing to real-time updates. | `false` |

### Component attributes

These attributes configure the behavior of the datasource component.

| Name | Type | Description | Default |
|---|---|---|---|
| `
