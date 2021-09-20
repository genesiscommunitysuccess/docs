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
* in GPAL format. The GPAL format is generally used for microservices using a GPAL script (defined in the **script** attribute in **processes.xm**l). The cache file is defined in the **config** attribute of the process definition. The GPAL file naming convention is: _application_**-process-config.kts**

The available options for both XML and GPAL are:

**expireAfterWrit**e the period of time that an entry will be cached following the last time it was written (or replaced). The **timeUnit** attribute specifies the unit of time for the period (NANOSECONDS, MICROSECONDS, MILLISECONDS, SECONDS, MINUTES, HOURS or DAYS). SECONDS is the default value. Default: 600 seconds.

**expireAfterAccess** the period of time that an entry will be cached since the last time it was read. This option uses the **timeUnit** attribute in the same way as **expireAfterWrite** to define the unit of time for the period. Default: 300 seconds.

**initialCapacity** is the number of entries the cache will be able to hold without extending its size since the start of the process. Default: 10000.

**maximumEntries** is the limit of entries we can hold in our cache. If the limit is achieved, entries will be replaced with an LRU algorithm. Default: 10000.

**concurrencyLevel** sets the way the cache is structured internally, so it controls the extent of concurrency that is achieved with multi-threaded operations. It is a sensitive configuration parameter and can potentially worsen performance. Use it for fine-tuning - or not at all. You have been waned! Default: 4.

**multipleKeys** if you set this to **true**, any call to a record with any of its keys will hit cache as long as the record is in it (this is handy, but involves data duplication). Otherwise, a call must use the same key that was used previously to retrieve a record from cache or you will have to reload the record from database (this is more efficient if the same keys are going to be used every time). Default: true

**update** this is only available in **cache** and not **bulkCache**. It will update cached records when they are modified in the database. Default: false.

insertNewEntrie if you set this to true, it will force the caching of new records inserted for each table. Standard behaviour won't cache records inserted if they haven't been read before. This feature is also not available in **bulkCache**. Default: false.

**tables** can define **loadOnStart** as true, if you want to pre-load the whole table in cache before the process starts. Default: false.

xml example

GPAL example

    kotlin
    import java.util.concurrent.TimeUnit
    
    process {
    
        systemDefinition {
            item(name = "DbHost", value = "localhost")
            item(name = "ClusterPort", value = "5678")
        }
    
        cacheConfig {
            expireAfterAccess(1, TimeUnit.DAYS)
            expireAfterWrite(1, TimeUnit.DAYS)
    
            initialCapacity = 20_000
            maximumEntries = 30_000
            multipleKeys = true
    
            tables {
                table(TRADE, loadOnStart = true)
                table(INSTRUMENT, loadOnStart = true)
                table(ALT_INSTRUMENT_ID, loadOnStart = true)
                table(MARKET, loadOnStart = true)
                table(EXCHANGE, loadOnStart = true)
                table(CURRENCY, loadOnStart = true)
            }
        }
    }

As the example shows, the GPAL process-config file can override system definition values on a per microservice basis as well.

Note: If no configuration is found at all for a process, or some fields are missing, the internal cache configuration will be filled with default values for every missing parameter. You can still use the database cache programmatically by adding tables manually in the code base using \`\`\`db.getCache().addTable("TABLE")\`\`\`.