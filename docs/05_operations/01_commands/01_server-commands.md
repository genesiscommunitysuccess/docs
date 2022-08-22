---
title: 'Server Commands'
sidebar_label: 'Server Commands'
id: server-commands
---

Genesis has numerous built-in commands that have their own individual functions.
This page goes through them and details the function, parameters and use cases of those commands. 

## Starting and stopping the server

The commands for starting and stopping the application or specific processes are straightforward.

### startServer

This starts all the processes in the application. If any processes are running already, they are not affected.
The command also compresses and moves all log files in `~/run/runtime/logs/` and `~/run/runtime/logs/currentRun` into `~/run/runtime/logs/archive/<datetime startServer was run>`

### killServer

This stops all the processes in the application, except for the GENESIS_CLUSTER process.

You can use the following flags.
**--all**
Including this flag also stops the GENESIS_CLUSTER process.
**--force**
Including this flag monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a SIGKILL to ensure the process stops. Unsaved data is lost.

### startProcess

`startServer [server_name]`  starts the named process.
It also compresses and moves all log files in `~/run/runtime/logs/` into `~/run/runtime/logs/currentRun`

### killProcess

`killServer [server_name]`  stops the named process.
**--force**
Including this flag monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a **SIGKILL** to ensure the process stops. Unsaved data is lost.

### startGroup

Groups of processes can be defined in the process definition files, where a set of processes is given a `<group>` tag. Typically, all the processes in a particular module are given the same `<group>` tag.

`startGroup [group_ID]` starts all processes in the named group.

It also compresses and moves all log files in `~/run/runtime/logs/` into `~/run/runtime/logs/currentRun`.

## killGroup

`killGroup [group_ID]`
This stops the processes in the named group.
**--force** If you include this flag, the command monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a **SIGKILL** to ensure the process stops. Unsaved data is lost.

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
