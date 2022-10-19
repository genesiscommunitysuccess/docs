---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server/integration/database-streaming-out/introduction)  | [Basics](/server/integration/database-streaming-out/basics) | [Advanced](/server/integration/database-streaming-out/advanced) | [Examples](/server/integration/database-streaming-out/examples) | [Configuring runtime](/server/integration/database-streaming-out/configuring-runtime) | [Testing](/server/integration/database-streaming-out/testing)

## Configuration

You can configure GenesisToDb in an xml file called _application_**-genesistodb.xml**. This must be located in your application's **resources/cfg** directory.

The outline of this configuration file is as follows:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<genesisToDb xmlns:xi="http://www.w3.org/2001/XInclude">
    <preExpression>
        <!-- optional dynamic groovy code goes here -->
    </preExpression>
    <options>
        <!-- database configuration options go here -->
    </options>
    <databaseStream>
        <!-- stream configuration goes here -->
    </databaseStream>
</genesisToDb>
```

### Process definition

The process definition is made up of several fields that set up the main configuration of the process:

`preExpression` defines dynamic groovy code (methods, imports, etc.). You can add to this module for further usage:

```xml
<preExpression>
    <![CDATA[

        import global.genesis.commons.model.GenesisSet
        import global.genesis.db.DbRecord

        /*
        * Get market records for the given instrument id
        */

        def getMarkets(instrumentId) {
            def findRec = new DbRecord('MARKET_INSTRUMENT')
            findRec.setString('INSTRUMENT_ID', instrumentId)
            List<DbRecord> recs = db.getRange(findRec, 'MARKET_INSTRUMENT_BY_INSTRUMENT_ID_MARKET_ID').get()
            return recs
        }

    ]]>
</preExpression>
```

`options` is a field container that represents the basic behaviour and database configuration of the process.

* `databaseType` can be set to ORACLE, MSSQL or POSTGRES.
* `url` represents the database url to connect to using the JDBC driver. The url definition specifies the `databaseType`:
    * POSTGRES - `<url>jdbc:postgresql://IP_ADDRESS:PORT/DATABASE_NAME</url>`
    * MSSQL - `<url>jdbc:sqlserver://IP_ADDRESS:PORT;databaseName=DATABASE_NAME;</url>`
    * ORACLE - `<url>jdbc:oracle:thin:@IP_ADDRESS:PORT:DATABASE_NAME</url>`
* `user` user from RDBMS. Encrypted by command line tool `encryptUserPass`.
* `password` password from RDBMS. Encrypted by command line tool `encryptUserPass`.
* `dbMinConnections` represents the minimum number of RDBMS connections that will be created on startup inside each pool partition. Default: 10.
* `dbMaxConnections` sets the maximum number of connections to be created by the RDBMS connection pool. Default: 10.
* `maxOutstanding` sets the threshold for the internal work queue that triggers the process to start logging warnings. Example use case: there are more than `maxOutstanding` records pending to be inserted in the RDBMS. Default: 10000.

```xml
<options>
    <databaseType>ORACLE</databaseType>
    <url>jdbc:oracle:thin:@host.ad.company.com:1521:oracleSid</url>
    <user>6487f8a8b25986efa34a4906332e7998606acd235b06b7ae2e8acfc0c31</user>
    <password>db3b7fc7009c86cfa1b8e8b37811594094535b4df9c57b61a9bad169332e1f7c</password>
    <dbMinConnections>10</dbMinConnections>
    <dbMaxConnections>10</dbMaxConnections>
    <maxOutstanding>100000</maxOutstanding>
</options>
```

`databaseStream` represents one stream from Genesis to the RDBMS. It contains the necessary logic to join different tables if necessary and it sets the fields to be inserted or modified in the RDBMS. It also specifies the stored procedures calls to be used and the parameters ordering used to call them. You can define as many databaseStreams as you want. It has a name attribute to databaseStreams from each other.

