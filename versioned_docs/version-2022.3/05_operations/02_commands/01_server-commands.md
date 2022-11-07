---
title: 'Operations - Server Commands'
sidebar_label: 'Server Commands'
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

## genesisInstall script

This script validates all system and product configuration, checking for things such as field duplication.

`genesisInstall` looks at all the folders (apart from runtime and generated), all the modules, and all files in the **cfg** directory. It copies the config files from the **cfg** directory into the **generated** folder. 

In the files collected, the command examines the installation environment and looks for system definition tokens (file names with suffix **.tmplt.xml**). The generated **cfg** file names have their token placeholders replaced with the environment's system definition value for the token, and the suffix will be changed to **.auto.xml**.

The command also checks the system-specific definitions and uses these to replace any definitions that have the same name in any of the modules. Where a  file in **site-specific/cfg** has the same name as a file in a module's **cfg**, the version in **site-specific/cfg** will always be used.

Following this, when you start any process, the 'startProcess' command reads from the **cfg** directory in the **generated** folder.

`genesisInstall` also completes config checking, looking out for mistakes in the configured code and providing warnings and error messages. If an error is encountered, the configuration will not be propagated to the **run/generated/cfg** area.

### Syntax

```bash
genesisInstall [--ignore]
```

| Argument | Argument long name | Mandatory | Description                                                | Restricted values |
|----------|--------------------|-----------|------------------------------------------------------------|-------------------|
|          | --ignore           | no        | If supplied, will ignore errors in the configuration files | No                |
|          | --ignoreHooks      | no        | If supplied, will ignore any install hooks found           | No                |

Once complete, all configuration files will be copied and, where necessary, merged into the **~/run/generated/cfg** file, which we alias as **$GC**.

If any problems are found in the generated configuration files, they will be deleted. This forces you to correct the errors in the original configuration files.

To ignore errors in the configuration files, use the `--ignore` argument. This leaves the configuration files undeleted, even if errors are found.

All process configuration is stored within **$GC**.

## remap script

The remap script reads all dictionary files (fields and table definitions) from **$GC** and remaps the memory-resident database accordingly.

It also generates dao objects based on the dictionary tables, so you can perform database operations in a type-safe way.

Additionally, it will update the Genesis alias store (if running Aerospike or FDB).

The Aerospike DB layer needs UDFs (user defined functions) to work correctly, and these are also generated at this step.

When you run `remap`, the database is automatically locked to ensure that no other `remap` can run concurrently. 

If the database crashes during a `remap` and the database remains locked (or if the database is locked for any other reason), run `remap --force --commit` to unlock the database.

### Syntax

```bash
remap [-c | --commit]
```

| Argument | Argument long name | Mandatory | Description                                                | Restricted values |
|----------|--------------------|-----------|------------------------------------------------------------|-------------------|
|       | --force           | no        | If supplied, will unlock a locked database | No                |
| -c       | --commit           | no        | If supplied, will apply dictionary changes to the database | No                |

If you run remap with no arguments, it simply gives a report of changes that exist in the configuration.

For example:

```bash
==================================

Table Changes

==================================

Added ADMINISTRATOR.NAME

==================================

Field changes

==================================

No changes

==================================

Key changes

==================================

No changes
```

To commit the changes to the database, use the **--commit** argument.

## startProcess script

This script starts a Genesis process. It takes a single positional argument:

`<process name>` and an optional argument `--dump`, to ensure output is shown on screen (useful for debugging).

### Syntax

```bash
startProcess processName [--hostname <[host names]>] [--dump] 
```

`processName` is the name of the process that you want to start.

| Argument                   | Argument long name                          | Mandatory | Description                                                                                                                                                                                         | Restricted values |
|----------------------------|---------------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| -s HOSTNAME [HOSTNAME ...] | --hostname HOSTNAME HOSTNAME [HOSTNAME ...] | No        | where   the application is running on more than one node, this identifies the node where you want to start the process (so you can start a process on a different node). Specify the Host Name | No                |
| -c                         | --cluster                                   | No        | starts  the process on every node in the cluster                                                                                                                                                   | No                |
|                            | --dump                                      | No        | displays progress of the process, which is useful for debugging                                                                                                                          | No                |	
|                            | --coldStart                                      | No        | this is only used if you have a consolidator. Consolidators aggregate data from IN table(s) into an OUT table; a coldStart effectively zeros out values in the OUT table records and then iterating over all the IN table records and rebuilding them on startUp. After this, the consildators in their normal way
 | No                |	

