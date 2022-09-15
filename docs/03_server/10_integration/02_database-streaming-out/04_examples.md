---
title: 'Examples'
sidebar_label: 'Examples'
id: examples
---

[Introduction](/server/integration/database-streaming-out/introduction)  | [Basics](/server/integration/database-streaming-out/basics) | [Advanced](/server/integration/database-streaming-out/advanced) | [Examples](/server/integration/database-streaming-out/examples) | [Configuring runtime](/server/integration/database-streaming-out/configuring-runtime) | [Testing](/server/integration/database-streaming-out/testing)

## Oracle Sample

Create TRADE table:

```sql
CREATE TABLE DB_NAME.TRADE
( TRADE_ID varchar2(40) not null,
  CURRENCY_DESCRIPTION varchar2(20) not null,
  CLIENT_NAME  varchar2(40) not null,
  TRADE_TIMESTAMP timestamp(6),
  TRADE_QUANTITY number(38,0),
  CONSTRAINT TRADE_PK PRIMARY KEY (TRADE_ID)
);
```

Insert, modify and delete stored procedures:

```sql
create or replace PROCEDURE insertTrade(
                        p_tradeid IN ALL_TRADES.TRADE_ID%TYPE,
                        p_tradequantity IN ALL_TRADES.TRADE_QUANTITY%TYPE,
                        p_clientname IN ALL_TRADES.CLIENT_NAME%TYPE,
                        p_currencydescription IN ALL_TRADES.CURRENCY_DESCRIPTION%TYPE)
                    IS
                    BEGIN

                        INSERT INTO ALL_TRADES ("TRADE_ID", "TRADE_QUANTITY", "CLIENT_NAME", "CURRENCY_DESCRIPTION")
                        VALUES(p_tradeid, p_tradequantity, p_clientname, p_currencydescription);

                        COMMIT;
                    END;
```
```sql
create or replace PROCEDURE modifyTrade(
                        p_tradeid IN ALL_TRADES.TRADE_ID%TYPE,
                        p_tradequantity IN ALL_TRADES.TRADE_QUANTITY%TYPE,
                        p_clientname IN ALL_TRADES.CLIENT_NAME%TYPE,
                        p_currencydescription IN ALL_TRADES.CURRENCY_DESCRIPTION%TYPE)
                    IS
                    BEGIN

                        UPDATE ALL_TRADES
                        SET TRADE_QUANTITY = p_tradequantity,
                            CLIENT_NAME = p_clientname,
                            CURRENCY_DESCRIPTION = p_currencydescription
                        WHERE TRADE_ID = p_tradeid;

                        COMMIT;
                    END;
```
```sql
create or replace PROCEDURE deleteTrade(p_tradeid IN ALL_TRADES.TRADE_ID%TYPE)
                    IS
                    BEGIN

                        DELETE FROM ALL_TRADES
                        WHERE TRADE_ID = p_tradeid;

                        COMMIT;
                    END;
```

### MSSQL Sample

Create TRADE table:

```sql
CREATE TABLE TRADE
     (
        TRADE_ID           VARCHAR(40)   PRIMARY KEY               NOT NULL  ,
        CURRENCY_DESCRIPTION         VARCHAR(20)           NOT NULL   ,
        CLIENT_NAME          VARCHAR(40)           NOT NULL   ,
        TRADE_QUANTITY       INT            NOT NULL   ,
        TRADE_TIMESTAMP        DATETIME              NOT NULL
     )
GO
```

Insert, modify and delete stored procedures:

```sql
CREATE PROCEDURE insertTrade
    @TradeId varchar(50),
    @TradeQuantity int,
    @ClientName varchar(50),
    @CurrencyDescription varchar(50)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.ALL_TRADES ("TRADE_ID", "TRADE_QUANTITY", "CLIENT_NAME", "CURRENCY_DESCRIPTION")
    VALUES(@TradeId, @TradeQuantity, @ClientName, @CurrencyDescription);

END
GO

CREATE PROCEDURE modifyTrade
    @TradeId varchar(50),
    @TradeQuantity int,
    @ClientName varchar(50),
    @CurrencyDescription varchar(50)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.ALL_TRADES
    SET TRADE_QUANTITY = @TradeQuantity,
        CLIENT_NAME = @ClientName,
        CURRENCY_DESCRIPTION = @CurrencyDescription
    WHERE TRADE_ID = @TradeId;

END
GO

CREATE PROCEDURE deleteTrade
    @TradeId varchar(50)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.ALL_TRADES
    WHERE TRADE_ID = @TradeId;

END
GO

```

### PostgreSQL Sample

N.B. Assumes that the [plpgsql](https://www.postgresql.org/docs/current/plpgsql.html) procedural language is already installed in the respective PostgreSQL database.

Create TRADE table:

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

Insert, modify and delete stored procedures:

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

```sql
CREATE OR REPLACE FUNCTION  "modifyPosition"(p_NetPosition decimal,
p_PositionId varchar(80),
p_LastUpdated timestamp,
p_Timestamp bigint,
p_InstrumentId varchar(80),
p_PositionValue decimal) RETURNS void AS $$
BEGIN
UPDATE "POSITION"
SET
"NET_POSITION" = p_NetPosition,
"POSITION_ID" = p_PositionId,
"LAST_UPDATED" = p_LastUpdated,
"TIMESTAMP" = p_Timestamp,
"INSTRUMENT_ID" = p_InstrumentId,
"POSITION_VALUE" = p_PositionValue
WHERE "POSITION"."POSITION_ID"  = p_PositionId;
END
$$ LANGUAGE plpgsql;
```

```sql
CREATE OR REPLACE FUNCTION  "deletePosition"(p_paramId anyelement) RETURNS void AS $$
BEGIN
DELETE FROM "POSITION"
WHERE "POSITION"."POSITION_ID" = p_paramId;
END
$$ LANGUAGE plpgsql;
```






