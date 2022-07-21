---
sidebar_position: 7
title: Oracle
sidebar_label: Oracle
id: oracle

---


The Genesis low-code platform supports [Oracle](https://www.oracle.com/uk/database/technologies/oracle-database-software-downloads.html). To connect to it, use the [common SQL](../sql) configuration properties.

## System definitions
Take note of the following system definition items in the [**genesis-system-definitions.kts**](/creating-applications/configure-runtime/system-definitions/) file:

### DbHost

This must be the JDBC URL needed to connect to the oracle database. 

It takes one of the following formats: 

`jdbc:oracle:thin:[username/password]@[protocol]//host[:port][/service_name]`

`jdbc:oracle:thin:[username/password]@host[:port]:sid`

- `username/password`, `protocol`, `port`, and `service_name` are optional. 
- The default `username/password` are both null. If unprovided, a connection will attempt to use standard connection parameters.
- The default protocol is `tcp`.
- The default value for `port` is `1521`. 

In addition to the standard connection parameters, the URL accepts several additional parameters:
- **user** - the database user. If not stated, a connection will try and use the value provided by the `DbUsername` System Definition (if present).
- **password** - the database user password. If not stated, a connection will try and use the value provided by the `DbPassword` System Definition (if present).
- **databaseName** - the name of the database to connect to. If not stated, a connection is made to the default database.

For a full list of connection properties, including encryption and certificate authentication properties, check [here](https://docs.oracle.com/en/database/oracle/oracle-database/21/jjdbc/JDBC-standards-support.html).

Here are some sample values with explanations:

`jdbc:oracle:thin:@//localhost;user=MyUserName;password=*****;`

- This connects to the default Oracle database running on localhost using username and password.

`jdbc:oracle:thin:@//pdb:6060;databaseName=trades;user=MyUserName;password=*****;` 

- This connects to an Oracle database named `trades` running on host `pdb` on port `6060` using username and password. 

`jdbc:oracle:thin:@//pdb:6060;databaseName=trades`

- This connects to an Oracle database named `trades` running on host `pdb` on port `6060`. It will try and use the username and password provided by the system definitions.

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


### User name and password as part of the connection URL

```kotlin

systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DbHost", value = "jdbc:oracle:thin:@//pdb:6060;databaseName=trades;user=MyUserName;password=*****;")
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
        item(name = "DbHost", value = "jdbc:oracle:thin:@//pdb:6060;databaseName=trades")
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
        item(name = "DbHost", value = "jdbc:oracle:thin:@//pdb:6060;databaseName=trades")
        item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)
        item(name = "DbPassword",  value = System.getenv("DBPASSWORD"), encrypted = true)
        ...
    }

    ...
}
```

