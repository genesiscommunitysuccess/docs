---
sidebar_position: 2
title: FoundationDb
sidebar_label: FoundationDb
id: foundationdb

---

Genesis provides two databases built on FoundationDB.

FDB and FDB2 are equivalent in terms of configuration, but they store data using a different data model. 

- FDB uses a separate key-value for each table column. 
- FDB2 stores all data in a single key-value. 

Each mode has implications in terms of database limitations, as FDB can only store a maximum of 10MB data per transaction and 1MB data per key-value. 

Therefore, for applications using small table records, FDB2 will be more efficient. For applications using large table records, FDB will be more efficient.

## System definitions
For FDB and FDB2 layers, there are additional system definition items that you can apply in the [**genesis-system-definitions.kts**](/creating-applications/configure-runtime/system-definitions/) file:


| Setting   | Description   |
|----------|-------------|
| `FdbClusterFile` | A path to an **fdb.cluster** file. If this item is not defined, the default **fdb.cluster** file will be used. This file is located in  /_etc_/**foundationdb/fdb.cluster**. |
| `DbNamespace` | This provides a name for the internal FDB directory to use. |  
| `DbThreadsMin` | This sets the minimum number of threads to be created in the FDB layer thread pool. |
| `DbThreadsMax` | This sets the maximum number of threads to be created in the FDB layer thread pool. |  
| `DbThreadKeepAliveSeconds` | This sets how many seconds a thread created over the `DbThreadsMin` value can live. If a thread is idle for a total of `DbThreadKeepAliveSeconds` and it was created as an additional thread (i.e. outside the `DbThreadsMin` threshold), it will be destroyed. |