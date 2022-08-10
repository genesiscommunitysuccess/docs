---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server-modules/integration/database-streaming-in/introduction)  | [Basics](/server-modules/integration/database-streaming-in/basics) | [Advanced](/server-modules/integration/database-streaming-in/advanced) | [Examples](/server-modules/integration/database-streaming-in/examples) | [Configuring runtime](/server-modules/integration/database-streaming-in/configuring-runtime) | [Testing](/server-modules/integration/database-streaming-in/testing)

## DbToGenesis

The `DbToGenesis` component provides a way of streaming data from a classic RDBMS database, such as Oracle or MSSQL, to a Genesis database.

The process listens to changes in the SQL tables (insert, modify and delete) using a predefined system (triggers for each table to be streamed, procedures and a table to represent an update queue). It then reproduces the changes immediately in the selected Genesis table.

Broadly, you need to do the following things to make `DbToGenesis` work:

1. Configure `DbToGenesis` so that it has the relevant field and table structures to accept the incoming data.

2. Set up one or more streams, each of which defines a source table and a destination table in Genesis.

3. Include routines for handling the relevant insert, modify and delete actions.

Once you have done this, you can run the `DbToGenesis` command to start the process.

## Configuration

You can configure `DbToGenesis` in an xml file called _application_**-dbtogenesis.xml**. This must be located in your application's **CFG** directory.

There are two clear sections: 

- process definition
- database stream configuration

### Process definition

The process definition is made up of several fields that set up the main configuration of the process:

_preExpression_ defines dynamic groovy code (methods, imports, etc.) you can add to this module for further usage.

```xml
<options>
    <databaseType>MSSQL</databaseType>
    <url>jdbc:sqlserver://host.ad.company:1433;databaseName=DB_NAME;</url>
    <user>6487f8a8b25986efa34a4906332e7998606acd235b06b7ae2e8acfc0c31</user>
    <password>db3b7fc7009c86cfa1b8e8b37811594094535b4df9c57b61a9bad169332e1f7c</password>
    <dbMinConnections>10</dbMinConnections>
    <dbMaxConnections>10</dbMaxConnections>
</options>
```

* `options` is a field container that represents the basic behaviour and database configuration of the process.
* `databaseType` can be set to `ORACLE`, `MSSQL` or `POSTGRES`.
* `url` represents the database url to connect to using the JDBC driver. The url definition depends on the **databaseType**:
  * POSTGRES - ```<url>jdbc:postgresql://IP_ADDRESS:PORT/DATABASE_NAME</url>```
  * MSSQL - ```<url>jdbc:sqlserver://IP_ADDRESS:PORT;databaseName=DATABASE_NAME;</url>```
  * ORACLE - ```<url>jdbc:oracle:thin:@IP_ADDRESS:PORT:DATABASE_NAME</url>```
* `user` user from RDBMS. Encrypted by the command line tool `encryptUserPass`.
* `password` password from RDBMS. Encrypted by the command line tool `encryptUserPass`.
* `dbMinConnections` represents the minimum number of RDBMS connections that will be created on start-up inside each pool partition. Default: 10.
* `dbMaxConnections` sets the maximum number of connections to be created by the RDBMS connection pool. Default: 10.

### Database stream definition
In this section, you define the precise details of the incoming stream or streams.

* `genesisStream` represents a single stream from the RDBMS to Genesis. It specifies the fields to be inserted or modified in Genesis: _from_ which TABLE _to_ which TABLE is the data streamed. It also specifies the stored procedure calls to be used in the RDBMS system. You can define as many **genesisStream**s as you want. Each one has a name attribute to differentiate one stream from another.
* `from` is the table in the RDBMS to stream data from (the source table).
* `to` is the table in Genesis to write data into (the destination table).
* `GenesisPrimaryKeyId` is the primary key to access records from the **to** Genesis table. In most cases, this key should be called `TABLENAME_BY_EXTERNAL_ID`. Every table in Genesis needs to have an `EXTERNAL_ID` field with_ own key in order to work with a `DbToGenesis` module.
* `rdbmsPrimarykey` is the primary key field, which represents the primary key (or a secondary key for the same purpose) in the RDBMS. It should be a single column key with a unique identifier. This value will end up stored in a field called `EXTERNAL_ID` that **must** be part of the **to** table in Genesis.
* `rdbmsTimestampField` contains the timestamp field from the RDBMS table (not the `UPDATEQUEUE` table). It is normally called `TIMESTAMP` and it is **mandatory** for the module to work correctly, as it relies on the last-read TIMESTAMP to maintain consistency between the RDBMS database and Genesis.  
  **Very important**: if you insert this timestamp field into the Genesis table and the field is also a key, there can be clashes if two records have a timestamp with the same number of milliseconds. You can avoid this situation by deleting this key from the Genesis table.
