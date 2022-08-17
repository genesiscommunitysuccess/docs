---
title: 'Configuring Runtime'
sidebar_label: 'Configuring Runtime'
id: configuring-runtime
---

[Introduction](/server-modules/integration/data-pipeline/introduction/)  | [Basics](/server-modules/integration/data-pipeline/basics) | [Advanced](/server-modules/integration/data-pipeline/advanced) | [Examples](/server-modules/integration/data-pipeline/examples) | [Configuring runtime](/server-modules/integration/data-pipeline/configuring-runtime) | [Testing](/server-modules/integration/data-pipeline/testing)

## Configure processes.xml file
Data pipeline is a separate module that must be configured in your __application__**-processes.xml** file. Here is a sample configuration:

```xml
<processes>
    <process name="DATAPIPELINE_SANDBOX">
        <groupId>data-pipeline</groupId>
        <start>true</start>
        <options>-Xmx1024m</options>
        <module>genesis-pal-datapipeline</module>
        <script>trades-datapipeline.kts</script>
        <description>Trades execution</description>
        <language>pal</language>
        <loggingLevel>TRACE,DATADUMP_ON</loggingLevel>
    </process>
</processes>
```

## System definitions
It is vital to ensure that any system definition variables that are used by the configuration definition are properly defined in your __application__**-system-definition.kts** file.

## Starting source PostgreSQL as a Docker image
To capture changes from PostgreSQL, the Write Ahead Log level has to be set at least to `logical`. By default, the PostgreSQL docker image has its Log Level set at level lower than this; thus you must specify it explicitly when the image is run:

```shell
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c wal_level=logical
```
