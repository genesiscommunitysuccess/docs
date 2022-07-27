---
id: deploy
title: Deploy the Application
sidebar_label: Deploy the Application
sidebar_position: 5

---
To deploy your application to your local Linux or WSL environment, see this [guide](/creating-applications/getting-ready-to-develop/running-applications/gradle-deploy/).

To install your application to a remote Test or Prod server, see [this guide.](/creating-applications/getting-ready-to-develop/running-applications/options/manual-installation/)

## See it work

To see records stored in the Genesis database you have to insert new rows in the source database. See the sample SQL insert statement for a single trade:

```sql

INSERT INTO trades(	trd_id, inst, price, quantity, side, traded_at, trader, trade_state, unsolicited, orig_trd_id, trade_notes)
VALUES ('ITS_00000004', 'VOD', 126, 1500, 'sell', '2022-05-25 16:01:01', 'Trader.B', 'new', null, null, 'New trade, existing instrument' );
```

After the trade is inserted go to the host where the Genesis platform is set up and execute [`DbMon`](/managing-applications/operate/on-the-host/helpful-commands/#dbmon-script). Then query the `TRADE` table to see the inserted record. Usfeul operations:
- To see the total count of records use `count` 
- To see all records in the table use `search 1==1`. 
- To query by field use `search <field_name>==<value>`, e.g. `search TRADE_ID=='000000000000013TRLO1'`

Below is a sample session

```shell
$ DbMon

==================================
Genesis Database Monitor
Enter 'help' for a list of commands
==================================
DbMon>table TRADE
DbMon:TRADE>

DbMon:TRADE>count
The table TRADE contains 1 record

DbMon:TRADE>search 1==1
==================================
TRADE
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-07-07 15:46:21.071(n:0,s:2709)      NANO_TIMESTAMP
ENTERED_BY                               Trader.B                                 STRING
INSTRUMENT_ID                            000000000000001INLO1                     STRING
PREV_TRADE_ID                                                                     STRING
PRICE                                    126.0                                    DOUBLE
QUANTITY                                 1500                                     INT
SIDE                                     SELL                                     ENUM[BUY SELL]
TRADE_DATE                               2022-05-25                               DATE
TRADE_DATETIME                           2022-05-25 16:01:01.000 +0000            DATETIME
TRADE_ID                                 000000000000013TRLO1                     STRING
TRADE_STATUS                             NEW                                      ENUM[NEW MODIFIED CANCELLED]
UNSOLICITED                              false                                    BOOLEAN
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1

DbMon:TRADE>search TRADE_ID=='000000000000013TRLO1'
==================================
TRADE
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-07-07 15:46:21.071(n:0,s:2709)      NANO_TIMESTAMP
ENTERED_BY                               Trader.B                                 STRING
INSTRUMENT_ID                            000000000000001INLO1                     STRING
PREV_TRADE_ID                                                                     STRING
PRICE                                    126.0                                    DOUBLE
QUANTITY                                 1500                                     INT
SIDE                                     SELL                                     ENUM[BUY SELL]
TRADE_DATE                               2022-05-25                               DATE
TRADE_DATETIME                           2022-05-25 16:01:01.000 +0000            DATETIME
TRADE_ID                                 000000000000013TRLO1                     STRING
TRADE_STATUS                             NEW                                      ENUM[NEW MODIFIED CANCELLED]
UNSOLICITED                              false                                    BOOLEAN
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
```