* `generateCreatedInfo` is used to get extra information for every transaction. If set to **true**, it will write some extra information to our Genesis records: CREATED_AT (TIMESTAMP) and CREATED_BY(STRING). It is important to note that both fields must exist in the Genesis table in order to write these.
* `metaData` represents a field list to be set in a Genesis record, and it ultimately represents the final row to be inserted in the Genesis table. Field names must be column names in the **from** table and **type** must be a valid Genesis column type.
* `proc` contains the stored procedure calls for each of the use cases:  
  query the update queue  
  clear the update queue,  
  load the table into Genesis for the first time (or if we force a reload)  
  retrieve a particular record from the selected table.  
  The standard JDBC call to RDBMS store procedures is standardised as _{call procedure(param1,param2,param3)}_ This standard is followed in the Genesis configuration. There is no need to hard-code any parameter, as these are set up at runtime.
* `queryQueue` calls a stored procedure which is passed two parameters in order: the table name (e.g. 'TRADE') and a timestamp. This procedure should return all rows stored the SQL `UpdateQueue` table with the same TABLE_NAME argument and with a bigger timestamp than the timestamp argument.
* `clearQueue` works the same way as the previous store procedure, but instead of returning rows, it deletes all the rows found in the SQL `UpdateQueue` table matching the same table name and a smaller or equal timestamp value. This procedure ensures the system can keep the `UpdateQueue` within a reasonable size after the latest changes have been retrieved and applied in Genesis.
* `loadTable` has no arguments; it  simply returns every row stored in the selected SQL table; in our example, it would be TRADE.
* `retrieveRecord` receives one argument, which represents a primary key in the chosen SQL table ('TRADE'); it returns this row.

Below is an example for MSSQL procedure calls. We have defined a single `genesisStream` called `TRADE`.

```xml
<genesisStream name="TRADE">

    <from>TRADE</from>
    <to>TRADE</to>

    <GenesisPrimaryKeyId>TRADE_BY_EXTERNAL_ID</GenesisPrimaryKeyId>
    <rdbmsPrimarykey>TRADE_ID</rdbmsPrimarykey>
    <rdbmsTimestampField>TIMESTAMP</rdbmsTimestampField>
    <generateCreatedInfo>true</generateCreatedInfo>


    <metaData>
        <field name="TRADE_ID" type="STRING" />
        <field name="CURRENCY_DESCRIPTION" type="STRING" />
        <field name="CLIENT_NAME" type="STRING" />
        <field name="TRADE_QUANTITY" type="INT" />
        <field name="TRADE_TIMESTAMP" type="DATETIME" />
    </metaData>

    <proc>
        <queryQueue>
            <![CDATA[
                {call queryUpdateQueue(?, ?)}
            ]]>
        </queryQueue>
        <clearQueue>
            <![CDATA[
                {call clearUpdateQueue(?, ?)}
            ]]>
        </clearQueue>
        <loadTable>
            <![CDATA[
                {call getTableTrade()}
            ]]>
        </loadTable>
        <retrieveRecord>
            <![CDATA[
                {call getTrade(?)}
            ]]>
        </retrieveRecord>
    </proc>

</genesisStream>
```

### Important notes

A table must exist for each **genesisStream** in Genesis, and an **UPDATEQUEUE** table must exist in the RDBMS to keep track of the changes.

The source table must necessarily have at least as many fields as the **configuration metaData** specifies, using the same name.

In addition, each database needs to have a table that is able to store table modifications as soon as they happen (insertions, updates and deletions). This enables **DbToGenesis** to keep track and replicate the changes into Genesis.

This table has no name requirement (although it is referred as UPDATEQUEUE for simplicity), as the **queryQueue** and **clearQueue** stored procedures will call it internally. However, the structure has to be fixed in order to retrieve data from it. The basic structure is defined in a later section.

Therefore, you have to implement a trigger (or, if necessary, more than one) for each required table so it inserts new events in the UPDATEQUEUE for each inserted, modified and deleted row.

\*_The stored procedures for queryQueue, clearQueue, loadTable and retrieveRecord should also be created beforehand_*.

This process does not create any stored procedures and it just attempts to call already existing ones. Therefore:

* **loadTable** should read rows from the chosen table ('TRADE')
* **queryQueue** should read a trade from the so-called UPDATEQUEUE table into its correspondent TRADE table, and likewise for the rest of the stored procedures.

## Basic workflow

The process works in the the following order:

1. The process starts and tries to load the full SQL table using the **loadTable** stored procedure if this is the first time it is started (or if you use the **--force** argument). Otherwise, it skips this step and goes to step 2.
2. The process reads rows from UPDATEQUEUE using **queryQueue** and the last known timestamp from the last retrieved record, and processes them accordingly.
3. The process retrieves rows from the correspondent table using **retrieveRecord** and performs insert, modify or delete operations in Genesis accordingly.
4. The process deletes records in the UPDATEQUEUE using **clearQueue** and the last known timestamp, as they have no use any more. The process then goes back to step 2.

