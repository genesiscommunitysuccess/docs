---
title: 'FoundationDb'
sidebar_label: 'FoundationDb'
id: foundationdb
---

FoundationDb
============

Genesis provides two databases built on FoundationDB.

FDB and FDB2 are equivalent in terms of configuration, but they store data using a different data model.

-   FDB uses a separate key-value for each table column.
-   FDB2 stores all data in a single key-value.

Each mode has implications in terms of database limitations, as FDB can only store a maximum of 10MB data per transaction and 1MB data per key-value.

Therefore, for applications using small table records, FDB2 will be more efficient. For applications using large table records, FDB will be more efficient.

System definitions[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/foundationdb/#system-definitions "Direct link to heading")
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

For FDB and FDB2 layers, there are additional system definition items that you can apply in the [genesis-system-definitions.kts](https://docs.genesis.global/secure/creating-applications/configure-runtime/system-definitions/) file:

| Setting | Description |
| --- | --- |
| `FdbClusterFile` | A path to an fdb.cluster file. If this item is not defined, the default fdb.cluster file will be used. This file is located in /*etc*/foundationdb/fdb.cluster. |
| `DbNamespace` | A name for the internal FDB directory to use. |
| `DbThreadsMin` | The minimum number of threads to be created in the FDB layer thread pool. Defaults to the minimum of 4 or the number of processing units |
| `DbThreadsMax` | The maximum number of threads to be created in the FDB layer thread pool. Defaults to the maximum of 4 or the number of processing units multiplied by 2 |
| `DbThreadKeepAliveSeconds` | Sets how many seconds a thread created over the `DbThreadsMin` value can live. If a thread is idle for a total of `DbThreadKeepAliveSeconds` and it was created as an additional thread (i.e. outside the `DbThreadsMin` threshold), it will be destroyed. Defaults to 5 minutes |

Sample configurations[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/foundationdb/#sample-configurations "Direct link to heading")
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Min and max thread count[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/foundationdb/#min-and-max-thread-count "Direct link to heading")

```
systemDefinition {    global {        ...        item(name = "DbThreadsMin", value = "5")        item(name = "DbThreadsMax", value = "15")        ...    }    ...}
```

### Thread timeouts to two minutes[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/foundationdb/#thread-timeouts-to-two-minutes "Direct link to heading")

```
systemDefinition {    global {        ...        item(name = "DbThreadKeepAliveSeconds", value = "120")        ...    }    ...}
```

### Cluster file location on windows[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/foundationdb/#cluster-file-location-on-windows "Direct link to heading")

```
systemDefinition {    global {        ...        item(name = "FdbClusterFile", value = "C:\\Genesis\fdb\fdb.cluster")        ...    }    ...}
```

[](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/overview/)