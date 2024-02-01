---
title: 'Operations - server commands'
sidebar_label: 'Server commands'
id: server-commands
keywords: [operations, server, commands]
tags:
    - database
    - server
    - commands
---

Genesis has numerous built-in commands that have their own individual functions.
This page goes through them and details the function, parameters and use cases of those commands. 

Once an application has been built and zipped, you can install it in any another system that contains the Genesis low-code platform.

To ensure a correct installation, you must follow the product installation procedure.

## CountRecords

This counts the number of records in the database, grouped by table; the results are printed to screen.

By default, a count is given for every table in the database.

If you only want the record count for specific tables, you can specify the table name or names.

### Syntax
| Argument | Argument long name | Mandatory | Description                                            | Restricted values | Default |
|----------|--------------------|-----------|--------------------------------------------------------|-------------------|-------|
|          |          [TABLES]  | no        | the name of the table whose rows are to be counted; for more than one table, this must be a space-separated list            | none                | a record count is provided for all tables in the database    |

This example gives a record count for all tables:

```bash
CountRecords
```

The example below gives a record count for two specific tables:

```bash
CountRecords CHF_ORDERS CHF_TRADES
```

## DbMon 

DbMon is the Genesis database client, which provides its own command line. From here, you can navigate through the database tables in your application.

`DbMon` itself has a `help` command, which shows all the available commands. To get help on a specific command, run `help _command_`.

`DbMon --quietMode` performs database changes without triggering real-time updates in the update queue layer.

For full details, see our page on [DbMon](../../../operations/commands/dbmon).

## DropTable

The `DropTable` command removes all rows from the specified tables. 

:::warning
If you do not specify any tables, then **all** rows will be removed from **all** tables in the database. 

Use with care!
:::

### Syntax 
| Argument | Argument long name | Mandatory | Description                                            | Restricted values | Default |
|----------|--------------------|-----------|--------------------------------------------------------|-------------------|-------|
| -t       | [TABLES]    | no        | the name of the table to have its rows removed; for more than one table, this must be a space-separated list | none | all records are removed from all tables |

The example below removes all the rows from three separate tables:

```bash
DropTable -t EQUITY_ORDERS_GB EQUITY_ORDERS_DE EQUITY_ORDERS_IT
```

The command will ask you to confirm the removal of the content from each table.

## DumpIt
To copy data from a Genesis database, use the `DumpIt` command.

### Syntax
The `DumpIt` command can take the following arguments:

| Argument | Argument long name | Mandatory | Description                                            | Restricted values | Default |
|----------|--------------------|-----------|--------------------------------------------------------|-------------------|-------|
| -a       | --all              | no        | exports all tables to csv                              | none              | none    |
| -f       | --file `<arg>`     | no        | name of the csv file where table is exported           | none              | none    |
|          | -fields `<arg>`    | no        | space separated field list e.g. "FIRST_NAME LAST_NAME" | none              | none    |
| -h       | --help             | no        | show help on how to use the command                    | none              | none    |
| -s       | --sql `<arg>`      | no        | name of the sql file to export the table to            | none              | none    |
| -t       | --table `<arg>`    | no        | the name of the table to export to csv                 | none              | none    |
| -cem     | --criteriaEvaluatorMode `<arg>` | no        | the type of criteria evaluator to be used | TYPE_AWARE or LEGACY | LEGACY |
| -fm      | --formatMode `<arg>`     | no        | indicates whether field formats should be taken into account  | FORMATTED (takes field formats into account) or LEGACY (does not take field formats into account) | none    |
| -qi      | --quoteIdentifiers | no        | if present, all sql identifiers (e.g. column names) will be quoted     | none  | none   |
|          | -where `<arg>`     | no        | match criteria e.g. "USER_NAME=='John'"                | none              | none    |

Here are some examples:

```bash
DumpIt -t GBP_TRADES -f gbp-trades
```

This copies all records in the GBP_TRADES table to the file **gbp-trades.csv**.

```bash
DumpIt -t USER -where "USER_NAME=='John'" -fields "USER_NAME"
```

This copies the USER_NAME of every record in the USER table where the USER_NAME is John. This useful if you want to know if the user name John is in the database.


```bash
DumpIt -t FUND -f FUND -fields "FUND_ID NAME" -where "NAME == 'FUND_FUND' && YEARS_IN_SERVICE >= 10"
```

This copies the FUND_ID and NAME fields of every record that has "FUND_FUND" for a name, and ten or more years in service.


```bash
DumpIt --all
```

This copies all the tables in the system, creating one .csv file for each table in the database. The files are saved in the current directory. It is useful for taking a back-up of the current system database.

### Interactive mode
You can run `DumpIt` without any arguments to enter interactive mode.


## FixEnumValues

Converts non-matching enum values in the database to SNAKE_CASE. This command is intended for use after a dictionary change that adds new enum values. It will only update the data if the converted value matches the list of enum values in the dictionary.

Changes will only be applied to the database if the command is run with the **--commit** flag.

:::warning
Stop all processes before using this command.
:::

### Syntax
The `FixEnumValues` command can take the following arguments:

| Argument | Argument long name     | Mandatory | Description                                                                            | Restricted values | Default |
|----------|------------------------|-----------|----------------------------------------------------------------------------------------|----------------|--------|
| -c       | --commit               | no        | applies dictionary changes to the database                                             | none    | none |
|          | [TABLES]               | no        | a space-separated list of specific tables to be changed; if no list is supplied, all tables are changed                                              | none              | none |
| -h       | --help             | no        | shows help on how to use the command                    | none   | none    |

In the example below, the changes are applied to the database for two tables: TRADE and POSITION.

```bash
FixEnumValues --commit TRADE POSITION
```

### Using an installHook

To automate this process, you can use an installHook to call the script before `remap` is performed - be aware that *it will only run successfully once*.

The following example finds all String to Enum changes in all tables and commits any valid updates to the database before `remap` is performed.

```bash
#!/bin/bash
source "$HOME"/.bashrc
shopt -s expand_aliases

FixEnumValues --commit

exit $?
```

To implement this:

1. Navigate to the ***appName*\server\jvm\\*appName*-config\src\main\resources\scripts\installHooks** folder

2. Create a file called ***nextInstallHookNumber*_ConvertData.sh** or similar and add the bash script above.

The installHook will run before `remap` on your next deploy.

## genesisInstall

This command validates all system and product configuration, checking for things such as field duplication.

`genesisInstall` looks at all the folders (apart from runtime and generated), all the modules, and all files in the **cfg** directory. It copies the config files from the **cfg** directory into the **generated** folder. 

In the files collected, the command examines the installation environment and looks for system definition tokens (file names with suffix **.tmplt.xml**). The generated **cfg** file names have their token placeholders replaced with the environment's system definition value for the token, and the suffix will be changed to **.auto.xml**.

The command also checks the system-specific definitions and uses these to replace any definitions that have the same name in any of the modules. Where a  file in **site-specific/cfg** has the same name as a file in a module's **cfg**, the version in **site-specific/cfg** will always be used.

Following this, when you start any process, the `startProcess` command reads from the **cfg** directory in the **generated** folder.

`genesisInstall` also completes config checking, looking out for mistakes in the configured code and providing warnings and error messages. If an error is encountered, the configuration will not be propagated to the **run/generated/cfg** area.

### Syntax
The `genesisInstall` command can take the following arguments:

| Argument | Argument long name | Mandatory | Description                                                                                                               | Restricted values | Default |
|----------|--------------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------|-------------------|--------|
|          | --ignore           | no        | If supplied, will ignore errors in the configuration files                                                                            | none              | none |
|          | --ignoreHooks      | no        | If supplied, will ignore any install hooks found                                                                                      | none              | none |
|          | --compactProcesses | no        | When set to `true`, combines compatible services into a single process, which reduces the number of services running in the container | none                | none |
|          | --repeatedHooks    | no        | If supplied, will repeat the specified install hooks                                                                                      | none              | none |
|          | --hostDiff         | no        | If supplied, will compare all the files in every Genesis server in the cluster to make sure that the files are in sync  | none              | none |

