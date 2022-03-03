---
sidebar_position: 3
title: DbToGenesis MSQL example
sidebar_label: DbToGenesis MSQL example
id: dbtogenesis-mssql

---
**Create TRADE table**

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

**Insert, modify and delete stored procedures**

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

**Create or replace the modifyTrade procedure**

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

**Create or replace the deleteTrade procedure**

```sql
create or replace PROCEDURE deleteTrade(p_tradeid IN ALL_TRADES.TRADE_ID%TYPE)
                    IS
                    BEGIN

                        DELETE FROM ALL_TRADES
                        WHERE TRADE_ID = p_tradeid;

                        COMMIT;
                    END;
```