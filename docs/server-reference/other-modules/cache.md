---
sidebar_position: 3
title: Cache
sidebar_label: Cache
id: cache

---

Database caching on local microserviceis supported out of the box. You can configure a caching layer for any Genesis module. The cache can reduce the database workload for tables that contain static data.

\## Configuration

The caching mechanism applies to single-record database look-up operations across the whole microservice runtime.

The cache definition  can exist in xml format,  inside the process config file itself.  (i.e. used in xml-based configurations like consolidator2.) Alternatively, you can define it in a GPAL format. The GPAL format is generally used for microservices using a GPAL script (defined in the <script> attribute in processes.xml) and this file will be defined in the <config> attribute of the process definition. The GPAL file naming convention is:

 _application_**-process-config.kts**

The available options for both XML and GPAL are:

\**expireAfterWrite** represents the period of time that an entry will be cached since the last time it was written (or replaced). **timeUnit** attribute specifies the kind of period to be used (NANOSECONDS, MICROSECONDS, MILLISECONDS, SECONDS, MINUTES, HOURS or DAYS) being SECONDS the default value. Default: 600 seconds.

\**expireAfterAccess** the period of time that an entry will be cached since the last time it was read. Uses **timeUnit** attribute like **expireAfterWrite** to define the kind of period. Default: 300 seconds.

\**initialCapacity** is the number of entries the cache will be able to hold without extending its size since the start of the process. Default: 10000.

\**maximumEntries** is the limit of entries we can hold in our cache. If the limit is achieved, entries will be replaced with an LRU algorithm. Default: 10000.

\**concurrencyLevel** sets the way the cache is structured internally, so it affect the amount of concurrency we can achieve with multi-threaded operations. It is a sensitive configuration parameter and can potentially worsen performance so should be used only for tweaking with care or not used at all. Default: 4.

\**multipleKeys** if we set this to "true", any call to a record with any of its keys will hit cache as long as the record is in it (handy but involves data duplication). Otherwise, a call must use the same key it was used previously to retrieve a record from cache or we will have to reload the record from database (more efficient if the same keys are going to be used every time). Default: true

\**update** only available in cache and **not bulkCache**. It will update cached records when they are modified in our database. Default: false.

\**insertNewEntries** if set to true, it will force the caching of new records inserted for each table. Standard behaviour won't cache records inserted if they haven't been read before. This feature is also not available in **bulkCache**. Default: false.

\**tables** can define loadOnStart as true, if we want to pre-load the whole table in cache before the process starts. Default: false.