Once complete, all configuration files will be copied and, where necessary, merged into the **~/run/generated/cfg** file, which we alias as **$GC**.

If any problems are found in the generated configuration files, they will be deleted. This forces you to correct the errors in the original configuration files.

To ignore errors in the configuration files, use the `--ignore` argument. This leaves the configuration files undeleted, even if errors are found.

All process configuration is stored within **$GC**.

The example below ignores errors and leaves the configuration files undeleted, even if errors are found.

```bash
genesisInstall --ignore
```

The example combines all compatible processes into a single process.

```bash
genesisInstall --compactProcesses
```

### Install hooks

Install hooks run as part of `genesisInstall`. You can specify the relevant scripts as part of `genesisInstall` then add those scripts to the file  *applicationName*_**config/resources/scripts/installHooks**, where *applicationName* is the name of application you are developing. 

The scripts (hooks) you add will only run once, unless their execution fails. If you run `genesisInstall`again, previously successful executions of installHook scripts will not be run as part of the install. 

The scripts must be implemented to work in an idempotent way, and the end result of executing a script means the system is (or already was) in the expected target state, whether you run it on a pre-existing environment (e.g. upgrading a server) or you run it in a completely new environment.

On the server, it is located in the **GENESIS_HOME**/*applicationName*/**scripts/installHooks** directory. Logs are located in **GENESIS_HOME/runtime/installHooks**

Install hook file-name conventions:
- We only use shell script for install hooks and inside the shell script you can call a Python script, a Kotlin script or whatever is necessary.
- The install hook name must be unique.
- It must contain a priority number at the beginning of the file name. This number should be unique. For example: **1_migrateLogFiles.sh**, **2_migrateDictionary.sh**.
- If you need to create a new install hook that has to execute before priority number 1 or number 2, you must increase the numbers for all the other scripts (e.g. rename **1_migrateLogFiles.sh** to **9_migrateLogFiles.sh**).

### Practical examples 

You can create a new script and add it to the folder mentioned above to perform any particular functionality as part of `genesisInstall`.

Any script exiting with value "0" is considered successful by the installHooks system, and any script exiting with a non-zero value is considered to have failed execution. 

In a Java or Kotlin world, a simple implementation could look like this:

```kotlin
@JvmStatic
fun main(args: Array<String>) {
    ScriptUtils.initRootLogLevel(Level.WARN)

    val genesisHome = System.getenv("GENESIS_HOME")

    if (genesisHome == null || "" == genesisHome) {
        val message = "System environment variable GENESIS_HOME is not set. Aborting migration process..."
        // installHooks FAILURE
        System.err.println(message)
        exitProcess(1)
    }

    try {
        run(args)
        // installHooks SUCCESS
        exitProcess(0)
    } catch (e: Exception) {
        // installHooks FAILURE
        System.err.println(e.message)
        exitProcess(1)
    }
}
```

