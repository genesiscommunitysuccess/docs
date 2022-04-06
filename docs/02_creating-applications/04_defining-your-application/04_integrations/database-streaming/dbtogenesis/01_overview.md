---
sidebar_position: 1
title: Introduction
sidebar_label: Introduction
id: overview

---

[Introduction](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/overview/)  | [Where to define](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-where-to-define/) | [Basics](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-basics/) | [Advanced](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-advanced/) | [More examples](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-examples/) | [Configuring runtime](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-runtime/) | [Testing](/creating-applications/defining-your-application/integrations/database-streaming/dbtogenesis/dbtogenesis-testing/)

## DbToGenesis

The `DbToGenesis` component provides a way of streaming data from a classic RDBMS database, such as Oracle or MSSQL, to a Genesis database.

The process listens to changes in the SQL tables (insert, modify and delete) using a predefined system (triggers for each table to be streamed, procedures and a table to represent an update queue) and reproduces them immediately in the selected Genesis table.

First, you need to configure DbToGenesis so that it has the relevant field and table structures to accept the incoming data.

You need to set up one or more streams, each of which defines a source table and a destination table in Genesis.

You also need to include routines for handling the relevant, insert, modify and delete actions.

Once you have done this, you can run the DbToGenesis command to start the process.