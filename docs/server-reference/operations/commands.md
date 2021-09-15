---
id: commands
title: Commands
sidebar_label: Commands
sidebar_position: 1

---
Once an application has been built and zipped, you can install it in any another system that contains the Genesis LCNC platform.

To ensure a correct installation, you must follow the product installation procedure.

## installRelease script

The installRelease script takes two arguments: one mandatory and one optional:

```
installRelease productFile [-c | --commit]
```

If the commit option is not specified, the product will not be installed, but the full installation process will be shown, including changes, missing dependencies or any other kind of issues.

This is how the script behaves:

First it gets the **productname-product-details.xml** information from the product zip file, and it verifies the correctness of this file.

It checks if a previous installation of the application is present. (Is there a version of the same application installed by installRelease in the system?) This always happens, whether you used the **--commit** option or not. In case we do have an installation underway, the installation will stop at this point. If you want to force the installation, delete the folder "new" under GENESIS_HOME/releases/(productname)v.(version)/. For more information see points 4 and 5.

At this point dependencies will be checked. If any dependency is not met (missing products, or old versions) the product will not be installed. If any installed dependency has a higher version than the dependency version specified in the product details, the script will ask the user for confirmation.

The script will also check for overridden configuration and script files, whether the product we are installing is currently installed or not. If the product is already installed be sure to merge every overridden configuration and script files with the new product before committing the new installation.

* If the product is not currently installed and the **--commit** option is specified, the application will be installed. A new back-up folder is created in GENESIS_HOME/releases/(_applicationnam_e)v.(version)/ with all the installation files.
* If the product is already installed in any version, the script will perform a reinstall/upgrade/downgrade. In case of downgrade, a warning message will be displayed, asking for extra confirmation. Two back-up (folders) will be created inside GENESIS_HOME/releases/, one for the old installation and one for the new installation. If the **--commit** option was specified, the product will also be installed in the system.

Details to take into account:

**installRelease** will try to use **global-product-details.xml** inside GENESIS_HOME/generated/cfg/ as its first information source. This file is generated when the **genesisInstall** script is executed, which gathers information from each installed product and stores it inside this global file. If this file does not exist, **installRelease** searches for independent productname-product-details.xml files in every installed product. If no information is found, the installation will be cancelled.

Execute **genesisInstall** after installing an application, so that the application details are stored in global-product-details.xml for future product installations.

## genesisInstall script

This scriptscript validates all system and product configuration, checking for things such as field duplication.

```
genesisInstall [--ignore]
```

Once complete, all configuration files will be copied and, where necessary, merged into the **\~/run/generated/cfg** file, which we alias as **$GC**.

If any problems are found in the generated configuration files, they will be deleted, which forces the user to correct the errors in the original configuration files.

To ignore errors in the configuration files, use the **--ignore** argument. This leaves the configuration files undeleted, even if errors are found.

All processes configuration is stored within $**GC**.

## remap script

The remap script reads all dictionary files (fields and table definitions) from **$GC** and remaps the memory resident database accordingly.

It also generates dao objects based on our dictionary tables, so we can perform database operations in a type safe way.

Additionally, it will update the Genesis alias store (if running Aerospike or FDB).

The Aerospike DB layer needs UDFs (user defined functions) to work correctly, and they are also generated at this step.

Syntax:

```
remap [-c | --commit]
```

If we run remap with no arguments it simple gives a report of changes that exist in the configuration.

For example:

```
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

To commit the changes to the database use the **--commit** argument.

## startProcess script

This script starts a Genesis process. It takes a single positional argument:

`<process name>` and an optional argument "--dump", to ensure console output is shown on screen (useful for debugging).

Syntax

```
startProcess processName [--hostname <[host names]>] [--dump] 
```

**processName** name of the process that you want to start

**--hostname HOSTNAME \[HOSTNAME ...\], -s HOSTNAME \[HOSTNAME ...\]**	where the application is running on more than one node, this identifies the node where you want to start the process (so you can start a process on a different node). Specify the Host Name.

**--cluster, -c** starts the process on every node in the cluster

**-- dump**	displays progress of starting the process, which is usful for debugging

The script looks in the **processes.xml** file (see startServer below) to find out how to start the process. For example `startProcess AUTH_DATASERVER` starts the process with the correct classpath and extra arguments. Something similar to:

```
java -Xmx256m -DXSD_VALIDATE=false global.genesis.dta.dta_process.DtaProcessBootstrap -name AUTH_DATASERVER -scan global.genesis.dta.dataserver -module dataserver -config auth-dataserver.xml -loggingLevel INFO,DATADUMP_OFF >/dev/null 2> $L/AUTH_DATASERVER.log.err &
```

## killProcess script

This script is used to terminate a specified process.

Syntax

```
killProcess process_name HOSTNAME [HOSTNAME ...], -s HOSTNAME [HOSTNAME ...] [--force] [--wait]

