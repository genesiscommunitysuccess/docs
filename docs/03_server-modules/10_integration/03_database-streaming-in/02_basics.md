---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

[Introduction](/server-modules/integration/database-streaming-in/introduction)  | [Basics](/server-modules/integration/database-streaming-in/basics) | [Advanced](/server-modules/integration/database-streaming-in/advanced) | [Examples](/server-modules/integration/database-streaming-in/examples) | [Configuring runtime](/server-modules/integration/database-streaming-in/configuring-runtime) | [Testing](/server-modules/integration/database-streaming-in/testing)

This page covers the arguments attached to the `DbToGenesis` script.

## Arguments

Use **startProcess** to start the `DbToGenesis` process. This can take two optional arguments.

- **--clearText** can be passed if you want to use clear text user and passwords in the configuration file, instead of encrypted ones.

- **--force** if passed to the process, this  attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