* `tables` Similar to DataServer configuration, you can specify a seed Genesis table with its seed key and join it to other Genesis tables so you can get all the data you need. GenesisToDb works with a timestamp system, and it can keep track of the last timestamp processed for each record, so the seedKey should be a timestamp field (e.g. "TIMESTAMP", "DATE_TIMESTAMP", "CREATED_AT", etc.) if you want to take full advantage of GenesisToDb capabilities.
* `fields` is the representation of the SQL row to be written inside the RDBMS. Parameters are ordered by number from first to last. In the example, we could associate "TRADE_ID" with parameter 1, "TRADE_QUANTITY" with parameter 2, and so on.
* `proc` contains the store procedure calls for each of the use cases: insert, modify and delete. The standard JDBC call to RDBMS store procedures is standardised as _{call procedure(param1,param2,param3)}_. The configuration is flexible and allows you to change the parameter order depending on the current call. A stored procedure could be called like this: _insertIdAndClientName(1,3)_ and _modifyQuantity(2)_.

Example:

```xml
<databaseStream name="ALL_TRADES">
  <tables>
    <table name="TRADE"
           alias="t"
           seedKey="TRADE_BY_TIMESTAMP" />
  </tables>
  <fields>
    <![CDATA[
            sproc.setParameter("id", t.getString("TRADE_ID"))
            sproc.setParameter("instrumentid", t.getString("INSTRUMENT_ID"))
            sproc.setParameter("counterpartyid", t.getString("COUNTERPARTY_ID"))
            sproc.setParameter("amount", t.getInteger("QUANTITY"))
            sproc.setParameter("side", t.getString("SIDE"))
            sproc.setParameter("price", t.getDouble("PRICE"))
            sproc.setParameter("date", t.getLong("TRADE_DATETIME"))
            sproc.setParameter("trader", t.getString("ENTERED_BY"))
            sproc.setParameter("status", t.getString("TRADE_STATUS"))
            ]]>
  </fields>
  <proc>
    <insert>
      <![CDATA[
                {call inserttrade(1,2,3,4,5,6,7,8,9)}
                ]]>
    </insert>
    <modify>
      <![CDATA[
                {call updatetrade(1,2,3,4,5,6,7,8,9)}
                ]]>
    </modify>
    <delete>
      <![CDATA[
                {call deletetrade(1)}
                ]]>
    </delete>
  </proc>
</databaseStream>
```

### Process arguments

Use `startProcess` to start the GenesisToDb process (see [Configuring Runtime](/server/integration/database-streaming-out/configuring-runtime/) for more information on how to configure this). This can take two additional optional arguments:

`--clearText` can be passed if you want to use clear text user and passwords in the configuration file, instead of encrypted ones.

`--force` if passed to the process, this  attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

For more information regarding process configuration please see the dedicated page on [Processes](/server/configuring-runtime/processes).

### Table joins

The process keeps track of the last record timestamp, so if you want to avoid reloading all records in Genesis to the RDBMS, it is very important to use a TIMESTAMP seedKey in order to make this work properly.

### Stored procedures

You must have a separate table for each database stream.

Each database must have a table that can hold records as specified in the **fields** field. So, following the previous example with TRADE_ID, TRADE_QUANTIY, CLIENT_NAME and CURRENCY_DESCRIPTION, you must have an SQL table with those column names and matching types. Matching types in this example could be: varchar(50), int, varchar(50) and varchar(50).

_The stored procedures for insert, modify and delete should also be created beforehand_. This process does not create any store procedures; it just attempts to call already existing ones. Therefore, `insertTrade` should insert a trade into its correspondent TRADE table and likewise for the rest of the stored procedures.

## SQL Procedures

Even though Genesis cannot modify these triggers/procedures and they can potentially be implemented in any desired way as long as they behave as expected, it is always useful to have some simple working examples.

* [Oracle sample](/server/integration/database-streaming-out/examples/#oracle-sample)
* [MSSQL sample](/server/integration/database-streaming-out/examples/#mssql-sample)
* [PostgreSQL sample](/server/integration/database-streaming-out/examples/#postgresql-sample)

### Encrypting user and passwords

A script called `encryptUserPass` is provided with Genesis, enabling us to encrypt our user and password before using it in GenesisToDb configuration.