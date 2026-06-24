# Proposed docs change: Datasource attributes

Requested ACTION: ADD

**Automatic UPDATE was skipped: the generated section (416 non-space chars) is much smaller than the existing one (10005) and would delete content. Review and apply this to `docs/001_develop/03_client-capabilities/005_grids/003_grid-pro/grid-pro_02_datasources.mdx` manually.**

## Datasource attributes

### Resource attributes

| Attribute | Type | Description | Default |
|---|---|---|---|
| `resource-name` | `string` | The name of the back-end resource to connect to. | None |
| `polling-interval` | `number` | The interval in milliseconds at which the Request Server is polled. Polling applies to Request Server resources only; Data Server resources update in real time. | `10000` |
| `criteria` | `string` | Groovy-style criteria to filter the data on the server. | None |