The script looks in the **processes.xml** file (see startServer below) to find out how to start the process. For example `startProcess AUTH_DATASERVER` starts the process with the correct classpath and extra arguments. Something similar to:

```bash
java -Xmx256m -DXSD_VALIDATE=false global.genesis.dta.dta_process.DtaProcessBootstrap -name AUTH_DATASERVER -scan global.genesis.dta.dataserver -module dataserver -config auth-dataserver.xml -loggingLevel INFO,DATADUMP_OFF >/dev/null 2> $L/AUTH_DATASERVER.log.err &
```


## killProcess script

This script is used to terminate a specified process.

### Syntax

```bash
killProcess process_name HOSTNAME [HOSTNAME ...], -s HOSTNAME [HOSTNAME ...] [--force] [--wait]
```

| Argument                     | Argument long name                            | Mandatory | Description                                                                                                                                                                                      | Restricted values |
|------------------------------|-----------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| -s   HOSTNAME [HOSTNAME ...] | --hostname HOSTNAME HOSTNAME   [HOSTNAME ...] | No        | Where   the application is running on more than one node, this identifies the node where you want to kill the process (so you can kill a process on a different node). Specify the Host Name. | No                |
| -f                           | --force                                       |           | forcefully   kills a process (using kill -9)                                                                                                                                                     | No                |
| -w WAIT                      | --wait WAIT                                   | No        | specifies   how many seconds to wait before forcing the kill                                                                                                                                     | No                |
| -c                           | --cluster                                     | No        | kills   the process on every node in the cluster                                                                                                                                                 | No                |

## startServer script

This script reads the **$GC/processes.xml** file to determine which processes to start and how to start them.

### Syntax

```bash
startServer [--hostname <[host names]>] [--ignoreDaemon] 
```

| Argument                    | Argument long name                   | Mandatory | Description                                                                                                                                                                                | Restricted values |
|-----------------------------|--------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
|  -s HOSTNAME [HOSTNAME ...] | --hostname   HOSTNAME [HOSTNAME ...] | No        | If the application is running on more than one node, this identifies the node where you want to start the server (so you can start a server on a different node). Specify the Host Name | No                |
|  -c                         | --cluster                            | No        | Starts the process on every node in the cluster,                                                                                                                                           | No                |
|  -i                         | --ignoreDaemon                       | No        | avoids killing/starting the daemon                                                                                                                                                         | No                |

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

## killServer script

This script reads the **$GC/processes.xml** file to determine which processes to kill. It will prompt for confirmation (`Are you sure you want to kill server? (y/n):`), unless you specify `--force`.

### Syntax

```bash
killServer [--hostname <[hosts names]>] [--force]
```


| Argument                     | Argument long name                            | Mandatory | Description                                                                                                                                                                                                                          | Restricted values |
|------------------------------|-----------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| -s   HOSTNAME [HOSTNAME ...] | --hostname HOSTNAME HOSTNAME   [HOSTNAME ...] | No        | Where the application is running  on more than one node, this identifies the node where you want to kill the server (so you can kill a server on a different node). Specify the Host Name, Host Names or "cluster" for all hosts | No                |
| -f                           | --force                                       | No        | forcefully kills a process (using kill -9)                                                                                                                                                                                         | No                |
|                              | --all                                         | No        | kills all processes, including   GENESIS_CLUSTER                                                                                                                                                                                     | No                |
| -c                           | --cluster                                     | No        | kills the server on all the nodes in the cluster                                                                                                                                                                                   | No                |    

## DbMon script

This script enables you to navigate through the database tables from the command line.

Once inside `DbMon`, you can run the command 'help', which shows all the available DbMon commands. 
To get help on a specific command, run `help _command_`.

