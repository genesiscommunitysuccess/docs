---
sidebar_position: 6
title: MSSQL
sidebar_label: MSSQL
id: mssql

---


[MSSQL](https://www.microsoft.com/en-gb/sql-server/sql-server-2019) is one of the databases supported by Genesis. To connect to it, use the [common SQL](../sql) configuration properties.

## System definitions
Take note of the following system definition items in the [**genesis-system-definitions.kts**](/creating-applications/configure-runtime/system-definitions/) file:

### DbHost

This must be the JDBC URL needed to connect to the MSSQL database. 

It takes the following form: `jdbc:sqlserver://serverName[\instanceName][:port]][;property=value[;property=value]`. 

- `instanceName` and `port` are optional. 
- If no `instanceName` is specified, a connection to the default instance is made.
- The default value for `port` is `1433`. 

In addition to the standard connection parameters, the URL accepts several additional parameters:
- **user** - the database user
- **password** - the database user password
- **databaseName** - the name of the database to connect to. If not stated, a connection is made to the default database.
- **trustServerCertificate** - set to `true` to specify that the driver doesn't validate the server TLS/SSL certificate. Useful for first time run and development purposes. Detailed information about the property can be found [here](https://docs.microsoft.com/en-us/sql/connect/jdbc/setting-the-connection-properties?view=sql-server-ver15) and information on encryption [here](https://docs.microsoft.com/en-us/sql/connect/jdbc/understanding-ssl-support?view=sql-server-ver15)

For a full list of connection properties, including encryption and certificate authentication properties, check [here](https://docs.microsoft.com/en-us/sql/connect/jdbc/setting-the-connection-properties?view=sql-server-ver15).

SSL documentation for MSSQL JDBC driver documentation can be found [here](https://github.com/Microsoft/mssql-jdbc/wiki/SSLProtocol).

Here are some sample values with explanations:



`jdbc:sqlserver://localhost;user=MyUserName;password=*****;trustServerCertificate=true;`

- This connects to the default MSSQL database running on localhost using username and password and trusting the server certificate.

`jdbc:sqlserver://pdb:6060;databaseName=trades;user=MyUserName;password=*****;` 

- This connects to an MSSQL database named `trades` running on host `pdb` on port `6060` using username and password. 

`jdbc:sqlserver://pdb:6060;databaseName=trades;integratedSecurity=true;` 

- This connects to an MSSQL database named `trades` running on host `pdb` on port `6060` using [integrated security](https://docs.microsoft.com/en-us/sql/connect/jdbc/setting-the-connection-properties?view=sql-server-ver15).

More information on connection configuration can be found [here](https://docs.microsoft.com/en-us/sql/connect/jdbc/building-the-connection-url?view=sql-server-ver15).

### DbUsername
Instead of specifying the database username as part of the URL, you can specify it in this property. It supports encrypted values. This is useful when plain text credentials are not allowed in any configurations. See [Database username and password encryption](/creating-applications/configure-runtime/system-definitions/#items-defined) section for more information.

### DbPassword
Instead of specifying the database password as part of the URL, you can specify it in this property. It supports encrypted values. This is useful when plain text credentials are not allowed in any configurations. See [Database username and password encryption](/creating-applications/configure-runtime/system-definitions/#items-defined) section for more information.

### DbSqlConnectionPoolSize
This sets the maximum number of SQL connections to be held by the SQL connection pool.

### DbQuotedIdentifiers

If set to true, all SQL tables and fields will be queried using quotes for each identifier (in order to avoid name clashes). 

For example, when the db layer queries the TRADE table with a particular TRADE_ID for all fields, it will do something like `SELECT t_trade WHERE "TRADE_ID" = 1`. However, if set to false, it will use `SELECT t_trade WHERE TRADE_ID = 1`.


## Sample configurations


### User name and password as part of the Connection URL

```kotlin

systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DbHost", value = "jdbc:sqlserver://pdb:6060;databaseName=trades;user=MyUserName;password=*****;")
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
        item(name = "DbHost", value = "jdbc:sqlserver://pdb:6060;databaseName=trades;")
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
        item(name = "DbHost", value = "jdbc:sqlserver://pdb:6060;databaseName=trades;")
        item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
        item(name = "DbPassword",  value = System.getenv("DBPASSWORD"), encrypted = true)
        ...
    }

    ...
}
```

