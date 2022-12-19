---
title: 'Database Technology - SQL'
sidebar_label: 'SQL'
id: sql
keywords: [database, technology, sql]
tags:
    - database
    - technology
    - sql
---

SQL support covers PostgreSQL, MS SQL Server and Oracle.

This page covers the common configuration required to get each of these databases working in your Genesis application, although additional configuration is required for PostgreSQL. Additional details can be found on the respective docs.

## System definitions

The following system definition items should be present in your **genesis-system-definitions.kts** file:


| Setting                    | Description                                                                                                                                                                                                                                                                                                                                                              |  
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `DbHost`                   | JDBC URL needed to connect to the SQL database. We accept JDBC URL formats for PostgreSQL and MSSQL. This JDBC URL contains other important information, such as port and target database name                                                                                                                                                                           |
| `DbUsername`               | The db username                                                                                                                                                                                                                                                                                                                                                          |  
| `DbPassword`               | The db password                                                                                                                                                                                                                                                                                                                                                          |
| `DbSqlConnectionPoolSize`  | The maximum number of SQL connections to be held by the SQL connection pool                                                                                                                                                                                                                                                                                              |  
| `DbQuotedIdentifiers`      | If set to true, all SQL tables and fields will be queried using quotes for each identifier to avoid potential name clashes. For example, when the db layer queries the TRADE table with a particular TRADE_ID for all fields, it will do something like `SELECT t_trade WHERE "TRADE_ID" = 1`. However, if set to false, it will use `SELECT t_trade WHERE TRADE_ID = 1` |  
| `DbThreadsMin`             | The minimum number of threads to be created in the SQL layer thread pool. Defaults to the minimum of 4 or the number of processing units                                                                                                                                                                                                                                 |
| `DbThreadsMax`             | The maximum number of threads to be created in the SQL layer thread pool. Defaults to the maximum of 4 or the number of processing units multiplied by 2                                                                                                                                                                                                                 |

### PostgreSQL

JDBC URI takes the following form:

`jdbc:postgresql://host:port/database`

- host and port are optional
- default value for host is localhost
- default value for port is 5432

In addition to the standard connection parameters, the URL accepts several additional parameters:

- **user** - the database user
- **password** - the database user password
- **ssl** - whether to use SSL. The mere presence of this parameter specifies an [SSL connection](https://jdbc.postgresql.org/documentation/head/ssl-client.html)

More information on connection configuration can be found [in the jdbc documentation](https://jdbc.postgresql.org/documentation/head/connect.html).

If you want PostgreSQL to work with different namespaces/schemas you need to add following system definition items in your **genesis-system-definitions.kts** file:

| Setting     | Description                                                                                                                                                                                                                           |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| DbMode      | This can be one of two values: POSTGRESQL if you want PostgreSQL to work with namespaces/schemas and LEGACY, which is default mode and it always stores the dictionary in a table called `dictionary` and a schema called `metadata`. |
| DbNamespace | It refers to namespace/schema of database. This feature allows you to segregate data from different Genesis apps whilst using a single database.                                                                                      |

### MS SQL

JDBC URI takes the following form:

`jdbc:sqlserver://serverName[\instanceName][:port]][;property=value[;property=value]`

- `instanceName` and `port` are optional
- If no `instanceName` is specified, a connection to the default instance is made
- The default value for `port` is `1433`

In addition to the standard connection parameters, the URL accepts several additional parameters:
- **user** - the database user
- **password** - the database user password
- **databaseName** - the name of the database to connect to. If not stated, a connection is made to the default database.
- **trustServerCertificate** - set to `true` to specify that the driver doesn't validate the server TLS/SSL certificate. This is useful for first-time run and development purposes. Detailed information about the property can be found [here](https://docs.microsoft.com/en-us/sql/connect/jdbc/setting-the-connection-properties?view=sql-server-ver15) and information on encryption [here](https://docs.microsoft.com/en-us/sql/connect/jdbc/understanding-ssl-support?view=sql-server-ver15).

Microsoft provides a full list of [connection properties](https://docs.microsoft.com/en-us/sql/connect/jdbc/setting-the-connection-properties?view=sql-server-ver15), including encryption and certificate authentication properties.

You can also consult the SSL documentation for [MSSQL JDBC driver documentation](https://github.com/Microsoft/mssql-jdbc/wiki/SSLProtocol).

### Oracle

JDBC URI can take the following forms:

`jdbc:oracle:thin:[username/password]@[protocol]//host[:port][/service_name]`

`jdbc:oracle:thin:[username/password]@host[:port]:sid`

- `username/password`, `protocol`, `port`, and `service_name` are optional
- The default `username/password` are both null. If unprovided, a connection will attempt to use standard connection parameters
- The default protocol is `tcp`
- The default value for `port` is `1521`

In addition to the standard connection parameters, the URL accepts several additional parameters:
- **user** - the database user. If not stated, a connection will try and use the value provided by the `DbUsername` system definition (if present)
- **password** - the database user password. If not stated, a connection will try and use the value provided by the `DbPassword` system definition (if present)
- **databaseName** - the name of the database to connect to. If not stated, a connection is made to the default database

For a full list of connection properties, including encryption and certificate authentication properties, see the [jdbc support documents](https://docs.oracle.com/en/database/oracle/oracle-database/21/jjdbc/JDBC-standards-support.html).

## Sample configurations

### User name and password as part of the Connection URL

```kotlin
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DbHost", value = "jdbc:sqlserver://pdb:6060;databaseName=trades;user=MyUserName;password=dbpassword;")
        ...
    }    
    ...
}
```

### User name and password as system definition items

```kotlin
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DbHost", value = "jdbc:postgresql://pdb:6060/trades")
        item(name = "DbUsername", value = "dbuser")
        item(name = "DbPassword", value = "dbpassword")
        ...
    }
    ...
}
```

### User name and password as encrypted system environment variables

```kotlin
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DbHost", value = "jdbc:oracle:thin://pdb:6060;databaseName=trades")
        item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
        item(name = "DbPassword",  value = System.getenv("DBPASSWORD"), encrypted = true)
        ...
    }
    ...
}
```