`DbMon --quietMode` performs database changes without triggering real-time updates in the update queue layer.

### Syntax

```bash
DbMon
```

```bash
==================================

Database Monitor

Enter 'help' for a list of commands

==================================
```

| Command                  | Argument                                    | Description                                     |
|--------------------------|---------------------------------------------|-------------------------------------------------|
| autoIncrementNumber      | `<field_name>`                              |                                                 |
| clear                    |                                             | clears the current context                      |
| count                    |                                             | counts the rows in the table                    |
| delete                   |                                             | deletes the current row                         |
| deleteWhere              | `<condition>`                               | deletes all matching rows in the selected table |
| displayFields            | `<field_names>`                             |                                                 |
| distinct                 | `<condition> [-where <limiting_condition>]` |                                                 |
| find                     | `<key_name>`                                |                                                 |
| first                    | `<key_name>`                                |                                                 |
| forceAutoIncrementNumber | `<field_name> <sequence_number>`            |                                                 |
| forceSequenceNumber      | `<sequence_name> <sequence_number>`         |                                                 |
| help                     |                                             | lists all commands                              |
| insert                   |                                             | inserts the current row                         |
| last                     | `<key_name>`                                | gets the last record by key                     |
| listAll                  | `<key_name> <num_key_fields> <max_records>` |                                                 |
| next                     | `<key_name>`                                | gets the next record by key                     |
| set                      | `<field_name> <field_value>`                | sets a field                                    |
| unset                    |                                             | sets a field to `null`                          |
| update                   | `<key_name>`                                | updates the current row by key                  |
| updateWhere              | `<condition> <assignments>`                 |                                                 |
| writeMode                |                                             | enables write mode                              |


## SendIt script

To send data into the database, use the `SendIt` command.

### Syntax

```bash
SendIt -t <table name> -f <file name>
```

| Argument | Argument long name     | Mandatory | Description                                                    | Restricted values |
|----------|------------------------|-----------|----------------------------------------------------------------|-------------------|
| -a       | --all                  | No        | import all the tables from all the csv files to the database | No                |
| -d       | --delete               | No        | perform delete operations on all records                     | No                |
| -f       | --file `<arg>`         | No        | name of the csv file where table is imported                 | No                |
| -h       | --help                 | No        | show usage   information                                       | No                |
| -m       | --modify `<arg>`       | No        | key name used to find original record                        | No                |
| -mf      | --modifyFields `<arg>` | No        | specifies fields to modify                                     | No                |
| -quiet   | --quietMode            | No        | make database changes without triggering real-time updates in update queue layer | No |
| -r       | --recover              | No        | perform recover operations on all records; this is a special operation meant to preserve the original timestamps; **use with caution**. Only use this when you want to restore a system after completely erasing the database tables. You must use only untouched files from a real back-up of the original dataset. There are no other circumstances in which you should use this option. Ever | No                |
| -t       | --table `<arg>`        | No        | the name of the table to import to the database                  | No                |
| -v       | --verbose              | No        | log every error line to output                               | No                |

For example:

```bash
SendIt -t FUND -f FUND
```

This reads the FUND.csv file in the local directory and insert the data from the file into the FUND table.

To modify records you, need to specify the key that will be used to identify the original record from the each row in the csv file. If you want to modify a key field, you need to ensure the lookup key does not use this field; for example, you can't change an ID in the file and then modify on _BY_ID key.

```bash
SendIt -t FUND -m FUND_BY_ID
```

Modify fields (`-mf`) is a special parameter that can be added to `-m` operations. SendTable will only attempt to modify the record fields specified in this comma-separated list parameter.

To delete records, specify `-d` (or `--delete`)

```bash
SendIt -t FUND -d
```

If no file parameter is specified, `.csv` is assumed and read from the local directory.

Verbose mode will additionally output line-by-line operation outcome, and a final summary of error lines to be corrected and resubmitted. This makes the script useful for scheduled or automated jobs (e.g. daily data loads).

## DumpIt script

To copy data from a Genesis database, use the 'DumpIt' command.

