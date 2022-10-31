---
title: Postgres data pipeline - Prepare the Source Data
sidebar_label: Prepare the Source Data
sidebar_position: 3
id: source-data
keywords: [getting started, quick start, postgres data pipeline, source data]
tags:
    - getting started
    - quick start
    - postgres data pipeline
    - source data
---

The source data comes from a PostgreSQL server that has to meet the minimal configuration mentioned [here](/server/integration/data-pipeline/advanced/#postgresql-configuration-1).

## PostgreSQL in Docker

Docker is a simple way to start playing with a local database and data pipelines. To capture changes from PostgreSQL, the Write Ahead Log level has to be set at least to `logical`. By default, the PostgreSQL docker image has its Log Level set at level lower than this; thus you must specify it explicitly when the image is run:

```shell
docker run -tid -p 5432:5432 -e POSTGRES_PASSWORD=docker -e PGDATA=/tmp postgres:12.6-alpine -c wal_level=logical
```

## Database Table

Following is the SQL to create the table that will be used as a data source. Any record inserted in the table will be processed by the data pipeline in the Genesis platform:

```sql
CREATE TYPE valid_sides AS ENUM ('buy', 'sell');
CREATE TYPE valid_states AS ENUM ('new', 'mod', 'canc');

CREATE TABLE trades (
  trd_id  VARCHAR ( 12 ) PRIMARY KEY,
  inst VARCHAR ( 5 ) NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  quantity INTEGER NOT NULL,
  side VALID_SIDES NOT NULL,
  traded_at TIMESTAMP NOT NULL,
  trader VARCHAR (30) NOT NULL,
  trade_state valid_states NOT NULL,
  unsolicited BOOL,
  orig_trd_id VARCHAR (12),
  trade_notes VARCHAR (500)
);
```