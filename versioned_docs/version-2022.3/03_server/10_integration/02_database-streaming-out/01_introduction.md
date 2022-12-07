---
title: 'DB Streaming Out - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, integration, database streaming out, introduction]
tags:
  - server
  - integration
  - database streaming out
  - introduction
---

[Introduction](../../../../server/integration/database-streaming-out/introduction)  | [Basics](../../../../server/integration/database-streaming-out/basics) | [Advanced](../../../../server/integration/database-streaming-out/advanced) | [Examples](../../../../server/integration/database-streaming-out/examples) | [Configuring runtime](../../../../server/integration/database-streaming-out/configuring-runtime) | [Testing](../../../../server/integration/database-streaming-out/testing)

The **GenesisToDb** module enables you to stream data from the Genesis low-code platform to classic RDBMS databases, such as Oracle or MSSQL.

The process listens to changes in Genesis tables (insert, modify and delete) and immediately reproduces them in the selected RDBMS.

Broadly, you need to do the following things to make GenesisToDb work:

1. Configure your target RDBMS server so that it has the relevant field and table structures to accept the incoming data from Genesis.

2. Set up one or more streams, each of which defines a source table in Genesis and a destination table in your RDBMS.

3. Include routines for handling the relevant insert, modify and delete actions.