### Syntax

| Argument | Argument long name | Mandatory | Description                                            | Restricted values |
|----------|--------------------|-----------|--------------------------------------------------------|-------------------|
| -a       | --all              | No        | exports all tables to csv                              | No                |
| -f       | --file `<arg>`     | No        | name of the csv file where table is exported           | No                |
|          | -fields `<arg>`    | No        | space separated field list e.g. "FIRST_NAME LAST_NAME" | No                |
| -h       | --help             | No        | show usage information                                 | No                |
| -s       | --sql `<arg>`      | No        | name of the sql file where table is exported           | No                |
| -t       | --table `<arg>`    | No        | the name of the table to export to csv                 | No                |
|          | -where `<arg>`     | No        | match criteria e,g, "USER_NAME=='John'"                | No                |
For example:

```bash
DumpIt -t USER -where "USER_NAME=='John'" -fields "USER_NAME
```

This copies the data in the FUND table to FUND.csv.

Another example:

```bash
DumpIt -t FUND -f FUND -fields "FUND_ID NAME" -where "NAME == 'FUND_FUND' && YEARS_IN_SERVICE >= 10"
```

This copies the FUND_ID and NAME fields of every record that has "FUND_FUND" for a name, and ten or more years in service.

If you want to dump all the tables in the database, here is an example:

```bash
DumpIt --all
```

This copies all tables in the system, creating one .csv file for each table in the database. The files are saved in the current directory. It is useful for taking a back-up of the current system database.

Additionally, you can just run `DumpIt` without any arguments to enter interactive mode.

## RenameFields script
This script is used to rename a field name in a database without changing the dictionary or config files.

### Syntax
The `RenameFields` script takes two arguments; both of which are mandatory:

```bash
RenameFields [-i <[current name of field]>] [-o  <[new name of field]>]
```

| Argument | Argument long name | Mandatory | Description                              | Restricted values |
|----------|--------------------|-----------|------------------------------------------|-------------------|
| -i       | --input            | yes       | name of field that you want to change    | No                |
| -o       | --output           | yes       | name you want the field to be changed to | No                |



The `--input` argument represents the name of the field you would like to change. The argument must be an existing field name in the database.
The `--output` argument represents the name of the field you would like to change to. The argument must also be an existing field name in the database.
Both arguments must also be of the same type.
If both arguments are in the same table, it would result in the `--output` field being deleted.
All changes using `RenameFields` can be changed back to the original database schema by using the command `remap --commit`.

For example:

```bash
RenameFields -i SYMBOL -o TRADE_ID
```

This changes the name of SYMBOL field to TRADE_ID.     

Another example:

```bash
RenameFields --input FIRST_NAME --output FNAME 
```

This changes the name of the field FIRST_NAME to FNAME

Invalid example:

```bash
RenameFields -i PRICE -o FIRST_NAME
```

This would result in an error as PRICE is of type DOUBLE while FIRST_NAME is of type STRING.

## LogLevel script

To dynamically change the logging levels on any Genesis process, use the LogLevel command.

### Syntax

```bash
LogLevel -p <process-name> -l <log level> -t <time> [-optional params] -c <class-name> -DATADUMP_ON -DATADUMP_OFF
```

| Argument                               | Argument long name                   | Mandatory | Description                                                                           | Restricted values |
|----------------------------------------|--------------------------------------|-----------|---------------------------------------------------------------------------------------|-------------------|
| -c                                     |  --class `<class name>`              | No        | changes log level on the defined class                                                | No                |
|                                        | -DATADUMP_NACK_OFF                   | No        | changes log level to INFO for Genesis messages                                        | No                |
|                                        | -DATADUMP_NACK_ON                    | No        | changes log level to TRACE and captures only _NACK messages from Genesis messages     | No                |
|                                        |  -DATADUMP_OFF                       | No        | changes the log level to info for Genesis messages                                    | No                |
|                                        |  -DATADUMP_ON                        | No        | changes the log level to trace for Genesis messages                                   | No                |
| -h                                     |  --help                              | No        | show usage information                                                                | No                |
| -l                                     |  --level `<log level>`               | No        | log level - if log level is not correct it will be set automatically to   DEBUG level | No                |
| -p _process-name_,..,_process-name_  |                                      | No        | attaches processes to the command                                                     | No                |
| -r _process-name_,..,_process-name_`  |                                      | No        | remove processes                                                                      | No                |
|                                        | -STATUSDUMP_OFF                      | No        | changes the log level to info for status updates                                      | No                |
|                                        | -STATUSDUMP_ON                       | No        | changes the log level to trace for status updates                                     | No                |
| -t `<time>`                            |                                      | No        | duration of log level change in min/sec Eg: 1m, 1000s                                 | No                |

## mon script

This script shows the status of the overall system, so you can see if the server is up or not.

```bash
***************************************************************************

                                GENESIS Monitor

                            Version:  GENESIS 5.0.0.0