--hostname HOSTNAME HOSTNAME [HOSTNAME ...], -s HOSTNAME [HOSTNAME ...]	Where the application is running on more than one node, this identifies the node where you want to kill the process (so you can kill a process on a different node. Specify the Host Name.

--force, -f           forcefully kills a process (using kill -9)

--wait WAIT, -w WAIT  specifies how many seconds to wait before forcing the kill

--cluster, -c         kills the process on every node in the cluster
```

## startServer script

This script reads the **$GC/processes.xml** file to determine which processes to start and how to start them.

Syntax

```
startServer [--hostname <[host names]>] [--ignoreDaemon] 

processName           name of the process that you want to start

--hostname HOSTNAME [HOSTNAME ...], -s HOSTNAME [HOSTNAME ...]	Where the application is running on more than one node, this identifies the node where you want to start the server (so you can start a server on a different node. Specify the Host Name.

--cluster, -c         starts the process on every node in the cluster

--ignoreDaemon, -i    avoids killing/starting the daemon
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
        <dependency>AUTH_MANAGER,AUTH_DATASERVER </dependency>
    </process>
</configuration>
```

Each process property is defined in here, including JAVA arguments, configuration files, and scripts.

The dependency tag defines the processes that the current process is dependent on. In the above example, the GENESIS_AUTH_PERMS process will start after all its dependencies have started.

The **loggingLevel** tag defines the default log level for the process, which is based on slf4j levels. It also accepts DATADUMP_ON/DATADUMP_OFF to explicitly declare that you would like to log all the received/sent network messages.

The classpath tag defines additional jar files that might be needed by the microservices. The jar files declared in this section have to be comma-separated and need to exist within a lib folder for any of the genesis products in the environment. A use case would be to use the **quickfixj** library to parse a fix message within a query definition.

## killServer script

:::danger WIP
Double check this section
:::

This script reads the **$GC/processes.xml** file to determine which processes to kill. It will prompt

Syntax

```
[--hostname <[hosts names]>] [--force]
```

This command requires user confirmation: '**Are you sure you want to kill server? (y/n):** Alternatively, you can use **-force** to skip it.

optional arguments

**--hostname HOSTNAME HOSTNAME \[HOSTNAME ...\], -s HOSTNAME \[HOSTNAME ...\]**	Where the application is running on more than one node, this identifies the node where you want to kill the server (so you can kill a server on a different node. Specify the Host Name.

                        Hosts Name or "cluster" for all hosts

**--force, -f**           forcefully kills a process (using kill -9)

**--all**                 kills all processes, including GENESIS_CLUSTER

**--cluster, -c**         kills the server on all the nodes in the cluster

## DbMon script

This script enables you to navigate through the database tables from the command line.

Syntax:

```
DbMon
```

Once inside DbMon you can run the command **help**, which shows all the available commands.

```
==================================

Database Monitor

Enter 'help' for a list of commands

==================================

DbMon>help

==================================

Help Menu

==================================

autoIncrementNumber <field_name>

clear

count

delete

deleteWhere <condition>

displayFields <field_names>

distinct <condition> \[-where <limiting_condition>\]

find <key_name>

first <key_name>

forceAutoIncrementNumber <field_name> <sequence_number>

forceSequenceNumber <sequence_name> <sequence_number>

h

insert

last <key_name>

listAll <key_name> <num_key_fields> <max_records>

next <key_name>

qsearch <condition> \[-l <limit>\]

qshow

search <condition> \[-l <limit>\]

sequenceNumber <sequence_name>

set <field_name> <field_value>

show

showKeys

showTables

table <table_name>

unset

update <key_name>

updateWhere <condition> <assignments>

writeMode
```

Usage

**DbMo**n has built-in help instruction for each command. Run `help <command>` to get more information.

## SendIt script

To send data into the database, use the SendIt command.

Syntax

```
SendTable -t <table name> -f <file name>

Available options (use -h for help):

    -a,--all                      import all the tables from all the csv

                                files, to the database

    -d,--delete                   perform delete operations on all records

    -f,--file <arg>               name of the csv file where table is

                                imported

    -h,--help                     show usage information

    -m,--modify <arg>             key name used to find original record

    -mf,--modifyFields <arg>   specify fields to modify

    -r,--recover                  perform recover operations on all records

    -t,--table <arg>              the name of the table to import to database

    -v,--verbose                  log every error line to output
```

For Example:

```
SendIt -t FUND -f FUND
```

This reads the FUND.csv file in the local directory and insert the data from the file into the FUND table.

To Modify records you, need to specify the key that will be used to identify the original record from the each row in the csv file. If you want to modify a key field, you need to ensure the lookup key does not use this field; for example, you can't change an ID in the file and then modify on _BY_ID key.

```
SendIt -t FUND -m FUND_BY_ID
```

Modify fields (-mf) is a special parameter that can be added to "-m" operations. SendTable will only attempt to modify the record fields specified in this comma-separated list parameter.

To Delete records you need to specify `-d` (or `--delete`)

```
SendIt -t FUND -d
```

If no file parameter is specified, `.csv` is assumed and read from the local directory.

Recover (`-r`) is a special operation meant to preserve original timestamp and should only be used when restoring a completely empty table. **Use with caution**.

Verbose mode will additionally output line by line operation outcome, and a final summary of error lines to be corrected and resubmitted. This makes the script useful for scheduled/automated jobs (e.g. daily data loads)

DumpIt script

To copy data out of a Genesis database, use the DumpIt command.

Syntax:

```
usage: DumpIt

    -a,--all           exports all tables to csv

    -f,--file <arg>    name of the csv file where table is exported

    -fields <arg>      space separated field list e.g. "FIRST_NAME LAST_NAME"

    -h,--help          show usage information

    -s,--sql <arg>     name of the sql file where table is exported

    -t,--table <arg>   the name of the table to export to csv

    -where <arg>       match criteria e,g, "USER_NAME=='John'"
```

For Example:

```
DumpIt -t USER -where "USER_NAME=='John'" -fields "USER_NAME
```

This copies the data in the FUND table to FUND.csv.

Another example:

```
DumpIt -t FUND -f FUND -fields "FUND_ID NAME" -where "NAME == 'FUND_FUND' && YEARS_IN_SERVICE >= 10"
```

This copies the FUND_ID and NAME fields of every record that has "FUND_FUND" for a name, and ten or more years in service.

Dumping all the tables example:

```
DumpIt --all
```

This copies all tables in the system, creating one .csv file for each table in the database. The files are saved in the current directory. It is useful for taking a backup of the current system database.

Additionally, you can just run **DumpIt** without any arguments to enter interactive mode.

## LogLevel script

To dynamically change the logging levels on any Genesis process, use the LogLevel command.

Logging level in scripts is set by default to WARN. To change the level, set the environment variable GENESIS_LOGGING_VEL to_  of the following ERROR, WARN, INFO, DEBUG, TRACE.

Not setting GENESIS_LOGGING_LEVEL or setting a non-valid level will reset log level to default.

Syntax:

```
LogLevel -p <process-name> -l <log level> -t <time> [-optional

                        params] -c <class-name> -DATADUMP_ON -DATADUMP_OFF or
    
                        setLogLevel -r <process-name> [-optional params] -c
    
                        <class-name>
    
        Available options (use -h for help):
    
            -c,--class <class name>                changes log level on the defined
    
                                                class
    
            -DATADUMP_OFF                          changes the log level to info for
    
                                                Genesis messages
    
            -DATADUMP_ON                           changes the log level to trace for
    
                                                Genesis messages
    
            -h,--help                              show usage information
    
            -l,--level <log level>                 log level - if log level is not
    
                                                correct it will be set
    
                                                automatically to DEBUG level
    
            -p <process-name>,.., <process-name>   attaches processes to the command
    
            -r <process-name>,..,<process-name>    remove processes
    
            -t <time>                              duration of log level change in
    
                                                min/sec Eg: 1m, 1000s
```

## mon script

This script shows the status of the overall system, so you can see if the server is up or not.

```
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

Usage

```
mon \[-v | -c | -a\] polling_interval

Options:

    -h, --help     show this help message and exit

    -v, --version  Shows installed products versions.

    -c, --cfg      Shows the config files used by each process.

    -a, --all      Shows all information.
```

## DropTable

To instantly remove database tables with all corresponding records, use the DropTable command.

The command takes a flag of **-**t followed by a list of space-separated table names.

For example:

**DropTable -t TABLE_NAME1 TABLE_NAME2 TABLE_NAME3**

Confirmation of removal is required for each table.

## PopulateHolidays

To populate the Holidays table with holidays based on a specific year(s), country(ies) and region(s), use the Populate command.

The usage: 

```
PopulateHolidays

    -c,--country <arg>   the country name to search for holidays

    -h,--help            show usage information

    -r,--region <arg>    the region name to search for holidays

    -y,--year <arg>      the year of holidays
```

For example: `PopulateHolidays -y 2020,2021 -c BR,GB -r rj,en`


## CountRecords

This counts the number of records in the database, grouped by table, and prints to screen.

Can either give the record count for each table defined in the dictionary, or of a provided space separated list, i.e.:

All Tables:
```
CountRecords
```

Specific Tables:

```
CountRecords TABLE_NAME1 TABLE_NAME2 ...
```

## MigrateAliases

This migrates the Genesis alias store from database storage to file storage and vice versa.

Usage

```
MigrateAliases FILE

MigrateAliases DATABASE
```

Aerospike and FDB implementations use internal aliases for fields and tables. Migrating these aliases from database to a file will help to debug problems in the data storage.

It is recommended to use a file store if you are running Genesis in a single node and database mode if you are running Genesis in more than one node.

The "remap" operation will update the alias store, so if you are running a Genesis cluster it is better to use a database storage mode, as it is less error prone and the user won't have to manually copy the alias storage file to the remaining nodes manually.

## MigrateDictionary

This migrates the Genesis dictionary from Database Dictionary Store to File Dictionary Store storage and vice versa.

Usage:

```
MigrateDictionary
```

The script uses a system definition file to get the **DictionarySource** property.

If the property is **DB** (the server uses a Database Dictionary Store), then the **MigrateDictionary** script saves a dictionary to a file.

If the **DictionarySource** is **FILE** (the server uses a File Dictionary Store), then the dictionary is saved to a database. The target database type - **DbLayer** - is retrieved from the system definitions file.

It is recommended that you use a file store (set by default) if you are running Genesis in a single node and database store if you are running Genesis in more than one node.

The **remap** operation will update the dictionary, so if you are running a Genesis cluster, it is better to use a Database Dictionary Store, as it is less error-prone and the user won't have to manually copy the dictionary file to the remaining nodes manually.

It is potentially dangerous to switch the **DictionarySource** property. If you run **remap** (which modifies the  dictionary) after **MigrateDictionary** and before switching **DictionarySource** property, the file store and database store could contain different dictionaries and it is not safe to switch between them.

## GetNextSequenceNumbers

This finds all the dictionary sequences and prints the next sequence number for each one of them. It displays the results on screen in  csv format, so it is easy to redirect the output and reuse it with the **SetSequence** script (see below).

Usage:

```
GetNextSequenceNumbers
```

## GetSequenceCount

Gets the current sequence number for all the sequences in the system. The values can be printed on screen or written to a file so they can be reused by "SetSequence" script (see below)

Usage:

```
GetSequenceCount

    -f,--file <arg>

    -h,--help         show usage information

    -p,--print
```

## GetAutoIncrementCount

This works like the **GetSequenceCount**, but for auto increment INT values defined in dictionaries.

Usage

```
GetAutoIncrementCount

    -f,--file <arg>

    -h,--help         show usage information

    -p,--print
```

## SetSequence

Allows the user to change a sequence number, or to do a bulk change for all the sequence in a ".csv" file (usually exported previously using GetNextSequenceNumbers or GetSequenceCount)

Usage:

```
SetSequence

    -f,--file <arg>       Name of csv file for batch sequence/value pairs to

                        be read from (overrides sequence and value option)

    -h,--help

    -s,--sequence <arg>   Two Character ID for the sequence (if setting

                        individual value)

    -v,--value <arg>      New integer value to be set (if setting individual

                        value)
```

## SetAutoIncrement

This works like **SetSequenc**e but for auto increment INT values.

Usage:

```
SetAutoIncrement

    -f,--file <arg>    Name of csv file for batch sequence/value pairs to be

                    read from (overrides sequence and value option)

    -h,--help

    -s,--field <arg>

    -t,--table <arg>

    -v,--value <arg>
```

## GenesisRun

This is a python script wrapper for Genesis scripts.

GenesisRun will attempt to find a script to execute within the genesis folder structure (e.g site-specific or scripts).

There are two environment variables that can be used to configure how much RAM the scripts will use:

* SCRIPT_MAX_HEAP
* REMAP_MAX_HEAP

**GenesisRun** can execute code in two different modes: Groovy script and GPAL Kotlin script. **GenesisRun** builds the necessary classpath, so you don't need to build it in each script.

1. Groovy script: GenesisRun SetLogLevelScript.groovy
2. GPAL Kotlin script: GenesisRun customPurger-script.kts

There is a separate wrapper, **JvmRun** for Java main class scripts.

## DictionaryBuilder

This is a groovy script which can be executed with **GenesisRun** or **JVMRun**.

DictionaryBuilder parses RDBMS schemas and uses this information to generate a Genesis dictionary. It supports MSSQL and Oracle databases.

The script accepts a series of arguments to establish a connection to the database (e.g. user, password, host, etc) and some specific behaviour (e.g. product name, single dictionary file or composed, etc).

### Arguments

| Argument | Argument long name | Mandatory | Description | Restricted Values |
| -- | -- | -- | -- | -- |
|  -t  type | -type type | Yes | This argument represents the database type (Oracle or MSSQL). | Yes: ora or mssql |
|  -t  type | -type type | Yes | This argument represents the database type (Oracle or MSSQL). | Yes: ora or mssql |
| -u user | -username user | Yes | The database username. | No |
| -p pass | -password pass | Yes | The database password for the previous username. | No |
| -product name |   | Yes |  Represents the product name and affects the output file. For example: "tas-dictionary.xml" | No |
| -singleFile |   | No | If this argument is passed the generated dictionary will be written into a single file, instead of having a separate file for just the fields. | No |
| -o outputPath | -output outputPath | No | Specifies the output directory for the dictionary files. If the directory does not exist it will be created. | No |
| -h hostName | -host hostName | Yes | The database hostname. | No |
| -port port |   | Yes | The database port. | No |
| -sid sid |   | No | The Oracle System ID. | To be used with -t ora |
| -db databaseName | -databaseName databaseName | No | The database name. | To be used with -t mssql |
| -help |   | No | Prints the usage message | No |
| -tNames TABLE1,ETC | -tableNames TABLE1,ETC   | No | Tables to copy from RDBMS | No |

It is also possible to use the double dash notation for any argument. Arguments -sid or -db are not mandatory (as they can change from one database to another) but they should be passed accordingly when necessary.

### Example

```
DtaRun DictionaryBuilder.groovy -u TAS -p fght123 -db TAS -port 1433 -h db2.ad.genesis.global -t mssql -product tas -o dictionary
```

### How the script behaves

The script tries to connect to the RDBMS currently specified in the arguments. It generates Genesis dictionary fields for column names and their types, and it creates tables with their fields and keys.

There are a few considerations we should be aware of:

* If a column name (e.g. DATE) is found across several tables but has the same type, only one field will be specified in the dictionary. Contrarily, if the same column name is found in different tables with different types, a new field will be created keeping the column name and adding the table name (e.g. CALENDAR) in the following fashion: DATE_IN_CALENDAR. The script will output this event on screen so we can fix the name and/or type manually later on.
* The types are mapped from [http://docs.oracle.com/javase/8/docs/api/java/sql/Types.html](http://docs.oracle.com/javase/8/docs/api/java/sql/Types.html "http://docs.oracle.com/javase/8/docs/api/java/sql/Types.html") to Genesis dictionary types. As a matter of fact, each database can have their own data types, and the JDBC may interpret them differently. For example, in an early test, TIMESTAMP(8) in an Oracle database was interpreted as type OTHER in java.sql.Types. Therefore this tool is not 100% accurate and results should be checked for correctness.
* If there is no mapping available for the java.sql.Type retrieved by the column metadata query, it will be mapped by default to the Genesis dictionary type "STRING". This event will be shown on standard output too, so we can know there is an uncommon type we should take care of.
* Every time a table is successfully parsed, the script will give feedback: "TABLE USERS complete".
* VIEWS won't be parsed.
* Regarding keys and indexes.
* Primary keys will be parsed as primary keys in Genesis, whether they are single column based or multiple column based.
* Only unique indexes will be parsed as secondary keys.
* There is no concept of foreign keys in Genesis, so foreign keys will be ignored.
* Strings parsed in lower camel case format (camelCase) will be transformed to upper underscore format (UPPER_UNDERSCORE).

### Types mapping

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

### ProductGen

ProductGen can be used to generate a fully working dta product from a dictionary file.

Usually when creating a product you would start with a schema and then build data servers, request replies and transaction handlers on top to create your product.  ProductGen automates all of this, and will generate the following:

### Data server and Request Server

One block will be generated per table, complete with meta data (all fields on table) and a field block (returning all fields on table).  For request server the inbound meta data will be based on primary key.

### Transaction handler

Groovy transaction handler complete with insert, amend and delete transactions.  All transactions support validation and meta data.  If a field is marked as a sequence in the dictionary (i.e. generated ID) then the field is not specified on the meta data for inserts, but will be specified on modifies/deletes.

Deletes will have a reduced metadata as we only require the columns to satisfy the primary key to do the delete.

### Static files

Standard files will be generated, i.e. processes.xml and service-definitions.xml

## Parameters

| Argument | Argument long name | Mandatory | Description |
| -- | -- | -- | -- |
| -d | dictionary file name | true | the name of the dictionary to read at startup |
| -t | table name(s) | false | the table name(s) of the dictionary to read at startup. It could be more than one tables separated by space |
| -p | port offset | true | the port range to use when generating services file |
| -pn | product name | true | the name of the product to create |

## Example Usage

Example without -t option.

```
\~/run/genesis/scripts/unix/productGen -d tas-dictionary.xml -p 4000 -pn tas
```

In this case we are specifying the dictionary to read is tas-dictionary.xml, the port offset is 4000 and the product name to generate is tas.  Running this command results in the following structure being created:

```
tas/
    /bin
    /cfg/tas-dataserver.xml
        /tas-dictionary.xml
        /tas-fields.xml
        /tas-processes.xml
        /tas-requestserver.xml
        /tas-service-definitions.xml
    /scripts/tas-tnHandler.gy
```

Example with -t option.

```
\~/run/genesis/scripts/unix/productGen -d tas-dictionary.xml -t ORDER USER -p 4000 -pn tas
```

The tables mentioned in the above command will be appended to the files that were created in tas folder

### SSL/TLS Support

#### Generating a self-signed keystore and respective certificate (optional)

This step is only required if using a self-signed certificate due to the absence of a proper trusted root authority issued one.

```
$ keytool -genkey -keyalg RSA -keysize 2048 -alias selfsigned -storepass Password1233 -keystore keystore.jks -ext SAN=dns:genesisserv1,dns:genesisserv1.ad.genesis.global,dns:genesisserv2,dns:genesisserv2.ad.genesis.global,dns:genesisserv3,dns:genesisserv3.ad.genesis.global,dns:genesisserv4,dns:genesisserv4.ad.genesis.global,ip:193.144.16.43

What is your first and last name?

    \[Unknown\]:  Fred Bloggs

What is the name of your organizational unit?

    \[Unknown\]:  IT

What is the name of your organization?

    \[Unknown\]:  Genesis Global Technology Ltd

What is the name of your City or Locality?

    \[Unknown\]:  London

What is the name of your State or Province?

    \[Unknown\]:  Greater London

What is the two-letter country code for this unit?

    \[Unknown\]:  GB

Is CN=Fred Bloggs, OU=IT, O=Genesis Global Technology Ltd, L=London, ST=Greater London, C=GB correct?

    \[no\]:  yes

Enter key password for <selfsigned>

        (RETURN if same as keystore password):
```

Assuming no problems with privileges you will now have a certificate called "selfsigned" with a private key using the same password as the keystore password e.g. Password123.

In our example this certificate can be found here: /home/exmon/keystore.jks

Please note, however, that this certificate should be stored in another directory outside of this product in case it should be shared among multiple products in the same machine and then simply creating a symbolic link to it. For example, it could be stored in /etc/genesis-certs/ and then linked into /home/exmon/ and /home/oems.

The keystore (.jks) is, in a way, the private key to be used in the two-way authentication in the SSL protocol. As such, we need to use it to generate the certificate that needs to be installed by the target computers/loaded by the processes that intend to communicate with.

```
$ keytool -export -alias mykey -file certificate.crt -keystore keystore.jks
```

## Installing TLS certificate in environment

### Linux

Varies according to the distribution being used. In Ubuntu:

```
$ cp certificate.crt /usr/local/share/ca-certificates/

$ sudo update-ca-certificates
```

### Windows

Right-click on certificate.crt and select 'Install Certificate'. On 'Place all certificates in the following store', select 'Trusted Root Certification Authorities'.

## Securing a Genesis processes

### Setting the process to communication via SSL/TLS

All Genesis modules are defined inside the service definition files:

Syntax:

```
\~/run/<product>/cfg/<product>-service-definitions.xml
```

Example:

```
\~/run/exmon/cfg/exmon-service-definitions.xml
```

To enable a process to be set to communicate via SSL set the secure element to be true.

Example:

```xml
<configuration>
    <service host="localhost" name="EXMON_DATASERVER" port="8911" secure="true"/>
</configuration>
```

### Setting the TLS settings for all processes by default

Edit the _dta-system-definitions.xml_ file and edit the values for DefaultKeystoreLocation, DefaultKeystoreLocation and DefaultCertificate.

    Example:

```xml
<!-- Required if the processes are to communicate through SSL -->
<Item name="DefaultKeystoreLocation" value="/home/exmon/keystore.jks" />
<Item name="DefaultKeystorePassword" value="Password123" />
<Item name="DefaultCertificate" value="/home/exmon/certificate.crt" />
```

These will be used by all processes to communicate with encrypted processes or to accept connections if they are encrypted themselves.

### Setting the TLS settings for each individual process (you can have different processes secured via different certificates if required).

This setting is used if the develop wants to override the defaults established above for a specific process.

Edit the process' configuration file (as defined in `<product>-processes.xml`)

To have the following settings:-

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

## GUI

To enable the GUI to  connect securely, edit the **%ProgramData%\\Genesis\\exmon\\Rel\\Config\\PrimaryServiceConfig.xml** setting **encrypted** to **true**.

### Example

```xml
<?xml version="1.0"?>
<primary_service xmlns:xsd="[http://www.w3.org/2001/XMLSchema](http://www.w3.org/2001/XMLSchema "http://www.w3.org/2001/XMLSchema")" xmlns:xsi="[http://www.w3.org/2001/XMLSchema-instance](http://www.w3.org/2001/XMLSchema-instance "http://www.w3.org/2001/XMLSchema-instance")">
    <encrypted>true</encrypted>
    <hosts>
    <host name="genesisserv4.ad.genesis.global" port="8001" />
    </hosts>
</primary_service>
```

Note: With encryption, if using a self-signed certificate, you must install the certificate.crt in the target machine's operating system as a trusted root CA.

## Web front-end

Install the `certificate.crt` in the target machine's operating system as a trusted root CA. That is all you need to do.