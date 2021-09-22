---
sidebar_position: 4
title: DbToGenesis Postgres example
sidebar_label: DbToGenesis Postgres example
id: dbtogenesis-postgres

---
These examples assume that the *plpgsql* language is already installed in the respective PostgreSQL database.

**Create TRADE table**

```sql
DROP TABLE "POSITION";
CREATE TABLE "POSITION"("NET_POSITION" decimal  ,
"POSITION_ID" varchar(80)  ,
"LAST_UPDATED" timestamp DEFAULT clock_timestamp() ,
"TIMESTAMP" bigint  ,
"INSTRUMENT_ID" varchar(80)  ,
"POSITION_VALUE" decimal  ,
CONSTRAINT "POSITION_ID_PK" PRIMARY KEY("POSITION_ID"));
    GO
```

**Insert, modify and delete stored procedures**

```sql
CREATE OR REPLACE FUNCTION "insertPosition"(p_NetPosition decimal,
p_PositionId varchar(80),
p_LastUpdated timestamp,
p_Timestamp bigint,
p_InstrumentId varchar(80),
p_PositionValue decimal) RETURNS void AS $$
BEGIN
INSERT INTO "POSITION" ("NET_POSITION","POSITION_ID","LAST_UPDATED","TIMESTAMP","INSTRUMENT_ID","POSITION_VALUE")
VALUES (p_NetPosition,p_PositionId,p_LastUpdated,p_Timestamp,p_InstrumentId,p_PositionValue);
END
$$ LANGUAGE plpgsql;
```