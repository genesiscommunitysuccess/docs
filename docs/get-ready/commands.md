---
sidebar_label: 'Important Commands'
---

# The most important commands

:::danger WIP
Full format needed. Needs a simple intro
:::

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
**startServer *server name*** starts the named process.
It also compresses and moves all log files in `~/run/runtime/logs/` into `~/run/runtime/logs/currentRun`


### killProcess
**killServer *server name***  stops the named process.
**--force**
Including this flag monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a **SIGKILL** to ensure the process stops. Unsaved data is lost.

### StartGroup
Groups of processes can be defined in the process definition files, where a set of processes is given a `**<group>**` tag. Typically, all the processes in a particular module are given the same `**<group>**` tag.

:::danger WIP
* (assume tag = group_ID - perfer to use just one of these.)
* (simple code example of a defined process.)
* (including the name of the proc definition file.)
:::

**startGroup *group_ID*** starts all processes in the named group.

It also compresses and moves all log files in `~/run/runtime/logs/` into `~/run/runtime/logs/currentRun`.


KillGroup [group ID]
This stops the processes in the named group.
--force
Including this flag monitors the progress of the kill on each process. If a process is still running after 10 seconds, it runs a SIGKILL to ensure the process stops. Unsaved data is lost