Consider another example; we have a migration script called migrateDictionary.sh as an install hook; this internally executes [MigrateDictionary](./01_server-commands.md#migratedictionary) as shown below:

```shell
#!/bin/bash

MigrateDictionary -dst DB

exit $?
```

## GenesisRun

This is a Python script wrapper for Genesis scripts.

'GenesisRun` will attempt to find a script to execute within the Genesis folder structure (site-specific or scripts).

There are two environment variables that can be used to configure how much RAM the scripts will use:

* SCRIPT_MAX_HEAP
* REMAP_MAX_HEAP

`GenesisRun` can execute code in two different modes: Groovy script and GPAL Kotlin script. **GenesisRun** builds the necessary classpath, so you don't need to build it in each script.

* Groovy script: GenesisRun SetLogLevelScript.groovy
* GPAL Kotlin script: GenesisRun customPurger-script.kts

There is a separate wrapper, `JvmRun` for Java main class scripts.

## GetAutoIncrementCount
This gets the current auto increment INT values defined in dictionaries for all the sequences in the system. By default, the values are printed on screen (to the terminal), but they can be written to a file so they can be reused by the `SetAutoIncrement` script (see below).

:::warning
Stop all your application's processes before using this command. 
:::

### Syntax
The `GetAutoIncrementCount` command can take the following arguments:

| Argument | Argument long name | Mandatory |               Description               | Restricted values | Default |
|----------|--------------------|-----------|-----------------------------------------|-------------------|---------|
| -f       | --file `<arg>`     | no        | name of file to receive the values      | none              | AutoIncrementValues |
| -h       | --help             | no        | displays help on the command            | none              | none    |
| -p       | --print            | no        | if sending to a file, then use this if you also want to print to screen | none             | true (unless -f is supplied) |

The behaviour of this command depends on which database implementation your application uses. 

- **If you are using a NOSQL database**, such as Foundation DB, auto-incremented values are assigned in blocks of 100 in order to improve performance. This command retrieves the value of the counter stored on disk. If the system is currently active, this value might not correspond to the value of the next record inserted that references the value.

- **Similarly, if you are using Oracle**, auto-incremented values are cached in memory in configurable block sizes. This command only retrieves the current value of the counter stored on disk.

- **If you are using an SQL implementation**, this command returns the last value assigned by the sequence, not the next to be assigned.

For example, this command puts all the auto increment values in a file called **AutoIncVals**. The values are not displayed on screen.

```bash
GetAutoIncrementCount -f=AutoIncVals
```
And remember: only use this command when all the application's processes have been stopped. 

## GetSequenceCount

This gets the current sequence number for all the sequences in the system. The values can be printed on screen or written to a file so they can be reused by the `SetSequence` script (see below). For example, if you have 120 rows in the table DE_ORDERS, the sequence count is for that table is 120.

### Syntax
The `GetSequenceCount` command can take the following arguments:

| Argument | Argument long name | Mandatory |               Description               | Restricted values | Default |
|----------|--------------------|-----------|-----------------------------------------|-------------------|---------|
| -f       | --file `<arg>`     | no        | name of the file to contain the sequence numbers | none     | SEQUENCE.csv |
| -h       | --help             | no        | show help on how to use thus command             | none     | none |
| -p       | --print            | no        |                                                  | none     | true (unless -f is supplied) |

The example below puts the numbers for all sequences in the database in the file **/home/user/run/sequenceCount**. 
```
GetSequenceCount --file=/home/user/run/sequenceCount
```

## GetNextSequenceNumbers

This gives you the next sequence number of every table in the application. The numbers are provided in table format (csv), for example:

```
"Table","Sequence","Value"
"USER_AUDIT","UA","104"
"PROFILE_AUDIT","PR","804"
"PROFILE_USER_AUDIT","PA","104"
```
In the example above, the table USER_AUDIT has 103 rows, so the next sequence number for that table is 104.

### Syntax
The `GetSequenceNumbers` command can take the following arguments:

| Argument | Argument long name | Mandatory |               Description               | Restricted values | Default |
|----------|--------------------|-----------|-----------------------------------------|-------------------|---------|
| -f       | --file `<arg>`     | no        | name of the file to contain the sequence numbers | none     | SequenceValues.csv |
| -h       | --help             | no        | show help on how to use this command             | none     | none |
| -p       | --print            | no        |                                         | none              | true (unless -f is supplied) |

The example below displays the next sequence number of each table, using the format described above.
```bash
GetNextSequenceNumbers
```

By default, the details are sent to the screen, but you can redirect the output to a file. For this, use either the `-f` argument followed by the filename. Alternatively, you can use the `>>` annotation followed by a filename, as in the example below:

```bash
GetNextSequenceNumbers >> /tmp/NextSeqNumbers.txt 
```

### Correcting errors in tables
The `GetNextSequenceNumbers` command is often used with the `SetSequence` script [see below](../../../operations/commands/server-commands/#setsequence), for example, if you suspect that you have an error in one of your tables:

1. Stop all the processes and run `GetNextSequenceNumbers` to find the next sequence numbers of the tables.
2. Check the table contents. You might find that a row is missing or needs to be added. Make this change on the database manually. This affects the sequence numbers in those tables.
3. Run `SetSequence` to reset the sequence numbers where relevant. 
4. Now you can [restart your processes](../../../operations/commands/server-commands/#startserver-script).

## killProcess

This command is used to terminate a specified process.

### Syntax
The `killProcess` command can take the following arguments:

| Argument                     | Argument long name                            | Mandatory | Description                                                                                                                                                                                      | Restricted values | Default |
|------------------------------|-----------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|-------|
| -s   HOSTNAME [HOSTNAME ...] | --hostname HOSTNAME HOSTNAME   [HOSTNAME ...] | no        | Where the application is running on more than one node, this identifies the node where you want to kill the process (so you can kill a process on a different node). Specify the Host Name. | none              | none |
| -f                           | --force                                       |           | forcefully kills a process (using kill -9)       | none              | none |
| -w WAIT                      | --wait WAIT                                   | no        | specifies how many seconds to wait before forcing the kill       | none         |  10 |
| -c                           | --cluster                                     | no        | kills the process on every node in the cluster             | none              | none |

The example below kills the GENESIS_AUTH_PERMS process.

 ```bash
killProcess GENESIS_AUTH_PERMS
```
In the example below, there is a cluster; this command kills the GENESIS_ROUTER process on the nodes HARRY and GARY.

 ```bash
killProcess GENESIS_ROUTER --hostname HARRY, GARY
```

In the example below, there is a cluster; this command kills the GENESIS_ROUTER process on ALL nodes.

 ```bash
killProcess GENESIS_ROUTER --cluster
```

## killServer

This command kills the server. It reads the **$GC/processes.xml** file to determine which processes to kill. It will prompt for confirmation (`Are you sure you want to kill server? (y/n):`), unless you specify `--force`.

### Syntax
The `killServer` command can take the following arguments:

| Argument                     | Argument long name                            | Mandatory | Description                                                                                                                                                                                                                          | Restricted values | Default |
|------------------------------|------------------------------|-----------|------------------------------------|-------------------|--------|
| -s   HOSTNAME [HOSTNAME ...] | --hostname HOSTNAME HOSTNAME   [HOSTNAME ...] | no        | Where the application is running  on more than one node, this identifies the node where you want to kill the server (so you can kill a server on a different node). Specify the Host Name, Host Names or "cluster" for all hosts | none | none |
| -f                           | --force                                       | no        | forcefully kills a process (using kill -9)                                                                                                                                                                                         | none              | none |
|                              | --all                                         | no        | kills all processes, including   GENESIS_CLUSTER                                                                                                                                                                                     | none              | none |
| -c                           | --cluster                                     | no        | kills the server on all the nodes in the cluster                                                                                                                                                                                   | none              |    none | 

In the example below, there is a single node; this command kills all processes for the application, including GENESIS_CLUSTER.

 ```bash
killServer GENESIS_ROUTER --all
```

In the example below, there is a cluster; this command kills the nodes HARRY and GARY.

 ```bash
killServer GENESIS_ROUTER --hostname HARRY, GARY
```

## LogLevel

To change the logging levels by code (dynamically) on any Genesis process, use the `LogLevel` command.

### Syntax
The `LogLevel` command can take the following arguments:

| Argument                               | Argument long name                   | Mandatory | Description                                 | Restricted values | Default |
|----------------------------------------|--------------------------------------|-----------|---------------------------------------------------------------------------------------|-------------------|-------|
| -c                                     |  --class `<class name>`              | no         | changes log level on the defined class       | none                | none |
|                                        | -DATADUMP_NACK_OFF                   | no         | changes log level to INFO for Genesis messages   | none   | none  |
|                                        | -DATADUMP_NACK_ON                    | no         | changes log level to TRACE and captures only _NACK messages from Genesis messages     | none    | none  |
|                                        |  -DATADUMP_OFF                       | no         | changes the log level to info for Genesis messages   | none | none  |
|                                        |  -DATADUMP_ON                        | no         | changes the log level to trace for Genesis messages   | none | none  |
| -h                                     |  --help                              | no         | show help on the command                     | none  | none  |
| -l                                     |  --level `<log level>`               | no         | log level - if log level is not correct it will be set automatically to   DEBUG level | none     | none  |
| -p _process-name_,..,_process-name_  |                                      | no         | attaches processes to the command     | none  | none  |
| -r _process-name_,..,_process-name_`  |                                      | no         | remove processes       | none        | none  |
|                                        | -STATUSDUMP_OFF                      | no         | changes the log level to info for status updates    | none  | none  |
|                                        | -STATUSDUMP_ON                       | no         | changes the log level to trace for status updates  | none   | none  |
| -t `<time>`                            |                                      | no         | duration of log level change in min/sec Eg: 1m, 1000s   | none | none  |

The example below sets the logging level for the GENESIS_AUTH_DATASERVER process to TRACE.

```bash
LogLevel -p GENESIS_AUTH_DATASERVER -l TRACE
```

The example below resets the LogLevel for the GENESIS_CLUSTER process. 

```bash
LogLevel -r GENESIS_CLUSTER
```
The example below changes the log level to TRACE and captures only `_NACK` messages from Genesis messages for all processes. 

```bash
LogLevel -DATADUMP_NACK_ON
```

## MigrateAliases

This migrates the Genesis alias store from database storage to file storage and vice versa. This is useful for debugging when you have FDB database technology. 

### Syntax
The `MigrateAliases` command can take the following arguments:

| Argument | Argument long name                   | Mandatory | Description                                                     | Restricted values | Default |
|----------|--------------------------------------|-----------|-----------------------------------------------------------------|-------------------|---------|
| -h   | --help        | no	 | show help on the command | none | none |
| -o   | --override    | no	 | overwrite existing alias store if it exists in the destination | none | none |
| -dst | --destination | yes | destination dictionary store | DB or FILE | none |

The example below migrates the Genesis alias store to DB. It overwrites any existing dictionary in the destination.

```
MigrateAliases -dst=DB
```

### Database technology
FDB implementations use internal aliases for fields and tables. Migrating these aliases from database to a file will help to debug problems in the data storage.

- If you are running Genesis on a single node, use a file store.
- If you are running Genesis on more than one node, use database mode.

The `remap` operation updates the alias store, so if you are running a Genesis cluster it is better to use a database storage mode; this is less open to error, and you won't have to copy the alias storage file to the remaining nodes manually.

## MigrateDictionary

This migrates the Genesis dictionary from the Database Dictionary Store to the File Dictionary Store storage and vice versa.

The `MigrateAliases` command can take the following arguments:

| Argument | Argument long name                   | Mandatory | Description                                                     | Restricted values | Default |
|----------|--------------------------------------|-----------|-----------------------------------------------------------------|-------------------|---------|
| -h   | --help        | no	 | show help on the command | none | none |
| -o   | --override    | no	 | overwrite existing alias store if it exists in the destination | none | none |
| -dst | --destination | yes | destination dictionary store | DB or FILE | none |

The example below migrates the Genesis dictionary from DB to FILE, it also overwrites any existing dictionary in the destination

```bash
 MigrateDictionary -dst=FILE -o
```

The script uses the [system definition file](../../../server/configuring-runtime/system-definitions/#items-defined) to discover the `DictionarySource` property:

- If the property is `DB` (if the server uses a Database Dictionary Store), the `MigrateDictionary` script saves the dictionary to a file.
- If the `DictionarySource` is `FILE` (if the server uses a File Dictionary Store), the dictionary is saved to a database. The target database type - `DbLayer` - is also retrieved from the system definitions file.

Here is a recommendation:

- Use a file store (set by default) if you are running Genesis on a single node
- Use database store if you are running Genesis on more than one node

The `remap` operation updates the dictionary, so if you are running a Genesis cluster, it is better to use a Database Dictionary Store; this is more robust and you won't have to copy the dictionary file manually to the remaining nodes.

:::warning
It is potentially dangerous to switch the `DictionarySource` property. 

If you run `remap` (which modifies the  dictionary) after `MigrateDictionary` and before switching the `DictionarySource` property, the file store and database store could contain different dictionaries and it is not safe to switch between them.
:::

## mon 

This command shows the status of the overall system, so you can see if the server is up or not. By default, it  displays a snapshot. If you want to the screen to be refreshed, simply add a flag with the number of seconds between refreshes, such as `mon -10`.

```bash

***********************************************************************************************

Start: 2023-11-09 10:04:03                                                    Uptime: 3 minutes
Date:  2023-11-09 10:07:23                                                    Daemon status: OK

PID     Process Name                  Port        Status         CPU       Memory    Message
===============================================================================================
547477  GENESIS_AUTH_CONSOLIDATOR     8005        STANDBY        27.50     2.80
547348  GENESIS_AUTH_DATASERVER       8002        HEALTHY        39.90     3.70      ;Lmdb currently uses 1% of available space (total size 2GB)
547308  GENESIS_AUTH_MANAGER          8001        HEALTHY        65.50     4.60
547390  GENESIS_AUTH_PERMS            8003        HEALTHY        35.00     3.50
547436  GENESIS_AUTH_REQUEST_SERVER   8004        HEALTHY        34.10     3.40
547520  GENESIS_CLUSTER               9000        HEALTHY        43.20     4.10      ;Lmdb currently uses 1% of available space (total size 2GB)
547567  GENESIS_ROUTER                9017        HEALTHY        33.20     3.50
===============================================================================================
n/a     ALPHA_CONSOLIDATOR            11002       MISSING        n/a       n/a       Daemon missing
547644  ALPHA_DATASERVER              11000       HEALTHY        34.20     3.90      ;Lmdb currently uses 1% of available space (total size 2GB)
547771  ALPHA_EVALUATOR               11003       STANDBY        25.50     2.80
547686  ALPHA_EVENT_HANDLER           11001       RUNNING        47.90     4.10

```

By default, the command shows the following columns of information:


| Column       | Description                                                                                                                                 |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| PID          | The process ID, which is generated by the system                                                                                            |
| Process Name | The process name                                                                                                                            |
| Port         | The port where the process is operating; you can change the defaults in the **process.xml** file                                            |
| Status       | The status of the process (see below)                                                                                                       |
| CPU          | The percentage of CPU being used by the process. For multi-core CPUs or multiple CPUs, the total percentage of all processes can exceed 100 |
| Memory       | The percentage of RAM being used by the process                                                                                             |
| Message      | Displays any relevant message generated by the process                                                                                      |

The key column in the display is **Status**, which can have the following values:

- **RUNNING** the process has just started and is still initialising.
- **STARTING** the process has completed initialisation; it is running but hasn't yet signalled to the monitor that it has completed its internal health checks.
- **HEALTHY** the process is fully available.
- **STANDBY** the process is in standby mode; it will take it over if the node becomes Primary
- **MISSING** there has been an error and the process has not started correctly.

:::info
If you are using a development environment and you are running a local build via the IntelliJ plugin, you cannot run the `mon` command. The plugin provides a **Mon** tab where you can monitor the status of each process and start and stop each one.
:::

### Syntax
The `mon` command can take the following arguments:

| Argument | Argument long name | Mandatory | Description                                                               | Restricted values | Default |
|----------|--------------------|-----------|---------------------------------------------------------------------------|-------------------|---------|
| -h       | --help             | no        | show help on the mon commands                                             | none              | none    |
| -v       | --version          | no        | show installed product versions                                           | none              | none    |
| -c       | --cfg              | no        | show the config files used by each process                                | none              | none    |
| -a       | --all              | no        | show all information                                                      | none              | none    |
| -m       | --monitors         | no        | show state monitors  (the **Message** column heading becomes **Monitor**) | none              | none    |
| -u       | --unhealthy        | no        | show unhealthy processes only                                             | none              | none    |
|          | --down             | no        | show DOWN processes                                                       | none              | none    |
|          | --warning          | no        | show WARNING processes                                                    | none              | none    |
|          | --error            | no        | show ERROR processes                                                      | none              | none    |
|          | --unknown          | no        | show UNKNOWN processes                                                    | none              | none    |
|          | --missing          | no        | show MISSING processes                                                    | none              | none    |
|          | --running          | no        | show RUNNING processes                                                    | none              | none    |
|          | --starting         | no        | show STARTING processes                                                   | none              | none    |
|          | --standby          | no        | show STANDBY processes                                                    | none              | none    |
|          | --healthy          | no        | show HEALTHY processes                                                    | none              | none    |

:::info

Unhealthy processes includes all processes that are not `HEALTHY` or `STANDBY`. 
`--unhealthy` can **not** be used with other status-filtering arguments.

:::

The example below runs `mon` with a polling interval of one second.

```bash
mon -1
```

The example below runs `mon`; it shows the status of every process and outputs the config files used by each process.

```bash
mon --cfg
```

The example below runs `mon`, but only shows processes that are unhealthy.

```bash
mon --unhealthy
```

The example below runs `mon`, but only shows processes that are missing.

```bash
mon --missing
```

## PopulateHolidays
This command populates the Holidays table with holidays, based on a specific year(s), country(ies) and region(s).

### Syntax
The `PopulateHolidays` command can take the following arguments:

| Argument | Argument long name | Mandatory |               Description               | Restricted values |
|----------|--------------------|-----------|-----------------------------------------|-------------------|
| -c       | --country `<arg>`  | No        | the country name to search for holidays | No                |
| -h       | --help             | No        | show help on this command               | No                |
| -r       | --region `<arg>`   | No        | the region name to search for holidays  | No                |
| -y       | --year `<arg>`     | No        | the year of holidays                    | No                |

For example: 

```bash
PopulateHolidays -y 2020,2021 -c BR,GB -r rj,en
```

## PurgeTables

This enables you to define the data-retention policy. Data will be removed from the database where the defined criteria are fulfilled.

Example: For the TRADE table, you could decide to keep allocated trades for 60 days, and 30 days for the rest.

To use this tool, you must have an _application_**-purger.kts* file in the application's config folder. Invoking the **PurgeTables** command will pick up all files that are found in the **$GENESIS_HOME/generated/cfg/** directory.

In order to enable syntax highlighting and autocompletion for purger files, you must add **genesis-environment** as a dependency of your application's **-config** module. See simple examples below for purger definitions:

A log file called **purge_&#123;*time_of_run*&#125;** will be created under the **$GENESIS_HOME/runtime/logs/** folder.

The functions and filters below give you different ways of purging data.

### Inject repository
You can inject any repository into the purger script; for example:

```kotlin
purgers{
    val userSessionRepo = inject<UserSessionRx2Repository>()
}
```

### Purge by date

The purger supports purging based on days. You can specify the max age of a record in terms of either calendar days or business days.

- Business days disregard weekends and public holidays. 
- Calendar days disregard weekends by default, but can be set to include them, as shown in the example below.

To use this script, you need to supply
- a LONG or DATETIME field in the table to be used, or you can supply just the table name, in which case the TIMESTAMP field of the table will be used to calculate the age of the record.
- The max age of the record, which indicates all the records older than these days will be purged
- Optional fields when you use calendar days: boolean flag `ignoreWeekends` (defaults to true).
- Optional fields when you use business days: `country` and `region` name.

```kotlin
purgers {
 // purge trades over 180 days old based on field TRADE_DATE, not taking weekends into account (180 week-days)
 daysPurger(TRADE.TRADE_DATE, 180)
 // purge trades over 6 months old based on field TIMESTAMP of table which will be used internally, including weekends (180 full calendar days)
 daysPurger(TRADE, 180, ignoreWeekends = false)

 // purge prices older than 5 business days based on PRICE_DATETIME
 businessDaysPurger(PRICE.PRICE_DATETIME, 5)
 // purge prices older than 5 business days based on PRICE_DATETIME in country SPAIN
 businessDaysPurger(PRICE.PRICE_DATETIME, 5, "SPAIN")
}
```

### Purge by range
Range purger is similar to bulkPurger, but it performs efficient index range searches in database and speed up purger performance compared to bulkPurger.
- You need to give index name of the table you want to purge data on
- Purger has special function called `whereRange` which is used to filter based on index value

```kotlin
import global.genesis.gen.dao.repository.UserSessionRx2Repository
purgers {
 // Inject repo
 val userSessionRepo = inject<UserSessionRx2Repository>()

 // Range purger with whereRange
 rangePurger(USER_SESSION.BY_USER_NAME).whereRange("JohnDoe")

 // Combination of filters for maximum flexibility
 rangePurger(USER_SESSION.BY_USER_NAME)
  .whereRange("JohnDoe")
  .filterBusinessDays(maxDays = 5, country = "SPAIN", region = "NATIONAL", field = USER_SESSION.LAST_ACCESS_TIME)

 rangePurger(USER_SESSION.BY_USER_NAME)
  .whereRange("JohnDoe")
  .filterDays(maxDays = 5)

 // finally clause usage
 rangePurger(USER_SESSION.BY_USER_NAME)
  .whereRange("JohnDoe")
  .finally { userSession ->
    println("Purged record: ${userSession.toGenesisSet()}")
  }
}
```

### Purge bulk data

You can purge data from the whole table using:

```kotlin
bulkPurger(USER_SESSION)
```
You can purge data from the table based on some conditions:

```kotlin
purgers {
// Purger that reads the whole user session every time it runs and deletes all sessions for JohnDoe
 bulkPurger(USER_SESSION).filter { it.userName == "JohnDoe" }
// Purge USER_SESSION older than 8 business days in country India
 bulkPurger(USER_SESSION)
  .filterBusinessDays(8, "INDIA")
}
```

### Filters

The following filters are used in the examples explained above:

`whereRange`: This filter can contain value of the table-index parameter or parameters if there are more than one field in the table-index. Parameter list can range from 1-10.
It filters the records based on the index parameter value/values

`filter`: filter based on predicate provided

`filterBusinessDays`: this method allows you to purge data based on business date. 
You need to provide:
- max age of record
- country name
- region which defaults to "NATIONAL"
- and optional LONG or DATETIME field of table you want to purge and if not specified TIMESTAMP field of table is used

`filterDays`: this method allows to purge data based on calendar date
You need to provide:
- max age of record
- and optional LONG or DATETIME field of table you want to purge and if not specified TIMESTAMP field of table is used

`finally` clause: It is run for every record that is purged and used to add some extra functionality if needed

## remap

Remap is a schema-migration tool used to apply the current schema (defined in the deployed field and table GPAL dictionaries) to the underlying database layer used by the Genesis low-code platform.

The `remap` command performs the following tasks:

- It reads all dictionary files (fields.kts, tables.kts and view.kts) from **$GC** and compares these to the previously generated schema. It uses these changes to remap the memory-resident database.
- It generates dao objects based on the dictionary tables, so you can perform database operations in a type-safe way.
- If you are running FDB, it updates the Genesis alias store.

If you run `remap` with no arguments, it simply gives a report of changes that exist in the configuration.

If you want to commit the changes to the database, you must use the **--commit** argument:

```bash
remap [-c | --commit]
```

For full details, see our page on [Remap](../../05_operations/02_commands/03_remap.md).

## RenameFields 
This command is used to rename a field name in a database without changing the dictionary or config files.

### Syntax
The `RenameFields` command takes two arguments; both of which are mandatory:

```bash
RenameFields [-i <[current name of field]>] [-o  <[new name of field]>]
```

| Argument | Argument long name | Mandatory | Description                              | Restricted values | Default |
|----------|--------------------|-----------|------------------------------------------|-------------------|---------|
| -i       | --input            | yes       | name of field that you want to change    | none              | none    |
| -o       | --output           | yes       | name you want the field to be changed to | none              | none    |
| -h       | --help             | no        | show help on using this command          | none              | none    |


The `--input` argument represents the name of the field you would like to change. The argument must be an existing field name in the database.

The `--output` argument represents the name of the field you would like to change to. The argument must also be an existing field name in the database.

Both arguments must also be of the same type.

If both arguments are in the same table, it would result in the `--output` field being deleted.

All changes using `RenameFields` can be changed back to the original database schema by using the command `remap --commit`.

For example:

```bash
RenameFields -i SYMBOL -o TRADE_ID
```

This changes the name of the SYMBOL field to TRADE_ID.     

Another example:

```bash
RenameFields --input FIRST_NAME --output FNAME 
```

This changes the name of the field FIRST_NAME to FNAME.

Invalid example:

```bash
RenameFields -i PRICE -o FIRST_NAME
```

This would result in an error, as PRICE is of type DOUBLE while FIRST_NAME is of type STRING.

## SendIt 

To send data into the database (inserts, modifies and upserts), use the `SendIt` command. The data you want to send should be in a .csv file, and the name of the file (or files) should match the name of the table where the new or amended data is to be sent. If you use a different filename, you must specify this using the `-f` argument.

### Syntax
The `SendIt` command can take the following arguments:


| Argument | Argument long name     | Mandatory | Description                                                    | Restricted values     | Default |
|----------|------------------------|-----------|----------------------------------------------------------------|-----------------------|--------|
| -a       | --all                  | no        | import all the tables from all the csv files to the database | no                    | none    |
| -d       | --delete               | no        | perform delete operations on all records                     | no                    | none    |
| -cf      | --columnFormat         | no        | set specific date format for column                          | no                    | none    |
| -f       | --file `<arg>`         | no        | name of the csv file that contains the data                  | no                    | Genesis looks for a new .csv file whose name matches the name of the source table    |
| -fm      | --formatMode `<arg>`   | no        | FORMATTED takes field formats into account; LEGACY does not  | FORMATTED and LEGACY  | LEGACY  |
| -h       | --help                 | no        | show help on how to use this command                         | no                    | none    |
| -m       | --modify `<arg>`       | no        | key name used to find original record                        | no                    | none    |
| -mf      | --modifyFields `<arg>` | no        | specifies fields to modify (only used with `-m`)             | no                    | none    |
| -quiet   | --quietMode            | no        | make database changes without triggering real-time updates in update queue layer | no                    | none    |
| -r       | --recover              | no        | perform recover operations on all records; this is a special operation meant to preserve the original timestamps; **use with caution**. Only use this when you want to restore a system after completely erasing the database tables. You must use only untouched files from a real back-up of the original dataset. There are no other circumstances in which you should use this option. Ever | no                    | none    |
| -t       | --table `<arg>`        | yes       | the name of the database table to be updated or amended      | must be a valid table | none    |
| -u       | --upsert `<arg>`       | no        | table key name used to upsert records                        | no                    | none    |
| -v       | --verbose              | no        | log every error line to output                               | no                    | none    |

For example:

```bash
SendIt -t FUND -f FUND.csv
```

This reads the **FUND.csv** file in the local directory and inserts the data from the file into the FUND table.

### Modifying and upserting

:::info
You can use SendIt to make changes to the database while the application is running; Data Servers and Consolidators will process any changes in the normal way (for example). But if you are in any doubt that your changes might clash with other changes happening in the application, you should switch off all processes before using SendIt.
:::

To **modify** records, create a .csv file of the records that need to be modified, including the key value and the modified values for each record. Then use SendIt with the `-m` flag to specify the key that identifies the record or records to be modified. **You cannot modify the key that you supply here - although you can modify other key fields (with care).** For example, you can't change an ID in the file and then modify on_BY_ID key. 

The following example:

- looks for a file called **FUND.csv** by default.
- compares each record in the FUND table with the record that has the same ID in the csv file
- applies any changes in the csv record to the record in the table

```bash
SendIt -t FUND -m FUND_BY_ID
```

Modify fields (`-mf`) is an extra parameter that can be added to `-m` operations. SendIt only attempts to modify the record fields specified in this comma-separated list. For example:

```bash
SendIt -t ALL_TRADES -m TRADE_BY_TRADE_ID -mf TRADE_PRICE, TRADE_QUANTITY
```

To **upsert** records, create a .csv file of the records that need to be modified or inserted, including the key value and the relevant values for each record. Then use SendIt with the `-u` flag to specify the key that identifies the original record from each row in the csv file. 

The following example:

- looks for a file called **FUND.csv** by default
- for each record in the FUND table that has a matching ID in the csv, it applies the csv changes to the table
- for any record in the csv file that has no matching ID in the FUND table, the record is inserted into the table

```bash
SendIt -t FUND -u FUND_BY_ID
```
### Deleting
To **delete** records, specify `-d` (or `--delete`)

```bash
SendIt -t FUND -d
```
### Verbose mode

Verbose mode additionally outputs line-by-line operation outcome, and a final summary of error lines to be corrected and resubmitted. This makes `SendIt` useful for scheduled or automated jobs (e.g. daily data loads).

:::warning
Do not use `SendIt` to update User details in any way. This can easily cause database errors. To update User profiles or User attributes, only use Genesis [user entity management](../../../web/micro-front-ends/foundation-entity-management/).
:::

## SetAutoIncrement

:::warning
Stop all your application's processes before using this command.
:::

This command enables you to set the next number to be generated for one or more autoincrementing fields. 

You can set the value for a single field using the `-v` argument.

You can set values for more than one field by supplying the details in a csv file and using the `-f` argument. The file should take the following format:

```
table, field, value
TRADE, TRADE_ID, 1
ORDER, ORDER_ID, 10538
```

By default, this command expects the file to be called **AutoIncrementValues.csv**, but you can specify a different file name.

### Syntax
The `SetAutoIncrement` command can take the following arguments:

| Argument | Argument long name | Mandatory | Description                                                                                           | Restricted values | Default |
|----------|--------------------|-----------|-------------------------------------------------------------------------------------------------------|-------------------|-------|      
| -f       | --file `<arg>`     | no | name of the csv file containing the new sequence numbers (this overrides any --value option supplied) | none | AutoIncrementValues.csv |
| -h       | --help             | no | displays help on using this command                                                                   | none | none | 
| -s       | --field `<arg>`    | no | name of the auto-increment field (when setting the next sequence number for a single field)           | none | none |
| -t       | --table `<arg>`    | no | name of the table that has the auto-increment (when setting the next sequence number for a single field) | none | none |
| -v       | --value `<arg>`    | no | new sequence number (integer) for the autoincrement (when setting the autoincrement for a single field) | none | none |

Note that all fields are optional in principle. But when setting a single field value, you must provide `-t` `-s` and `-v`.

The example below sets the number 101 as the next number to be generated for the TRADE_ID field in the TRADE table.

```bash
SetAutoIncrement -t TRADE -s TRADE_ID -v 101
```

The example below uses the file **autoIncVals** to set autoincrement values for multiple fields.

```bash
SetAutoIncrement -f autoIncVals.csv
```

## SetSequence

:::warning
Stop all your application's processes before using this command.
:::

This command enables you to set the next sequence number for one or more sequence fields. 

- To set the value for a single sequence, use the `-v` argument.

- To set values for more than one sequence, supply the details in a csv file (for example, a file that you have exported using either `GetNextSequenceNumbers` or `GetSequenceCount`) and use the `-f` argument. The file should take the following format:

```
"Table","Sequence","Value"
"USER","US","1303"
"PROFILE","PR","0"
"RIGHT","RI","0"
```

`SetSequence` must only be run when the system processes have been stopped. After running `SetSequence`, you need to [restart the server](../../../operations/commands/server-commands/#startserver-script).

### Syntax
The `SetSequence` command can take the following arguments:

| Argument | Argument long name | Mandatory | Description                                                                                                        | Restricted values | Default|
|----------|--------------------|-----------|--------------------------------------------------------------------------------------------------------------------|---------------|-------|       
| -f       | --file `<arg>`     | no        | name of csv file containing table-sequence-value sets (these override any --sequence and --value options supplied) | none | none |
| -h       | --help             | no        | displays help on how to use the command                                                                            | none | none |
| -s       | --sequence `<arg>` | no        | two-character ID for the sequence (if setting an individual value)                                                 | none | none |
| -t       | --table `<arg>`    | no        | name of the table that contains the sequence (if setting an individual value)                        | none | none |
| -v       | --value `<arg>`    | no        | new integer value to be set (if setting an individual value)                                                       | none | none |

All fields are optional in principle. But if you are setting the value for a single sequence, you must provide a `-t` `-s` and `-v`.

The example below sets the sequence AA in the table TRADE for the TRADE_ID field; the next sequence number to be generated is set to 1001.

```
SetSequence-t TRADE -s AA -v 1001
```
The example below uses the file **SeqVals** to set the next sequence number for multiple sequences.

```bash
SetSequence -f SeqVals.csv
```

## startProcess 

This command starts a Genesis process. 

### Syntax

The command must be followed by the name of the process that you want to start.

The following arguments are also available:

| Argument                   | Argument long name                          | Mandatory | Description                                                                                                                                                                                         | Restricted values | Default |
|----------------------------|---------------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|-------|
| -s HOSTNAME [HOSTNAME ...] | --hostname HOSTNAME HOSTNAME [HOSTNAME ...] | no        | where the application is running on more than one node, this identifies the node where you want to start the process (so you can start a process on a different node). Specify the Host Name | none                |	none   |  
| -c                         | --cluster                                   | no       | starts the process on every node in the cluster     | none                | none   |  
| -v                         | --verbose                                   | no        | starts in verbose mode; logs to the terminal so you can view on screen   | none                | none   |  
|                            | --dump                                      | no        | displays progress of the process, which is useful for debugging                                                                                                                          | none                |		none   |  
   

The following example starts the process called APP_EVALUATOR:

```bash
startProcess APP_EVALUATOR 
```

The following example starts the GENESIS_CLUSTER process and displays any useful debugging information in the console:

```bash
startProcess GENESIS_CLUSTER --dump
```

The following example starts the APP_NOTIFY process on node1 only:

```bash
startProcess APP_NOTIFY -s node1 
```

The script looks in the **processes.xml** file (see startServer below) to find out how to start the process. For example `startProcess AUTH_DATASERVER` starts the process with the correct classpath and extra arguments. Something similar to:

```bash
java -Xmx256m -DXSD_VALIDATE=false global.genesis.dta.dta_process.DtaProcessBootstrap -name AUTH_DATASERVER -scan global.genesis.dta.dataserver -module dataserver -config auth-dataserver.xml -loggingLevel INFO,DATADUMP_OFF >/dev/null 2> $L/AUTH_DATASERVER.log.err &
```


## startServer 

This command starts the server of an application. It reads the **$GC/processes.xml** file to determine which processes to start and how to start them.

### Syntax

The `startServer` command can take the following arguments:

| Argument                    | Argument long name                   | Mandatory | Description                                                                                                                                                                                | Restricted values | Default |
|-----------------------------|--------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|--------|
|  -s HOSTNAME [HOSTNAME ...] | --hostname   HOSTNAME [HOSTNAME ...] | no        | if the application is running on more than one node, this identifies the node where you want to start the server (so you can start a server on a different node). Specify the Host Name | none | none |
|  -c                         | --cluster                            | no        | starts the server on every node in the cluster | none |none |
|  -i                         | --ignoreDaemon                       | no        | avoids killing/starting the daemon | none | none |
| -v                          | --verbose                            | no        | starts in verbose mode; logs to the terminal so you can view on screen   | none   | none   |  

The example below starts the server.

```
startserver
```

The example below starts the server on node1 without starting/killing the daemon.

```
startserver  -s node1 -i
```

The **processes.xml** file looks like this:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<configuration>
    <process name="GENESIS_AUTH_MANAGER">
        <start>true</start>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>auth-manager</module>
        <package>global.genesis.dta.auth.manager</package>
        <classpath>quickfixj-core-2.1.0.jar</classpath>
    </process>
    <process name="GENESIS_AUTH_DATASERVER">
        <start>true</start>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>dataserver</module>
        <package>global.genesis.dataserver</package>
        <config>auth-dataserver.xml</config>
        <loggingLevel>INFO,DATADUMP_OFF</loggingLevel>
    </process>
    <process name="GENESIS_AUTH_PERMS">
        <start>true</start>
        <options>-Xmx512m -DXSD_VALIDATE=false</options>
        <module>auth-perms</module>
        <package>global.genesis.dta.auth.perms</package>
        <dependency>AUTH_MANAGER,AUTH_DATASERVER</dependency>
    </process>
</configuration>
```

Each process property is defined in here, including Java arguments, configuration files, and scripts.

The `dependency` tag defines the processes that the current process is dependent on. In the above example, the GENESIS_AUTH_PERMS process will start after all its dependencies have started.

The `loggingLevel` tag defines the default log level for the process, which is based on slf4j levels. It also accepts DATADUMP_ON/DATADUMP_OFF to declare explicitly that you would like to log all the received/sent network messages.

The `classpath` tag defines additional jar files that might be needed by the microservices. The jar files declared in this section have to be comma-separated; they need to exist within a lib folder for one of the genesis products in the environment. A use case would be to use the **quickfixj** library to parse a fix message within a query definition.


## CreateMissingSqlSequences

:::warning
Stop all your application's processes before using this command.
:::

This command creates sequences in the database for ID fields that rely on auto-generated sequence values.

The command checks to see which sequences exist already, and only creates new sequences where they do not exist. Consequently, if you run the command more than once, you will get the same result each time.

This command is applicable only for SQL databases and should only be executed when you are [enabling Sequences for SQL databases](../../02_database/01_fields-tables-views/02_tables/02_tables-advanced.md#sql-databases).

### Syntax

The `CreateMissingSqlSequences` command has no parameters.

### Working with different databases
The behaviour of this command depends on which database implementation your application uses.

- **If you are using a NOSQL database**, such as Foundation DB, auto-incremented values are assigned in blocks of 100 in order to improve performance. This command sets the value in the database, which corresponds to the first value in the next range to be allocated.

- **If you are using Oracle**, you can **not** set a sequence value directly. This command increments the sequence value by the difference between the current counter value and the desired value. This can have unexpected effects on sequence values that are already assigned in the cache, as the increment is also applied to these values.

And remember, only use this command when all your applications have been stopped. After running `SetAutoIncrement`, you need to restart the server.

## DictionaryBuilder

`DictionaryBuilder` connects to an RDBMS, parses schemas and uses this information to generate a Genesis dictionary. It supports MSSQL and Oracle databases.

The script accepts a series of arguments to establish a connection to the database (e.g. user, password, host, etc) and some specific behaviour (e.g. product name, single dictionary file or composed, etc).

### Syntax

| Short | Long Argument                          | Mandatory | Description                                                                                                               |
|----|----------------------------------------|----|--------------------------------------------------------------------------------------------------------------------------|
| -c | --comments                             |  | Include original SQL in Comments defaults to true                                                                         |
| -d | --databaseName=\<databaseName\>        | Yes | Database name                                                                                                             |
| -h | --help                                 |  | Show this help message and exit.                                                                                          |
| -H | --host=\<hostname\>                    | Yes | The database hostname.                                                                                                    |
| -i | --tableid=\<tableIdStart\>             |  | Table Id start number, defaults = 0                                                                                       |
| -l | --tables=\<tables\>\[,\<tables\>...\]  |  | table list to include, default is all tables                                                                              |
| -o | --output=\<outputDirectory\>           |  | Specifies the output directory for the dictionary files. If the directory does not exist, it will be created             |
| -p | --port=\<port\>                        | Yes | The database port                                                                                                        |
| -P | --password\[=\<password\>\]            | Yes | The database password for the previous username. If no password is provided, the password will be requested interactively |
| -R | --product=\<productName\>              | Yes | Represents the product name and affects the output file                                                                 |
| -s | --sid=\<oracleSidId\>                  |  | The Oracle System ID if using oracle, or the schema ID if using MSSQL                                                    |
| -t | --type=\<databaseType\>                | Yes | Database type, valid values: MSSQL, Oracle, Postgres                                                                      |
| -U | --username=\<username\>                | Yes | Username                                                                                                                  |
| -V | --version                              |  | Print version information and exit                                                                                       |

You can use double-dash notation for any argument.

### Example

```bash
DictionaryBuilder -u TAS -p my_password -db TAS -port 1433 -h db2.ad.genesis.global -t mssql -product tas -o dictionary
```

### How the script behaves

The script tries to connect to the RDBMS currently specified in the arguments. It generates Genesis dictionary fields for column names and their types, and it creates tables with their fields and keys.

There are a few considerations you should be aware of:

* If a column name (e.g. DATE) is found in several tables, and it always has the same type, only one field will be specified in the dictionary. However, if the same column name is found in different tables with different types, a new field will be created for each type, keeping the column name and adding the table name (e.g. CALENDAR) in the following fashion: DATE_IN_CALENDAR. The script will output this event on screen so you can fix the name and/or type it manually later on.
* The types are mapped from [http://docs.oracle.com/javase/8/docs/api/java/sql/Types.html](http://docs.oracle.com/javase/8/docs/api/java/sql/Types.html "http://docs.oracle.com/javase/8/docs/api/java/sql/Types.html") to Genesis dictionary types. Each database can have its own data types, and the JDBC may interpret them differently. For example, in an early test, TIMESTAMP(8) in an Oracle database was interpreted as type OTHER in java.sql.Types. Therefore, this tool is not 100% accurate; you must check the results for correctness.
* If there is no mapping available for the `java.sql.Type` retrieved by the column metadata query, it will be mapped by default to the Genesis dictionary type `STRING`. This event will be shown on standard output too, so you can know that there is an uncommon type that you should take care of.
* Every time a table is successfully parsed, the script will give feedback: `TABLE USERS complete`.
* Views are not parsed.

#### Keys and indexes
Primary keys will be parsed as primary keys in Genesis, whether they are single-column-based or multiple-column-based.

Only unique indexes will be parsed as secondary keys.

There is no concept of foreign keys in Genesis, so these are ignored.

Strings parsed in lower-camel-case format (camelCase) will be transformed to upper-underscore format (UPPER_UNDERSCORE).

### Type mapping

| Genesis Type | JDBC Types |   |   |   |   |   |   |
| -- | -- | -- | -- | -- |
| STRING | CHAR | LONGNVARCHAR | LONGVARCHAR | NCHAR | NVARCHAR | VARCHAR | CLOB |
| LONG | BIGINT |   |   |   |   |   |   |
| RAW | BINARY | LONGVARBINARY | VARBINARY | BLOB |   |   |   |
| INT | INTEGER | SMALLINT | TINYINT |   |   |   |   |
| DOUBLE | FLOAT | DOUBLE |   |   |   |   |   |
| BIGDECIMAL | DECIMAL |   |   |   |   |   |   |
| DATETIME | TIMESTAMP |   |   |   |   |   |   |
| BOOLEAN | BOOLEAN |   |   |   |   |   |   |
| DATE | DATE |   |   |   |   |   |   |
| TIME | TIME |   |   |   |   |   |   |

## ReconcileDatabaseSync

This is used to check if there are differences between a local DB and a remote DB with common dictionary tables.

Typically, this would be used to reconcile tables that are being kept in sync by the GENESIS_SYNC process.

The local DB's details (host, port, user, etc) are read from the system definition file in the local environment. The remote DB's details are specified as options to the command.

The tables to check are specified in the **genesis-sync-definition.xml** file. Here is a simple example that specifies two tables:

```xml
<sync>
    <tables>
        <table name="TRADE"/>
        <table name="ORDER"/>
    </tables>
</sync>
```

If there are any differences found between the local and remote tables, then the result will be output to a text file. The location of this text file will be displayed on screen.
There are 3 categories in the output: "Records Missing From Local", "Records Missing From Remote" and "Records Which Differ Between Remote and Local".

Records are compared using the primary key field. The TIMESTAMP and RECORD_ID fields are extremely likely to differ,
because the tables being compared are in separate databases. Therefore, these fields are not compared.

### Options

| Argument | Argument long name | Mandatory | Description | Restricted Values |
| -- | -- | -- | -- | -- |
| -d | --dblayer | true | Database Layer type | Yes: FDB, FDB2, SQL, SIMPLE |
| -f | --fdb | false | FDB cluster file name |No |
| -H | --host | false | Remote DB hostname |No |
| -P | --port | false | Remote DB port |Yes: Number > 0 |
| -u | --username | false | DB user username |No |
| -p | --password | false | DB user password |No |
| -s | --nullstring | false | Evaluate null and empty strings as equal |No value required |
| -n | --numdays | false | Only compare records with timestamps between now and the number of days specified. If either DB has matching records outside this timestamp range, this will not be flagged as a reconciliation difference |Yes: Number > 0 |
| -i | --ignorefields | false | Comma-separated list of additional fields to ignore ("RECORD_ID" and "TIMESTAMP" are always ignored) |No |
| -h | --help | false | Show usage information |No |

### Examples

This is a simple run with a remote Postgres DB:

```bash
ReconcileDatabaseSync -d SQL -H "jdbc:postgresql://dbhost:5432/" -u dbuser -p dbpass
```

This example runs with a remote Postgres DB. it evaluates null and empty strings as equal; it compares records up to 2 days ago, and it ignores the field STATUS.

```bash
ReconcileDatabaseSync -d SQL -H "jdbc:postgresql://dbhost:5432/" -u dbuser -p dbpass -s -n 2 -i STATUS
```


## AppGen

AppGen can be used to generate a fully working application from a dictionary file.

Usually when creating a application, you would start with a schema; you then build Data Servers, Request Servers and Event Handlers on top to create your application. AppGen automates all this, and will generate the following new files:

- Data Server: _application_**-dataserver.kts**
- Request Server: _application_**-reqrep.kts**
- Event Handler: _application_**-eventhandler.kts**
- System processes: _application_**-processes.xml**
- Service definitions: _application_**-service-definitions.xml

### Data Server and Request Server

One block will be generated for each table in the database, complete with metadata (all fields on the table) and a field block that returns all fields on the table. For Request Servers, the inbound metadata will be based on the primary key.

### Event Handler

The file for the Event Handler contains insert, amend and delete transactions for every table in the database.  All transactions support validation and meta data. If a field is marked as a sequence in the dictionary (i.e. generated ID) then the field is not specified on the metadata for inserts, but it will be specified on modifies and deletes.

Deletes will have reduced metadata, as it is only necessary for the columns to satisfy the primary key to perform the delete.

### Parameters

| Argument | Argument long name | Mandatory | Description | Restricted Values |
| -- | -- | -- | -- | -- |
| -d | dictionary file name | true | the name of the dictionary to read at startup |No |
| -t | table name(s) | false | the table name(s) within the dictionary to read at startup. Multiple tables must be separated by spaces |No |
| -p | port offset | true | the port range to use when generating the services file |No |
| -pn | product name | true | the name of the product to create |No |

### Examples

This example has no `-t` option.

```bash
AppGen -d tas-dictionary.xml -p 4000 -pn tas
```

In this case, the dictionary to read is `tas-dictionary.xml`, the port offset is `4000` and the product name to generate is `tas`. Running this command results in the following structure being created:

```bash
tas/
    /bin
    /cfg/tas-dataserver2.xml
        /tas-fields-dictionary.kts
        /tas-processes.xml
        /tas-reqrep.xml
        /tas-service-definitions.xml
        /tas-system-definition.kts
        /tas-tables-dictionary.kts
    /scripts/tas-tnHandler.gy
```

This example has a `-t` option, which specifies that only the table ORDER USER should be read from the source dictionary.

```bash
AppGen -d tas-dictionary.xml -t ORDER USER -p 4000 -pn tas
```

The ORDER USER table will be appended to the files that were created in the tas folder.

## SSL/TLS Support

### Generating a self-signed keystore and respective certificate (optional)

This step is only required if you are using a self-signed certificate due to the absence of one issued by a proper trusted root authority.

```bash
$ keytool -genkey -keyalg RSA -keysize 2048 -alias selfsigned -storepass Password1233 -keystore keystore.jks -ext SAN=dns:genesisserv1,dns:genesisserv1.ad.genesis.global,dns:genesisserv2,dns:genesisserv2.ad.genesis.global,dns:genesisserv3,dns:genesisserv3.ad.genesis.global,dns:genesisserv4,dns:genesisserv4.ad.genesis.global,ip:193.144.16.43

What is your first and last name?
    [Unknown]:  Fred Bloggs

What is the name of your organizational unit?
    [Unknown]:  IT

What is the name of your organization?
    [Unknown]:  Genesis Global Technology Ltd

What is the name of your City or Locality?
    [Unknown]:  London

What is the name of your State or Province?
    [Unknown]:  Greater London

What is the two-letter country code for this unit?
    [Unknown]:  GB

Is CN=Fred Bloggs, OU=IT, O=Genesis Global Technology Ltd, L=London, ST=Greater London, C=GB correct?
    [no]:  yes

Enter key password for <selfsigned>
    (RETURN if same as keystore password):
```

Assuming no problems with privileges, you will now have a certificate called "selfsigned" with a private key using the same password as the keystore password e.g. Password123.

In our example, this certificate can be found at: /home/exmon/keystore.jks

Please note, however, that this certificate should be stored in another directory outside the application.

The keystore (.jks) is, in a way, the private key to be used in the two-way authentication in the SSL protocol. As such, you need to use it to generate the certificate that has to be installed by the target computers, or to be loaded by the processes that the application intends to communicate with.

```bash
$ keytool -export -alias mykey -file certificate.crt -keystore keystore.jks
```

### Installing TLS certificate in different environments

#### Linux

This varies according to the distribution being used. In Ubuntu:

```bash
$ cp certificate.crt /usr/local/share/ca-certificates/

$ sudo update-ca-certificates
```

#### Windows

Right-click on certificate.crt and select 'Install Certificate'. On 'Place all certificates in the following store', select 'Trusted Root Certification Authorities'.

## Securing Genesis processes

### Setting the process to communication via SSL/TLS

All Genesis modules are defined inside the service definition files:

Syntax:

```bash
~/run/<product>/cfg/<product>-service-definitions.xml
```

Example:

```bash
~/run/exmon/cfg/exmon-service-definitions.xml
```

To enable a process to be set to communicate via SSL, set the `secure` element to `true`.

For example:

```xml
<configuration>
    <service host="localhost" name="EXMON_DATASERVER" port="8911" secure="true"/>
</configuration>
```

### Setting the TLS settings for all processes by default

Open the **genesis-system-definitions.xml** file and edit the values for `DefaultKeystoreLocation`, `DefaultKeystoreLocation` and `DefaultCertificate`.

For example:

```xml
<!-- Required if the processes are to communicate through SSL -->
<Item name="DefaultKeystoreLocation" value="/home/exmon/keystore.jks" />
<Item name="DefaultKeystorePassword" value="Password123" />
<Item name="DefaultCertificate" value="/home/exmon/certificate.crt" />
```

These will be used by all processes to communicate with encrypted processes or to accept connections if they are encrypted themselves.

### Setting the TLS settings for each individual process

:::tip
You can have different processes secured via different certificates, if required.
:::

This setting is used if the develop wants to override the defaults established above for a specific process.

Open the configuration file for the process (as defined in `<product>-processes.xml`). Make sure it has the following settings:-

```xml
<authManager>
    <settings>
        <messaging>
            <keyStoreLocation>
                /home/poc/keystore.jks
            </keyStoreLocation>
            <keyStorePassword>
                Password123
            </keyStorePassword>
        </messaging>
    </settings>
</authManager>
```

Once the files have been saved, run **genesisInstall**. When the processes starts again, it will be secure.

### GUI

To enable the GUI to connect securely, edit the **%ProgramData%\\Genesis\\exmon\\Rel\\Config\\PrimaryServiceConfig.xml** setting `encrypted` to `true`.

#### Example

```xml
<?xml version="1.0"?>
<primary_service xmlns:xsd="[http://www.w3.org/2001/XMLSchema](http://www.w3.org/2001/XMLSchema "http://www.w3.org/2001/XMLSchema")" xmlns:xsi="[http://www.w3.org/2001/XMLSchema-instance](http://www.w3.org/2001/XMLSchema-instance "http://www.w3.org/2001/XMLSchema-instance")">
    <encrypted>true</encrypted>
    <hosts>
    <host name="genesisserv4.ad.genesis.global" port="8001" />
    </hosts>
</primary_service>
```

Note: With encryption, if you are using a self-signed certificate, you must install the certificate.crt in the target machine's operating system as a trusted root CA.

### Web front-end

Install the `certificate.crt` in the target machine's operating system as a trusted root CA. That is all you need to do.
