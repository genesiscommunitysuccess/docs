---
id: genesistodb
title: genesisToDb
sidebar_label: genesisToDb
sidebar_position: 1

---

This **GenesisToDb** module enables you to stream data from Genesis to classic RDBMS databases, such as Oracle or MSSQL.

The process listens to changes in the Genesis tables (insert, modify and delete) and immediately reproduces them in the selected RDBMS.

### Arguments

Use **startProcess** to start the **GenesisToDb** process. This can take two optional arguments.

**--clearText** can be passed if you want to use clear text user and passwords in our the configuration file, instead of encrypted ones.

**--force** if passed to the process it attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

### Configuration

The configuration is similar to **GenesisToDb** (and other Genesis modules). It can be configured through the standard Genesis configuration XML files.

There are two well defined sections: process configuration and database stream configurations.

The process definition is made up of several fields that will setup the main configuration of the process:

*_preExpression_* defines dynamic groovy code (methods, imports, etc.) you can add to this module for further usage.



```xml
<preExpression>
    <!\[CDATA\[

        import global.genesis.dta.commons.model.DtaSet
        import global.genesis.dta.dta_db.DbRecord

        /*
        * Get market records for the given instrument id
        */

        def getMarkets(instrumentId) {
            def findRec = new DbRecord('MARKET_INSTRUMENT')
            findRec.setString('INSTRUMENT_ID', instrumentId)
            List<DbRecord> recs = db.getRange(findRec, 'MARKET_INSTRUMENT_BY_INSTRUMENT_ID_MARKET_ID').get()
            return recs
        }

    \]\]>
</preExpression>
```

*_options_* is a field container that represents the basic behaviour and database configuration of the process.

* **databaseType** can be set to ORACLE, MSSQL or POSTGRES.

* **url** represents the database url to connect to using the JDBC driver. The url definition specifies the databaseType:

* POSTGRES - `<url>jdbc:postgresql://IP_ADDRESS:PORT/DATABASE_NAME</url>`
* MSSQL - `<url>jdbc:sqlserver://IP_ADDRESS:PORT;databaseName=DATABASE_NAME;</url>`
* ORACLE - `<url>jdbc:oracle:thin:@IP_ADDRESS:PORT:DATABASE_NAME</url>`

* **user** user from RDBMS. Encrypted by command line tool `encryptUserPass`.

* **password** password from RDBMS. Encrypted by command line tool `encryptUserPass`.

* **dbMinConnections** represents the minimum number of RDBMS connections that will be created on startup  inside each pool partition. Default: 10.

* **dbMaxConnections** sets the maximum number of connections to be created by the RDBMS connection pool. Default: 10.

* **maxOutstanding** will be the threshold to reach for the internal work queue from which the process will start logging warnings. Example use case: there are more than maxOutstanding records pending to be inserted in the RDBMS. Default: 10000.

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

*_databaseStream_* represents one stream from Genesis to the RDBMS. It contains the necessary logic to join different tables if necessary and it sets the fields to be inserted or modified in the RDBMS. It also specifies the stored procedures calls to be used and the parameters ordering used to call them. You can define as many databaseStreams as you want. It has a name attribute to databaseStreams from each other.

* **tables** Similar to DataServer configuration, you can specify a seed Genesis table with its seed key and join it to other Genesis tables so you can get all the data you need. GenesisToDb works with a timestamp system, and it can keep track of the last timestamp processed for each record, so the seedKey should be a timestamp field (e.g. "TIMESTAMP", "DATE_TIMESTAMP", "CREATED_AT", etc.) if you want to take full advantage of GenesisToDb capabilities.

* **fields** is the representation of the SQL row to be written inside the RDBMS. Parameters are ordered by number from first to last. In the example we could associate "TRADE_ID" with parameter 1, "TRADE_QUANTITY" with parameter 2, and so on.

* **proc** contains the store procedure calls for each of the use cases: insert, modify and delete. The standard JDBC call to RDBMS store procedures is standardised as _{call procedure(param1,param2,param3)}_. The configuration is flexible and allows to change the parameter order depending on the current call. A stored procedure could be called like: _insertIdAndClientName(1,3)_ and _modifyQuantity(2)_.

Example:

