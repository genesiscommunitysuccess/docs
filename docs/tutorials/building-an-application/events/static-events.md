---
id: static-events
title: Cron jobs (static events)
sidebar_label: Cron jobs (static events)
sidebar_position: 1

---
In this exercise you are going to create a cron rule that will trigger a batch job that will run once each day.. 

The batch job will generate a position csv for each counterparty and store it in **runtime/position-daily-report**. The file name will have the form COUNTERPARTY_ID-DATE.csv 

1\. Configure GENESIS_EVALUATOR in genesis-processes.xml.

Make a copy of **genesis-processes.xml** and place it in site-specific/cfg. There should be an example there of GENESIS_EVALUATOR we can enable. 

Run **genesisInstall** to verify that it works as expected.

Run **mon** to see the process: