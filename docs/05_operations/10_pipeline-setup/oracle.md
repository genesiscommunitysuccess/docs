---
title: 'Pipeline setup - Oracle DB'
sidebar_label: 'Oracle DB'
id: oracle
sidebar_position: 4
keywords: [operations, pipeline, setup, oracle db]
tags:
    - operations
    - pipeline
    - setup
    - introduction
    - oracle db
---

:::note
CDC capabilities are only supported by Oracle Enterprise edition. Ensure that your Oracle instance is the Enterprise version before continuing.
:::

## Enable CDC on Oracle

Run the following script in the machine running the database, substituting `top_secret` for the `sys` password set up on the database. You can also substitute `c##dbzuser` and `dbz` for the username and password you want for the LogMiner username and password you want.

```bash
#!/bin/sh

# This file is based on docs at https://debezium.io/documentation/reference/stable/connectors/oracle.html#setting-up-oracle and the linked Debezium Vagrant Box for Oracle DB GitHub repository.

# Set archive log mode and enable GG replication

mkdir /opt/oracle/oradata/recovery_area
ORACLE_SID=ORCLCDB
export ORACLE_SID
sqlplus /nolog <<- EOF
	CONNECT sys/top_secret AS SYSDBA
	alter system set db_recovery_file_dest_size = 10G;
	alter system set db_recovery_file_dest = '/opt/oracle/oradata/recovery_area' scope=spfile;
	shutdown immediate
	startup mount
	alter database archivelog;
	alter database open;
        -- Should show "Database log mode: Archive Mode"
	archive log list
	exit;
EOF

# Enable LogMiner required database features/settings
sqlplus sys/top_secret@//localhost:1521/ORCLCDB as sysdba <<- EOF
  ALTER DATABASE ADD SUPPLEMENTAL LOG DATA (ALL) COLUMNS;
  ALTER PROFILE DEFAULT LIMIT FAILED_LOGIN_ATTEMPTS UNLIMITED;
  exit;
EOF

# Create Log Miner Tablespace and User
sqlplus sys/top_secret@//localhost:1521/ORCLCDB as sysdba <<- EOF
  CREATE TABLESPACE LOGMINER_TBS DATAFILE '/opt/oracle/oradata/ORCLCDB/logminer_tbs.dbf' SIZE 25M REUSE AUTOEXTEND ON MAXSIZE UNLIMITED;
  exit;
EOF

sqlplus sys/top_secret@//localhost:1521/ORCLPDB1 as sysdba <<- EOF
  CREATE TABLESPACE LOGMINER_TBS DATAFILE '/opt/oracle/oradata/ORCLCDB/ORCLPDB1/logminer_tbs.dbf' SIZE 25M REUSE AUTOEXTEND ON MAXSIZE UNLIMITED;
  exit;
EOF

sqlplus sys/top_secret@//localhost:1521/ORCLCDB as sysdba <<- EOF
  CREATE USER c##dbzuser IDENTIFIED BY dbz DEFAULT TABLESPACE LOGMINER_TBS QUOTA UNLIMITED ON LOGMINER_TBS CONTAINER=ALL;
  GRANT CREATE SESSION TO c##dbzuser CONTAINER=ALL;
  GRANT SET CONTAINER TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ON V_\$DATABASE TO c##dbzuser CONTAINER=ALL;
  GRANT FLASHBACK ANY TABLE TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ANY TABLE TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT_CATALOG_ROLE TO c##dbzuser CONTAINER=ALL;
  GRANT EXECUTE_CATALOG_ROLE TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ANY TRANSACTION TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ANY DICTIONARY TO c##dbzuser CONTAINER=ALL;
  GRANT LOGMINING TO c##dbzuser CONTAINER=ALL;
  GRANT CREATE TABLE TO c##dbzuser CONTAINER=ALL;
  GRANT LOCK ANY TABLE TO c##dbzuser CONTAINER=ALL;
  GRANT CREATE SEQUENCE TO c##dbzuser CONTAINER=ALL;
  GRANT EXECUTE ON DBMS_LOGMNR TO c##dbzuser CONTAINER=ALL;
  GRANT EXECUTE ON DBMS_LOGMNR_D TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ON V_\$LOGMNR_LOGS TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ON V_\$LOGMNR_CONTENTS TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ON V_\$LOGFILE TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ON V_\$ARCHIVED_LOG TO c##dbzuser CONTAINER=ALL;
  GRANT SELECT ON V_\$ARCHIVE_DEST_STATUS TO c##dbzuser CONTAINER=ALL;
  exit;
EOF
```

Create a database user with the following script, substituting your desired username and password for `genesis` and `test`, and also the `sys` password set up on the database for `top_secret`.

```bash
#!/bin/sh

# Create Genesis database user
sqlplus sys/top_secret@//localhost:1521/ORCLPDB1 as sysdba <<- EOF
  CREATE USER genesis IDENTIFIED BY test;
  GRANT CONNECT TO genesis;
  GRANT CREATE SESSION TO genesis;
  GRANT ANY PRIVILEGE TO genesis;
  GRANT CREATE TABLE TO genesis;
  GRANT CREATE SEQUENCE to genesis;
  GRANT UNLIMITED TABLESPACE TO genesis;
  exit;
EOF
```

## Connecting Debezium

Here are some settings specific to setting up the Oracle Debezium connector.

| Setting | Value |
| --- | --- |
| databaseName | ORCLCDB |
| pdbName | ORCLPDB1 |
| username | c##dbzuser |
| password | dbz |

If you set your LogMiner username and password to something different, substitute the values above for the ones you chose.

## Connecting to the database

Connect to the database using the username and password you chose above for the Genesis user. Also, connect to the PDB database, which is `ORCLPDB1` by default.