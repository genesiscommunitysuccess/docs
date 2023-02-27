---
title: 'Evaluator - Introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, evaluator, introduction]
tags:
  - server
  - evaluator
  - introduction
---

[Introduction](../../../server/evaluator/introduction) | [Basics](../../../server/evaluator/basics) |   [Examples](../../../server/evaluator/examples) | [Configuring runtime](../../../server/evaluator/configuring-runtime) | [Testing](../../../server/evaluator/testing)

It is often useful to run tasks periodically - for example to schedule the production of EOD reports, or to send a warning when a defined limit is reached. For such purposes, the Genesis low-code platform provides a feature called the **Evaluator**.

In system terms, evaluators enable you to connect Event Handlers to two different kinds of event: dynamic and static (cron rules).

- **Dynamic Rules**, which are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries, and
- **Cron Rules**, which are scheduling rules; these are defined as [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression).

In both cases, you define the rule in a table in the database: DYNAMIC_RULES for dynamic rules and CRON_RULES for static rules. 
