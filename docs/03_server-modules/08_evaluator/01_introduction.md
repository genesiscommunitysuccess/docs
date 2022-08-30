---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server-modules/evaluator/introduction) | [Basics](/server-modules/evaluator/basics) |   [Examples](/server-modules/evaluator/examples) | [Configuring runtime](/server-modules/evaluator/configuring-runtime) | [Testing](/server-modules/evaluator/testing)

It is often useful to run tasks periodically - for example to schedule the production of EOD reports, or to send a warning when a defined limit is reached. For such purposes the Genesis low-code platform provides a feature called the **Evaluator**.

In system terms, evaluators enable you to connect event handlers to two different kinds of event: dynamic and static (cron rules).

1. **Dynamic Rules**, which are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries, and
2. **Cron Rules**, which are scheduling rules; these are defined as [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression).

In both cases, you define the rule in a table in the database: DYNAMIC_RULES for dynamic rules and CRON_RULES for static rules. 
