---
id: genesistodb-mssql
title: MSSQL DtaToDb sample
sidebar_label: MSSQL example
sidebar_position: 3

---

**Create TRADE table**

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

**Insert, modify and delete stored procedures**

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