```xml
    <databaseStream name="ALL_TRADES">
        <tables>
            <table name="TRADE"
                   alias="t"
                   seedKey="TRADE_BY_TIMESTAMP" />
            <table name="CLIENT" alias="c">
                <join key="CLIENT_BY_ID">
                    <!\[CDATA\[ c.setString("ID", t.getString("CLIENT_ID")) \]\]>
                </join>
            </table>
            <table name="CURRENCY" alias="cu">
                <join key="CURRENCY_BY_ID">
                    <!\[CDATA\[ cu.setString("ID", t.getString("CURRENCY_ID")) \]\]>
                </join>
            </table>
        </tables>
        <fields>
            <!\[CDATA\[
                sproc.setParameter("TRADE_ID", t.getString("ID"))
                sproc.setParameter("TRADE_QUANTITY", t.getInteger("QUANTITY"))
                sproc.setParameter("CLIENT_NAME", c.getString("NAME"))
                sproc.setParameter("CURRENCY_DESCRIPTION", cu.getString("DESCRIPTION"))
            \]\]>
        </fields>
        <proc>
            <insert>
                <!\[CDATA\[
                    {call insertTrade(1,2,3,4)}
                \]\]>
            </insert>
            <modify>
                <!\[CDATA\[
                    {call modifyTrade(1,2,3,4)}
                \]\]>
            </modify>
            <delete>
                <!\[CDATA\[
                    {call deleteTrade(1)}
                \]\]>
            </delete>
        </proc>
    </databaseStream>
```

### Table joins

The process keeps track of the last record timestamp, so if you want to avoid reloading all records in Genesis to the RDBMS, it is very important to use a TIMESTAMP seedKey in order to make it work properly.

### Stored procedures

You must have a separate table for each database stream.

Each database must have a table that can hold records as specified in the **fields** field. So, following the previous example with TRADE_ID, TRADE_QUANTIY, CLIENT_NAME and CURRENCY_DESCRIPTION, you must have a SQL table with those column names and matching types. Matching types in this example could be: varchar(50), int, varchar(50) and varchar(50).

*_The stored procedures for insert, modify and delete should also be created beforehand_*. This process does not create any store procedures and it just attempts to call already existing ones. Therefore, insertTrade should insert a trade into its correspondent TRADE table and likewise for the rest of the stored procedures.

## SQL Procedures

Even though Genesis cannot modify these triggers/procedures and they can potentially be implemented in any desired way as long as they behave as expected, it is always useful to have some simple working examples.

* [Oracle sample](genesistodb-oracle.md)
* [MSSQL sample](genesistodb-mssql.md)
* [PostgreSQL sample](genesistodb-postgres.md)

### Encrypting user and passwords

A script called "encryptUserPass" is provided with Genesis so we can encrypt our user and password before using it in **GenesisToDb**.

## A practical example

This a step-by-step example of how to get an Oracle database up and running with **GenesisToDb**.

A series of screenshots with examples of how to create tables, stored procedures and genesistodb.xml configuration for dta. The images can be opened in a new tab to see them full size if necessary.

1. Create INSTRUMENT_L1_PRICE table.

!\[\](images/genesistodb/CreateTable.png)

1. Create Insert procedure.

!\[\](images/genesistodb/CreateInsertProcedure.png)

1. Create Modify procedure.

!\[\](images/genesistodb/CreateModifyProcedure.png)

1. Create Delete table.

!\[\](images/genesistodb/CreateDeleteProcedure.png)

1. Create GenesisToDb configuration. **Ensure the xmlns:xi attribute is included inside the "dtaToDb" field if you want to use xinclude in your configuration**.

!\[\](images/genesistodb/CreateConfig.png)

## Script `generateSQLToRDB`

`generateSQLToRDB` script is a tool that generates ".sql" files to create tables and procedures in our RDBMS system by reading the current Genesis dictionary. It also adds the pertinent databaseStream configuration to the specified genesistodb.xml configuration file.

It is by no means mandatory, but it provides a generic, quick and working example that can be further modified or extended with ease. However, the Genesis dictionary must be appropriately configured beforehand: TABLENAME_BY_TIMESTAMP key must exist (as shown in previous section examples) inside the table, as well as having a key made of a unique field (e.g "ORDER_ID").

usage: generateSQLToRDB

```
-cfg,--configFile <arg>        genesistodb config xml file to be modified

-dbName,--databaseName <arg>   the database name for Oracle dbs

-dbType,--databaseType <arg>   the database type: MSSQL,ORACLE or

                                POSTGRES

-f,--file <arg>                name of the sql file to export table

-h,--help                      show usage information

-t,--table <arg>               the name of the table to export to csv

```
