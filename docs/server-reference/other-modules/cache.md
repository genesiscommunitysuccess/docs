---
sidebar_position: 3
title: Cache
sidebar_label: Cache
id: cache

---
Database caching on local microservices is supported out of the box. You can configure a caching layer for any Genesis module. The cache can reduce the database workload for tables that contain static data.

## Configuration

The caching mechanism applies to single-record database look-up operations across the whole microservice runtime.

There two ways of defining the cache for a module:

* in xml format,  inside the config file of the process.  
* in GPAL format. The GPAL format is generally used for microservices using a GPAL script (defined in the script attribute in processes.xml). The cache file is defined in the config attribute of the process definition.