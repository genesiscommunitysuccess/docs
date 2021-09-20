---
id: commands
sidebar_label: The most important commands
sidebar_position: 7
title: The most important commands

---
Once you have created a Genesis project on your server machine, there is a useful subset of commands you can run to start and stop the application server or its individual processes.

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

**startServer _server name_** starts the named process.
It also compresses and moves all log files in `~/run/runtime/logs/` into `~/run/runtime/logs/currentRun`

### killProcess

**killServer _server name_**  stops the named process.
**--force**
Including this flag monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a **SIGKILL** to ensure the process stops. Unsaved data is lost.

### StartGroup

Groups of processes can be defined in the process definition files, where a set of processes is given a `<group>` tag. Typically, all the processes in a particular module are given the same `<group>` tag.

**startGroup _group_ID_** starts all processes in the named group.

It also compresses and moves all log files in `~/run/runtime/logs/` into `~/run/runtime/logs/currentRun`.

## KillGroup

**KillGroup \[group ID\]**
This stops the processes in the named group.
**--force** If you include this flag, the command monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a **SIGKILL** to ensure the process stops. Unsaved data is lost.