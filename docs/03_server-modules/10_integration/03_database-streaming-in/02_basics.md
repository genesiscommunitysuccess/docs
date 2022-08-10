---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---

This page covers the arguments attached to the `DbToGenesis` script.

## Arguments

Use **startProcess** to start the `DbToGenesis` process. This can take two optional arguments.

- **--clearText** can be passed if you want to use clear text user and passwords in the configuration file, instead of encrypted ones.

- **--force** if passed to the process, this  attempts to re-insert every trade found in our Genesis table to the RDBMS, ignoring previously inserted records.

