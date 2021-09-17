---
sidebar_position: 1
title: DbToGenesis
sidebar_label: Introduction
id: dbtogenesis

---
##  DbToGenesis

The **DbToGenesis** module provides a way of streaming data from a classic RDBMS database, such as Oracle or MSSQL, to a Genesis database.

The process listens to changes in the SQL tables (insert, modify and delete) using a predefined system (triggers for each table to be streamed, procedures and a table to represent an update queue) and reproduces them immediately in the selected Genesis table.

### Arguments

Use **startProces**s to start the **DbToGenesis** process. This can take two optional arguments.

**--clearTex**t can be passed if you want to use clear text user and passwords in the configuration file, instead of encrypted ones.

**--force** if passed to the process, this  attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

### Configuration

The configuration is similar to **GenesisToDb** (and other Genesis modules). It can be configured through the standard Genesis configuration XML files.

There are two well defined sections: process configuration and database stream configurations.

The process definition is made up of several fields that will set up the main configuration of the process:

_preExpression_ defines dynamic groovy code (methods, imports, etc.) you can add to this module for further usage.