***************************************************************************



Start: 2021-08-22 12:46:48                                  Uptime: 5 hours

Date:  20121-08-22 17:47:10                               Cluster status: OK



PID     Process Name                  Port        Status         CPU       Memory

==================================================================================

9480    AUTH_CONSOLIDATOR             8006        RUNNING        0.30      1.60

9392    AUTH_DATASERVER               8002        RUNNING        0.30      1.70

9359    AUTH_MANAGER                  8001        RUNNING        0.30      1.60

9419    AUTH_PERMS                    8003        RUNNING        0.30      1.80
```

### Syntax

```bash
mon [-v | -c | -a] polling_interval
```

Options

| Argument | Argument long name | Mandatory | Description                                  | Restricted values |
|----------|--------------------|-----------|----------------------------------------------|-------------------|
| -h       | --help             | No        | show this help message and exit              | No                |
| -v       | --version          | No        | Shows installed products versions.           | No                |
| -c       | --cfg              | No        | Shows the config files used by each process. | No                |
| -a       | --all              | No        | Shows all information.                       | No                |

## DropTable

To remove database tables and all corresponding records instantly, use the `DropTable` command.

### Syntax 
The command takes a flag of `-t`, followed by a list of space-separated table names, for example:

```bash
DropTable -t TABLE_NAME1 TABLE_NAME2 TABLE_NAME3
```

The command will ask you to confirm the removal of each table.

## PopulateHolidays

This script populates the Holidays table with holidays, based on a specific year(s), country(ies) and region(s).

### Syntax

```bash
PopulateHolidays
```

| Argument | Argument long name | Mandatory |               Description               | Restricted values |
|----------|--------------------|-----------|-----------------------------------------|-------------------|
| -c       | --country `<arg>`  | No        | the country name to search for holidays | No                |
| -h       | --help             | No        | show usage information                  | No                |
| -r       | --region `<arg>`   | No        | the region name to search for holidays  | No                |
| -y       | --year `<arg>`     | No        | the year of holidays                    | No                |

For example: 

```bash
PopulateHolidays -y 2020,2021 -c BR,GB -r rj,en
```


## CountRecords

This counts the number of records in the database, grouped by table, and prints to screen.

### Syntax
By default, the command provides the record count for each table defined in the dictionary. If you only want a count for specific tables, you can specify a space-separated list of those tables.

This example gives a record count for all tables:

```bash
CountRecords
```

This example gives a record count for two specific Tables:

```bash
CountRecords TABLE_NAME1 TABLE_NAME2 ...
```

## MigrateAliases

This migrates the Genesis alias store from database storage to file storage and vice versa.

### Syntax

```bash
MigrateAliases FILE

