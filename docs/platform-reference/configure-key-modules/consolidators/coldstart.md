---
title: The importance of a cold start
sidebar_label: The importance of a cold start
id: advanced
sidebar_position: 30

---


Here's the thing. If you turn off the Consolidator process for any reason, you should almost certainly perform a cold start when you restart the process. This ensures that any changes to data while the process was not running are properly recalculated before any real-time calculations are triggered.

:::warning
If you simply restart the consolidator process, then changes to data that occurred while the process was not running will not be recalculated. Got that? The changed data will not be recalculated.
:::


## The **startProcess** command (cold start)

To make a cold start, run the command 

`startProcess --coldStart`

This  consolidates all records in the system before starting the real-time event-driven consolidations. 

At the beginning of a cold start, all fields in `consolidationFields` of the consolidation table are zeroed (or deleted, if transient) before initiating the re-consolidation of all the records in the database.


