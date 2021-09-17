---
sidebar_position: 1
title: DbToGenesis
sidebar_label: Introduction
id: dbtogenesis

---
##  DbToGenesis

The **DbToGenesis** module provides a way of streaming data from a classic RDBMS database, such as Oracle or MSSQL, to a Genesis database.

The process listens to changes in the SQL tables (insert, modify and delete) using a predefined system (triggers for each table to be streamed, procedures and a table to represent an update queue) and reproduces them immediately in the selected Genesis table.

### Arguments

Use **startProces**s to start the **DbToGenesis** process. This can take two optional arguments.

**--clearTex**t can be passed if you want to use clear text user and passwords in the configuration file, instead of encrypted ones.

**--force** if passed to the process, this  attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

### Configuration

The configuration is similar to **GenesisToDb** (and other Genesis modules). It can be configured through the standard Genesis configuration XML files.

There are two well defined sections: process configuration and database stream configurations.

The process definition is made up of several fields that will set up the main configuration of the process:

_preExpression_ defines dynamic groovy code (methods, imports, etc.) you can add to this module for further usage.

    xml
    
        <options>
    
            <databaseType>MSSQL</databaseType>
    
            <url>jdbc:sqlserver://host.ad.company:1433;databaseName=DB_NAME;</url>
    
            <user>6487f8a8b25986efa34a4906332e7998606acd235b06b7ae2e8acfc0c31</user>
    
            <password>db3b7fc7009c86cfa1b8e8b37811594094535b4df9c57b61a9bad169332e1f7c</password>
    
            <dbMinConnections>10</dbMinConnections>
    
            <dbMaxConnections>10</dbMaxConnections>
    
        </options>
    

* **options** is a field container that represents the basic behaviour and database configuration of the process.
* * **databaseType** can be set to ORACLE, MSSQL or POSTGRES.
* * **url** represents the database url to connect to using the JDBC driver. The url definition will be different depending on the databaseType:
*   * POSTGRES - \`\`\`<url>jdbc:postgresql://IP_ADDRESS:PORT/DATABASE_NAME</url>\`\`\`
*   * MSSQL - \`\`\`<url>jdbc:sqlserver://IP_ADDRESS:PORT;databaseName=DATABASE_NAME;</url>\`\`\`
*   * ORACLE - \`\`\`<url>jdbc:oracle:thin:@IP_ADDRESS:PORT:DATABASE_NAME</url>\`\`\`
* * **user** user from RDBMS. Encrypted by command line tool \`\`\`encryptUserPass\`\`\`.
* * **password** password from RDBMS. Encrypted by command line tool \`\`\`encryptUserPass\`\`\`.
* * **dbMinConnections** represents the minimum number of RDBMS connections that will be created on startup  inside each pool partition. Default: 10.
* * **dbMaxConnections** sets the maximum number of connections to be created by the RDBMS connection pool. Default: 10.
* 
* **genesisStream** represents one stream from the RDBMS to Genesis. It specifies the fields to be inserted or modified in Genesis, from which TABLE to which TABLE is the data streamed, and it also specifies the stored procedures calls to be used in the . We can define as many genesisStreams as we want. It has a name attribute to differentiate genesisStreams from each other.
* * **from** is the table from the RDBMS to stream data from.
* * **to** contains the table from Genesis to write data into.
* * **GenesisPrimaryKeyId** represents the primary key to access records from the "**to**" Genesis table. In most of the cases, this key should be called TABLENAME_BY_EXTERNAL_ID, as every table in Genesis needs to have an EXTERNAL_ID field with very own key in order to work with a DbToGenesis module.
* * **rdbmsPrimarykey** is the primary key field which represents the primary key (or a secondary key for the same purpose) in the RDBMS. It should be a single column key with a unique identifier. This value will end up stored in a field called EXTERNAL_ID that **must** be part of the "**to**" table in Genesis.
* * **rdbmsTimestampField** contains the timestamp field from the RDBMS table (not the UPDATEQUEUE table). It is normally called TIMESTAMP and it is **mandatory** for the module to work correctly, as it relies on the last read TIMESTAMP to maintain consistency between the RDBMS database and Genesis.**Very important**: if you insert this timestamp field into the Genesis table and the field is also a key, there can be clashes if two records have a timestamp with the same number of milliseconds. Try to avoid this situation by deleting this key from the Genesis table.
* * **generateCreatedInfo** is used to get extra information for every transaction. If set to true, it will write some extra info to our Genesis records: CREATED_AT (TIMESTAMP) and CREATED_BY(STRING). It is important to note that both fields must exist in the Genesis table in order to write these.
* * **metaData** represents a field list to be set in a Genesis record and ultimately represents the final row to be inserted in the Genesis table. Field names must be column names in the "**from**" table and type must be a proper Genesis column type.
* * **proc** contains the store procedure calls for each of the use cases: query the update queue, clear the update queue, load the table into Genesis for the first time (or if we force a reload) and retrieve a particular record from the selected table. The standard JDBC call to RDBMS store procedures is standardised as *{call procedure(param1,param2,param3)}* and such standard will be followed in this configuration too. There is no need to hardcode any parameter, as they will be set up in runtime.
*  * **queryQueue** calls a stored procedure which is passed two parameters in order: the table name (e.g. 'TRADE') and a timestamp. This procedure should return all rows stored the SQL UpdateQueue table with the same TABLE_NAME argument and with a bigger timestamp than the timestamp argument.
*  **clearQueu**e works the same way as the previous store procedure, but instead of returning rows, it deletes all the rows found in the SQL UpdateQueue table matching the same table name and a smaller or equal timestamp value. This procedure ensures we keep the UpdateQueue within a reasonable size after we have retrieved and applied the latest changes in Genesis.
* **loadTable** has no arguments; it  simply returns every row stored in the selected SQL table, in our example it would be TRADE.
* **retrieveRecord** receives one argument, which represents a primary key in the chosen SQL table ('TRADE') and returns this row.

Example for MSSQL procedure calls: