---
id: source-data
title: Prepare the Source Data
sidebar_label: Prepare the Source Data
sidebar_position: 3

---

The source data comes from PosgreSQL server that has to meet the minimal configuration mentioned [here](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-advanced/#postgresql-configuration). If you start PostgreSQL from a Docker image check the notes [here](/creating-applications/defining-your-application/integrations/data-pipeline/datapipeline-runtime/#starting-source-postgresql-as-a-docker-image)

## Database Table

Following is the SQL to create the table that will be used as a data source. Any record inserted in the table will be processed by the data pipeline in the Genesis platform

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