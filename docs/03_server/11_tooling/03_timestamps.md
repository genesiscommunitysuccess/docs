---
title: 'Timestamps - GenesisFlake'
sidebar_label: 'Timestamps'
id: code-snippets
keywords: [timestamps, flake, genesisflake]
tags:
  - timestamps
  - flake
  - genesisflake
---

The Genesis low-code platform provides monotonically increasing timestamps while ensuring high performance levels. This is GenesisFlake, which provides id generation implementation based on Twitter’s [snowflake](https://developer.twitter.com/en/docs/basics/twitter-ids).

In simple terms, GenesisFlake generates unique IDs based on the current timestamp without having to perform database-level synchronisation. Additionally, these IDs contain:

- a node number (which represents the node id within a genesis cluster)
- a sequence number (used to differentiate IDs generated within the same millisecond)

## Format
The timestamp itself is stored in the most significant bits of a LONG variable, leaving the least significant bits to node id and sequence number.

The `DbMon` and `DumpIt` scripts, plus the `toString()` method on GenesisSet and DbRecord instances, all make a best-effort approach to printing the timestamp value. 

The new GenesisFlake timestamp is printed as: 

- epoch time in milliseconds
- node id
- sequence id. 

In more detail, the raw value for this timestamp is 6626101958220449352.

You can extract its timestamp component using [bitwise](https://miniwebtool.com/bitwise-calculator/bit-shift/) right-shift operations. For example:

![](/img/bitwise.png)

The result in decimal corresponds to 1579785813861, which can be checked in https://www.epochconverter.com/

![](/img/epoch.png)


