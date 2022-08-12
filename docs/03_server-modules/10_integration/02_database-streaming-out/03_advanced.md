---
title: 'Advanced'
sidebar_label: 'Advanced'
id: advanced
---

[Introduction](/server-modules/integration/database-streaming-out/introduction)  | [Basics](/server-modules/integration/database-streaming-out/basics) | [Advanced](/server-modules/integration/database-streaming-out/advanced) | [Examples](/server-modules/integration/database-streaming-out/examples) | [Configuring runtime](/server-modules/integration/database-streaming-out/configuring-runtime) | [Testing](/server-modules/integration/database-streaming-out/testing)

## A practical example

This is a step-by-step example of how to get an Oracle database up and running with **GenesisToDb**.

1. Create INSTRUMENT_L1_PRICE table.

![](/img/dbtogenesis-create-table.png)

1. Create Insert procedure.

![](/img/createinsertprocedure.png)

1. Create Modify procedure.

![](/img/createmodifyprocedure.png)

1. Create Delete table.

![](/img/createdeleteprocedure.png)

Create **GenesisToDb** configuration. **Ensure the xmlns:xi attribute is included inside the "genesisToDb" field if you want to use xinclude in your configuration**.

![](/img/createconfig.png)

## Script `generateSQLToRDB`

`generateSQLToRDB` script is a tool that generates ".sql" files to create tables and procedures in our RDBMS system by reading the current Genesis dictionary. It also adds the pertinent databaseStream configuration to the specified genesistodb.xml configuration file.

It is by no means mandatory, but it provides a generic, quick and working example that can be further modified or extended with ease. However, the Genesis dictionary must be appropriately configured beforehand: TABLENAME_BY_TIMESTAMP key must exist (as shown in previous section examples) inside the table, as well as having a key made of a unique field (e.g "ORDER_ID").

usage: 
```bash
generateSQLToRDB
```

| Argument | Argument long name      | Mandatory |               Description                    | Restricted values         |
|----------|-------------------------|-----------|----------------------------------------------|---------------------------|       
| -cfg     |  --configFile `<arg>`   | No        | genesistodb config xml file to be modified   | No                        |                   
| -dbName  |  --databaseName `<arg>` | No        | the database name for Oracle dbs             | No                        |         
| -dbType  |  --databaseType `<arg>` | No        | the database type                            | MSSQL, ORACLE or POSTGRES |                    
| -f       |  --file `<arg>`         | No        | name of the sql file to export table         | No                        |             
| -h       |  --help                 | No        | show usage information                       | No                        |
| -t       |  --table `<arg>`        | No        | the name of the table to export to csv       | No                        |               

