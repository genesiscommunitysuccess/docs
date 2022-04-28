---
sidebar_position: 5
title: PostgreSQL
sidebar_label: PostgreSQL
id: postgresql

---


[PostgreSQL](https://www.postgresql.org/) is one of the support databases by Genesis. To connect to it you can use the [common SQL](../sql) configuration properties

## System definitions
Take note of the following system definition items in the [**genesis-system-definitions.kts**](/creating-applications/configure-runtime/system-definitions/) file:

### DbHost

This must be the JDBC URL needed to connect to the PostgreSQL database. 

It takes the following form `jdbc:postgresql://host:port/database`. Where `host` and `port` are optional. 

The default value for `host` is `localhost`. 

The default value for `port` is `5432`. 

In addition to the standard connection parameters the URL accepts several additional parameters:
- **user** - the database user
- **password** - the database user password
- **ssl** - whether to use SSL. The mere presence of this parameter specifies a SSL connection. More information on SSL configuration can be found [here](https://jdbc.postgresql.org/documentation/head/ssl-client.html)

Following are sample values with their explanation:


| Value   | Description   |
|----------|-------------|
| `jdbc:postgresql:trades` | Connects to PostgreSQL database named `trades` running on localhost on the default port |
| `jdbc:postgresql://pdb:6060/trades` | Connects to PostgreSQL database named `trades` running on host `pdb` on port `6060` |
| `jdbc:postgresql://pdb:6060/trades?user=dbuser&password=dbpassword` | Connects to PostgreSQL database named `trades` running on host `pdb` on port `6060` with username `dbuser` and password `dbpassword` |

More information on connection configuration can be found [here](https://jdbc.postgresql.org/documentation/head/connect.html)

### DbUsername
Instead of specifying the database username as part of the URL it can be specified in this property

### DbPassword
Instead of specifying the database password as part of the URL it can be specified in this property

### DbSqlConnectionPoolSize
This sets the maximum number of SQL connections to be held by the SQL connection pool

### DbQuotedIdentifiers

If set to true, all SQL tables and fields will be queried using quotes for each identifier to avoid potential name clashes. 

For example, when the db layer queries the TRADE table with a particular TRADE_ID for all fields, it will do something like `SELECT t_trade WHERE "TRADE_ID" = 1`. However, if set to false, it will use `SELECT t_trade WHERE TRADE_ID = 1`.


## Sample Configuration


### Username and password as part of the Connection URL

```kotlin

systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DbHost", value = "jdbc:postgresql://pdb:6060/trades?user=dbuser&password=dbpassword")
        ...
    }

    ...
}
```

### Username and password as system definition items

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

