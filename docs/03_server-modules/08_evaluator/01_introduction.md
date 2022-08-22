---
title: 'Introduction'
sidebar_label: 'Introduction'
id: introduction
---

[Introduction](/server-modules/evaluator/introduction) | [Basics](/server-modules/evaluator/basics) |  [Advanced](/server-modules/evaluator/advanced) | [More examples](/server-modules/evaluator/examples) | [Configuring runtime](/server-modules/evaluator/configuring-runtime) | [Testing](/server-modules/evaluator/testing)

You can use the evaluator to schedule the production of EOD reports (for example), or to send warnings when a defined limit is breached.

In system terms, evaluators enable you to connect event handlers to two different kinds of event: dynamic and static (cron rules).

1. **Dynamic Rules**, which are defined as [groovy expression](https://groovy-lang.org/syntax.html), which respond to changes to database table entries, and
2. **Cron Rules**, which are scheduling rules; these are defined as [standard cron expression](https://en.wikipedia.org/wiki/Cron#CRON_expression).

In both cases, you define the rule in a table in the database: DYNAMIC_RULES for dynamic rules and CRON_RULES for static rules. 