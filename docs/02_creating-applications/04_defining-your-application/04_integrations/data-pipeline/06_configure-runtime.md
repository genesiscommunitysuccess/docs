---
sidebar_position: 6
title: Configure runtime
sidebar_label: Configure runtime
id: datapipeline-runtime

---

[Introduction](/creating-applications/defining-your-application/integrations/data-pipeline/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-testing/)

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
To capture changes from PostgreSQL, the Write Ahead Log level has to be set at least to `logical`. By default, the postgres docker image is set at lower level, so you must specify it explicitly when the image is run.

```shell
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c wal_level=logical
```
