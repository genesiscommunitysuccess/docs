# Docs update needed: remap command
Requested ACTION: ADD

**Could not auto-detect the doc target — please move this snippet to the right page.**

## `remap`

The `remap` command applies schema changes to your database.

###### Syntax

| Argument | Mandatory | Description | Restricted values | Default |
|---|---|---|---|---|
| `-m`, `--metadata-only` | no | Updates only the database metadata without altering table structures. | none | none |

###### Examples

To run a remap that only updates the metadata:

```bash
remap --metadata-only
```

To run the same command using the short-form flag:

```bash
remap -m
```
