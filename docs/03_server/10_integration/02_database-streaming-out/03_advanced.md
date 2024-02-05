---
title: 'DB Streaming out - advanced'
sidebar_label: 'Advanced'
id: advanced
keywords: [server, integration, database streaming out, advanced]
tags:
  - server
  - integration
  - database streaming out
  - advanced
---

## The generateSQLToRDB script

`generateSQLToRDB` is a tool that generates .sql files to create tables and procedures in our RDBMS system by reading the current Genesis dictionary. It also adds the pertinent databaseStream configuration to the specified **genesistodb.xml** configuration file.

It is by no means mandatory, but it provides a generic, quick and working example that can be further modified or extended with ease. However, the Genesis dictionary must be appropriately configured beforehand: TABLENAME_BY_TIMESTAMP key must exist (as shown in previous section examples) inside the table, as well as having a key made of a unique field (e.g "ORDER_ID").

Usage: 
```bash
generateSQLToRDB [options]
```
<!-- The generateSQLToRDB script has the following arguments: -cfg, -dbName, -dbType, -f, -h, -t -->
| Argument | Argument long name      | Mandatory |               Description                    | Restricted values         |
|----------|-------------------------|-----------|----------------------------------------------|---------------------------|       
| -cfg <!-- generateSQLToRDB -cfg -->    |  --configFile `<arg>` <!-- generateSQLToRDB --configFile <args> -->  | No        | genesistodb config xml file to be modified   | No                        |                   
| -dbName <!-- generateSQLToRDB -dbName --> |  --databaseName `<arg>` <!-- generateSQLToRDB --databaseName <args> --> | No        | the database name for Oracle dbs             | No                        |         
| -dbType <!-- generateSQLToRDB -dbType --> |  --databaseType `<arg>` <!-- generateSQLToRDB --databaseType <args> --> | No        | the database type                            | MSSQL, ORACLE or POSTGRES |                    
| -f <!-- generateSQLToRDB -f -->      |  --file `<arg>` <!-- generateSQLToRDB --file <args> -->        | No        | name of the sql file to export table         | No                        |             
| -h  <!-- generateSQLToRDB -h -->     |  --help <!-- generateSQLToRDB --help -->                | No        | show usage information                       | No                        |
| -t <!-- generateSQLToRDB -t -->      |  --table `<arg>` <!-- generateSQLToRDB --table <args> -->       | No        | the name of the table to export to csv       | No                        |               

