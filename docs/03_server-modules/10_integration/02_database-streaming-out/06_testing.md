---
title: 'Testing'
sidebar_label: 'Testing'
id: testing
---

[Introduction](/server-modules/integration/database-streaming-out/introduction)  | [Basics](/server-modules/integration/database-streaming-out/basics) | [Advanced](/server-modules/integration/database-streaming-out/advanced) | [Examples](/server-modules/integration/database-streaming-out/examples) | [Configuring runtime](/server-modules/integration/database-streaming-out/configuring-runtime) | [Testing](/server-modules/integration/database-streaming-out/testing)

There is no way to programmatically test the `GenesisToDb` module, but it should be possible to manually do so by
inserting, modifying or deleting data in Genesis and then checking the results in the target RDBMS.