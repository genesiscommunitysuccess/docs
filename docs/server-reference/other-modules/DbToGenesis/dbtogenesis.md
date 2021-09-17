---
sidebar_position: 1
title: DbToGenesis
sidebar_label: Introduction
id: dbtogenesis

---
\# DbToGenesis

The DbToGenesis module provides a way of streaming data from a classic RDBMS database, such as Oracle or MSSQL, to a Genesis database. 

The process listens to changes in the SQL tables (insert, modify and delete) using a predefined system (triggers for each table to be streamed, procedures and a table to represent an update queue) and reproduces them immediately in the selected Genesis table.

\## Arguments

This module can be passed two arguments when using **startProcess**.

\**--clearText** can be passed if we would like to use clear text user and passwords in our the configuration file, instead of encrypted ones.

\**--force** if passed to the process it will attempt to re-insert every trade found in our RDBMS table to Genesis, ignoring previously inserted records.

\## Configuration

It uses a similar configuration approach very similar to other Genesis modules like RequestServer or DataServer and especially GenesisToDb.

It is configured through the standard Genesis configuration XML files.

The configuration is made up of two well-defined sections: process configuration and Genesis stream configurations.

The process definition is made up of several fields that will setup the main configuration of the process: