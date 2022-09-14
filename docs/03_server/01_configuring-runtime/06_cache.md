---
title: 'Cache'
sidebar_label: 'Cache'
id: cache
---


Database caching on local modules is supported out of the box. You can configure a caching layer for any Genesis module. The cache can reduce the database workload for tables that contain static data.

## Configuration

The caching mechanism applies to single-record database-look-up operations across the whole module runtime.

There two ways of defining the cache for a module:

* in XML format, inside the config file of the process.
* in GPAL format. The GPAL format is generally used for modules using a GPAL script (defined in the **script** attribute in **processes.xml**). The cache file is defined in the **config** attribute of the process definition. The GPAL file naming convention is: _application_**-process-config.kts**

The options for both XML and GPAL are:

* **expireAfterWrite**. The period of time that an entry will be cached following the last time it was written (or replaced). The **timeUnit** attribute specifies the unit of time for the period (NANOSECONDS, MICROSECONDS, MILLISECONDS, SECONDS, MINUTES, HOURS or DAYS). SECONDS is the default value. Default: 600 seconds.
* **expireAfterAccess**. The period of time that an entry will be cached since the last time it was read. This option uses the **timeUnit** attribute in the same way as **expireAfterWrite** to define the unit of time for the period. Default: 300 seconds.
* **initialCapacity**. This is the number of entries the cache will be able to hold without extending its size since the start of the process. Default: 10000.
* **maximumEntries** . This is the limit of entries we can hold in our cache. If the limit is achieved, entries will be replaced with an LRU algorithm. Default: 10000.
* **concurrencyLevel**. This sets the way the cache is structured internally, so it controls the extent of concurrency that is achieved with multi-threaded operations. It is a sensitive configuration parameter and can potentially worsen performance. Use it for fine-tuning - or not at all. You have been warned! Default: 4.
* **multipleKeys. I**f you set this to **true**, any call to a record with any of its keys will hit cache as long as the record is in it (this is handy, but involves data duplication). Otherwise, a call must use the same key that was used previously to retrieve a record from cache or you will have to reload the record from database (this is more efficient if the same keys are going to be used every time). Default: true
* **update**. This setting implies the cache will update currently cached records with the latest information as they are updated in the database layer. Default: false.
* **insertNewEntries**. If you set this to **true**, it will force the caching of new records inserted for each table. Standard behaviour won't cache records inserted if they haven't been read before. Default: false.
* **tables**. This can define **loadOnStart** as true, if you want to pre-load the whole table in cache before the process starts. Default: false.

### XML example
```xml
        <cacheConfig>
    		<cache>
    			<expireAfterWrite timeUnit="SECONDS">600</expireAfterWrite>
    			<expireAfterAccess timeUnit="SECONDS">300</expireAfterAccess>
    			<initialCapacity>10000</initialCapacity>
    			<maximumEntries>10000</maximumEntries>
    			<concurrencyLevel>4</concurrencyLevel>
    			<multipleKeys>true</multipleKeys>
    			<update>false</update>
    			<insertNewEntries>false</insertNewEntries>
    			<tables>
    				<table name="TRADE" />
    				<table name="CLIENT" loadOnStart="true"/>
    			</tables>
    		</cache>
    	</cacheConfig>
```
### GPAL example
```kotlin
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
```

As the example above shows, the GPAL **process-config** file can override system definition values on a per-module basis as well.

### GPAL processes.xml example
```xml
    <process name="GENESIS_AUTH_DATASERVER">
        <groupId>AUTH</groupId>
        <start>true</start>
        <options>-Xmx128m -DXSD_VALIDATE=false</options>
        <module>pal-dataserver</module>
        <package>global.genesis.dataserver.pal</package>
        <config>auth-process-config.kts</config>
        <script>auth-dataserver.kts</script>
        <description>Displays real-time authentication/authorisation details</description>
        <language>pal</language>
    </process>
```

Note: If no configuration is found at all for a process, or if some fields are missing, the internal cache configuration will be filled with default values for every missing parameter. You can still use the database cache programmatically by adding tables manually in the code base using \`\`\`db.getCache().addTable("TABLE")\`\`\`.