MigrateAliases DATABASE
```

Aerospike and FDB implementations use internal aliases for fields and tables. Migrating these aliases from database to a file will help to debug problems in the data storage.

- If you are running Genesis on a single node, use a file store 
- If you are running Genesis on more than one node, use database mode .

The "remap" operation will update the alias store, so if you are running a Genesis cluster it is better to use a database storage mode, as it is less error-prone and you won't have to copy the alias storage file to the remaining nodes manually.

## MigrateDictionary

This migrates the Genesis dictionary from the Database Dictionary Store to the File Dictionary Store storage and vice versa.

### Syntax

```bash
MigrateDictionary
```

The script uses the system definition file to get the `DictionarySource` property.

If the property is `DB`, the server uses a Database Dictionary Store), then the `MigrateDictionary` script saves a dictionary to a file.

If the `DictionarySource` is `FILE` (the server uses a File Dictionary Store), then the dictionary is saved to a database. The target database type - `DbLayer` - is retrieved from the system definitions file.

Here is a recommendation:

- Use a file store (set by default) if you are running Genesis in a single node
- Use database store if you are running Genesis in more than one node

The `remap` operation will update the dictionary, so if you are running a Genesis cluster, it is better to use a Database Dictionary Store, as it is less error-prone and the user won't have to copy the dictionary file to the remaining nodes manually.

It is potentially dangerous to switch the `DictionarySource` property. If you run `remap` (which modifies the  dictionary) after `MigrateDictionary` and before switching the `DictionarySource` property, the file store and database store could contain different dictionaries and it is not safe to switch between them.

## GetNextSequenceNumbers

This finds all the dictionary sequences and prints the next sequence number for each one of them. It displays the results on screen in csv format, so it is easy to redirect the output and reuse it with the `SetSequence` script (see below).

### Syntax

```bash
GetNextSequenceNumbers
```

## GetSequenceCount

This gets the current sequence number for all the sequences in the system. The values can be printed on screen or written to a file so they can be reused by the `SetSequence` script (see below).

### Syntax

```bash
GetSequenceCount
```

| Argument | Argument long name | Mandatory |               Description               | Restricted values |
|----------|--------------------|-----------|-----------------------------------------|-------------------|
| -f       | --file `<arg>`     | No        |                                         | No                |
| -h       | --help             | No        | show usage information                  | No                |
| -p       | --print            | No        |                                         | No                |

## GetAutoIncrementCount

This works similarly to `GetSequenceCount`, but for auto increment INT values defined in dictionaries.

### Syntax

```bash
GetAutoIncrementCount
```

| Argument | Argument long name | Mandatory |               Description               | Restricted values |
|----------|--------------------|-----------|-----------------------------------------|-------------------|
| -f       | --file `<arg>`     | No        |                                         | No                |
| -h       | --help             | No        | show usage information                  | No                |
| -p       | --print            | No        |                                         | No                |

## SetSequence

This enables you to change a sequence number, or to do a bulk change for all the sequence in a ".csv" file. In mpst cases, this will be one that you have exported previously using either `GetNextSequenceNumbers` or `GetSequenceCount`.

### Syntax

```bash
SetSequence
````

Options: 

| Argument | Argument long name | Mandatory |               Description                                                                              | Restricted values |
|----------|--------------------|-----------|--------------------------------------------------------------------------------------------------------|-------------------|       
| -f       | --file `<arg>`     | No        |  Name of csv file for batch sequence/value pairs to be read from (overrides sequence and value option) | No                |
| -h       | --help             | No        |                                                                                                        | No                |
| -s       | --sequence `<arg>` | No        |  Two Character ID for the sequence (if setting individual value)                                       | No                |
| -v       | --value `<arg>`    | No        |  New integer value to be set (if setting individual value)                                             | No                |

## SetAutoIncrement

This works in a smilar way to `SetSequence` but for auto increment INT values.

### Syntax

```bash
SetAutoIncrement
```

| Argument | Argument long name | Mandatory |               Description                                                                              | Restricted values |
|----------|--------------------|-----------|--------------------------------------------------------------------------------------------------------|-------------------|       
| -f       | --file `<arg>`     | No        | Name of csv file for batch sequence/value pairs to be read from (overrides sequence and value option)  | No                |
| -h       | --help             | No        |                                                                                                        | No                | 
| -s       | --field `<arg>`    | No        |                                                                                                        | No                |
| -t       | --table `<arg>`    | No        |                                                                                                        | No                |
| -v       | --value `<arg>`    | No        |                                                                                                        | No                |

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
| -d | --dblayer | true | Database Layer type | Yes: FDB, FDB2, AEROSPIKE, SQL, SIMPLE |
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

