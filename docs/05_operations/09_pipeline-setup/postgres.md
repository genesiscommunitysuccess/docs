---
title: 'Pipeline setup - Postgres'
sidebar_label: 'PostgreSQL'
id: postgres
sidebar_position: 2
keywords: [operations, pipeline, setup, postgres, postgresql]
tags:
    - operations
    - pipeline
    - setup
    - postgres
    - postgresql
---

## PostgreSQL configuration
To capture changes from PostgreSQL, the Write Ahead Log level has to be set at least to `logical`, and the plugin used for logical decoding must be `pgoutput` (which is the default plugin that PostgreSQL uses).

## Replaying PostgreSQL rows
While processing source data, Genesis keeps track of the last processed row. If the server gets restarted, it will use the last recorded offset to know where in the source information it should resume reading from.  The offsets are kept in a table called `DATAPIPELINE_OFFSET` and there is one record per connector. If you want to start ingesting the rows from the beginning, delete the row with the name of the source connector and restart the Genesis server.