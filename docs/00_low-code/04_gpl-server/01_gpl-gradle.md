---
title: 'gpl-server-gradle README'
sidebar_label: 'gpl-server-gradle README'
id: gpl-server-gradle
---

# gpl-gradle

- `GplPlugin` contains the gradle tasks for IR and code generation
- `GplSettingsPlugin` generates the genesis server project

# gradle tasks

- `generateAll`: The task that would be used the most. Runs all the below tasks.

We have the below as individual tasks to take advantage of gradle's incremental build system.

- `generateIR`: generates UI IR as json file (output location configurable using gpl gradle settings plugin) and generates IR json files for Server resources (dictionaries, event handlers etc).
`kspKotlin` will run as part of this task.
- `generateConfig`: generates server config files (e.g. processes.xml and service-definitions.xml)
- `generateFields`: generates server fields dictionary file
- `generateTables`: generates server tables dictionary file
- `generateViews`: generates server views dictionary file
- `generateEventHandler`: generates server event handler file
- `generateDataServer`: generates server data server file
- `generateConsolidator`: generates server consolidator file