This is a simple run with a remote postgres DB:

```bash
ReconcileDatabaseSync -d SQL -H "jdbc:postgresql://dbhost:5432/" -u dbuser -p dbpass
```

This example runs with a remote postgres DB. it evaluates null and empty strings as equal; it compares records up to 2 days ago, and it ignores the field STATUS.

```bash
ReconcileDatabaseSync -d SQL -H "jdbc:postgresql://dbhost:5432/" -u dbuser -p dbpass -s -n 2 -i STATUS
```

## PurgeTables

This enables you to define the data-retention policy. Data will be removed from the database where the defined criteria are fulfilled.

Example: For the TRADE table, we could decide to keep allocated trades for 60 days, and 30 days for the rest.

To use this tool, you must have an _application_**-purger.kts* file in the application's config folder. Invoking the **PurgeTables** command will pick up all  files that are found in the **$GENESIS_HOME/generated/cfg/** directory.

In order to enable syntax highlighting and autocompletion for purger files, you must add **genesis-environment** as a dependency of your application's **-config** module. See simple examples below for purger definitions:

A log file called **purge_{*time_of_run*}** will be created under the **$GENESIS_HOME/runtime/logs/** folder.

The functions and filters below give you different ways of purging data.

### Inject repository
You can inject any repository into the purger script; for example:

```kotlin
purgers{
    val userSessionRepo = inject<UserSessionRx2Repository>()
}
```

### Purge by date

The purger supports purging based on days. You can specify the max age of record in terms of calendar days or business days.
Business days disregard weekends and public holidays.

To use this you need to supply
- a LONG or DATETIME field in the table to be used, or you can supply just table name and TIMESTAMP field of table will be used to calculate the age of the record.
- Also max age of record, which indicates all the records older than these days will be purged
- Optional fields when you use business days: `country` and `region` name.

```kotlin
purgers {
 // purge trades over 6 months old based on field TRADE_DATE
 daysPurger(TRADE.TRADE_DATE, 180)
 // purge trades over 6 months old based on field TIMESTAMP of table which will be used internally 
 daysPurger(TRADE, 180)

 // purge prices older than 5 business days based on PRICE_DATETIME
 businessDaysPurger(PRICE.PRICE_DATETIME, 5)
 // purge prices older than 5 business days based on PRICE_DATETIME in country SPAIN
 businessDaysPurger(PRICE.PRICE_DATETIME, 5, "SPAIN")
}
```

### Purge by range:
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

### Purge bulk data:

You can purge data of whole table by using

```kotlin
bulkPurger(USER_SESSION)
```
You can purge data of table based on some conditions

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

Following filters are used in the examples explained above:

`whereRange`: This filter can contain value of the table-index parameter or parameters if there are more than one field in the table-index. Parameter list can range from 1-10.
It filters the records based on the index parameter value/values

`filter`: filter based on predicate provided

`filterBusinessDays`: this method allows to purge data based on business date. 
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

## AppGen

AppGen can be used to generate a fully working application from a dictionary file.

Usually when creating a application, you would start with a schema; you then build data servers, request servers and event handlers on top to create your application.  AppGen automates all this, and will generate the following new files:

- Data server: _application_**-dataserver.kts**
- Request server: _application_**-reqrep.kts**
- Event handler: _application_**-eventhandler.kts**
- Sytem processes: _application_**-processes.xml**
- Service definitions: _application_**-service-definitions.xml

### Data server and request server

One block will be generated for each table in the database, complete with metadata (all fields on the table) and a field block that returns all fields on the table.  For request servers, the inbound metadata will be based on the primary key.

### Event handler

The file for the event handler contains insert, amend and delete transactions for every table in the database.  All transactions support validation and meta data. If a field is marked as a sequence in the dictionary (i.e. generated ID) then the field is not specified on the metadata for inserts, but it will be specified on modifies and deletes.

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

In this case, the dictionary to read is `tas-dictionary.xml`, the port offset is `4000` and the product name to generate is `tas`.  Running this command results in the following structure being created:

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
