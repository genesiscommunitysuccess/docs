---
title: 'PostgreSQL'
sidebar_label: 'PostgreSQL'
id: postgresql
---

PostgreSQL
==========

The Genesis low-code platform supports [PostgreSQL](https://www.postgresql.org/). To connect to it, use the [common SQL](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/sql/) configuration properties.

System definitions[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#system-definitions "Direct link to heading")
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Take note of the following system definition items in the [genesis-system-definitions.kts](https://docs.genesis.global/secure/creating-applications/configure-runtime/system-definitions/) file:

### DbHost[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#dbhost "Direct link to heading")

This must be the JDBC URL needed to connect to the PostgreSQL database.

It takes the following form: `jdbc:postgresql://host:port/database`.

-   `host` and `port` are optional.
-   The default value for `host` is `localhost`.
-   The default value for `port` is `5432`.

In addition to the standard connection parameters, the URL accepts several additional parameters:

-   user - the database user
-   password - the database user password
-   ssl - whether to use SSL. The mere presence of this parameter specifies an SSL connection. More information on SSL configuration can be found [here](https://jdbc.postgresql.org/documentation/head/ssl-client.html)

Here are some sample values with explanations:

| Value | Description |
| --- | --- |
| `jdbc:postgresql:trades` | Connects to PostgreSQL database named `trades` running on localhost on the default port |
| `jdbc:postgresql://pdb:6060/trades` | Connects to PostgreSQL database named `trades` running on host `pdb` on port `6060` |
| `jdbc:postgresql://pdb:6060/trades?user=dbuser&password=dbpassword` | Connects to PostgreSQL database named `trades` running on host `pdb` on port `6060` with username `dbuser` and password `dbpassword` |

More information on connection configuration can be found [here](https://jdbc.postgresql.org/documentation/head/connect.html)

### DbUsername[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#dbusername "Direct link to heading")

Instead of specifying the database username as part of the URL it can be specified in this property. It also supports encrypted values. This is useful when plain text credentials are not allowed in any configurations. See [Database username and password encryption](https://docs.genesis.global/secure/creating-applications/configure-runtime/system-definitions/#items-defined) section for more information.

### DbPassword[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#dbpassword "Direct link to heading")

Instead of specifying the database password as part of the URL, it can be specified in this property. It also supports encrypted values. This is useful when plain text credentials are not allowed in any configurations. See [Database username and password encryption](https://docs.genesis.global/secure/creating-applications/configure-runtime/system-definitions/#items-defined) section for more information.

### DbSqlConnectionPoolSize[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#dbsqlconnectionpoolsize "Direct link to heading")

This sets the maximum number of SQL connections to be held by the SQL connection pool.

### DbQuotedIdentifiers[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#dbquotedidentifiers "Direct link to heading")

If set to true, all SQL tables and fields will be queried using quotes for each identifier (in order to avoid name clashes).

For example, when the db layer queries the TRADE table with a particular TRADE_ID for all fields, it will do something like `SELECT t_trade WHERE "TRADE_ID" = 1`. However, if set to false, it will use `SELECT t_trade WHERE TRADE_ID = 1`.

Sample configurations[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#sample-configurations "Direct link to heading")
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### User name and password as part of the Connection URL[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#user-name-and-password-as-part-of-the-connection-url "Direct link to heading")

```
systemDefinition {    global {        ...        item(name = "DbLayer", value = "SQL")        item(name = "DbHost", value = "jdbc:postgresql://pdb:6060/trades?user=dbuser&password=dbpassword")        ...    }    ...}
```

### User name and password as system definition items[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#user-name-and-password-as-system-definition-items "Direct link to heading")

```
systemDefinition {    global {        ...        item(name = "DbLayer", value = "SQL")        item(name = "DbHost", value = "jdbc:postgresql://pdb:6060/trades")        item(name = "DbUsername", value = "dbuser")        item(name = "DbPassword", value = "dbpassword")        ...    }    ...}
```

### User name and password as encrypted system environment variables[​](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/postgresql/#user-name-and-password-as-encrypted-system-environment-variables "Direct link to heading")

```
systemDefinition {    global {        ...        item(name = "DbLayer", value = "SQL")        item(name = "DbHost", value = "jdbc:postgresql://pdb:6060/trades")        item(name = "DbUsername", value = System.getenv("DBUSERNAME"), encrypted = true)        item(name = "DbPassword",  value = System.getenv("DBPASSWORD"), encrypted = true)        ...    }    ...}
```

[](https://docs.genesis.global/secure/reference/developer/api/database/reference/supported-databases/aerospike/)