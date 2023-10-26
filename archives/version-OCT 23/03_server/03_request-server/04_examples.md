---
title: 'Request Server - examples'
sidebar_label: 'Examples'
id: examples
keywords: [server, request server, examples]
tags:
  - server
  - request server
  - examples
---

You define your application's Request Server in a kotlin script file called _application-name_**-reqrep.kts**. 

import Example1 from '/examples/requestserver/_reqrep1.md'
import Example2 from '/examples/requestserver/_reqrep2.md'
import Example3 from '/examples/requestserver/_reqrep3.md'

Below is an example of a **reqrep.kts** file where the single `requestReply` code block includes a `where` clause. You can find out more about `where` clauses on the [Basics](../../../server/request-server/basics/#where-block) page.

<Example1 />

Below is a **reqrep.kts** file that has a fairly simple `requestReply` codeblock with standard `request` and `reply` statements. The [`where` block](../../../server/request-server/basics/#where-block) filters out any data that does not meet the conditions. All data that is returned will have an instrumentCode equal to the request parameter INSTRUMENT_CODE. 

<Example2 />

In the example below, we have modified the example above to include two restrictions:
- The maximum number of rows to be returned is 5.
- The process will time out if no response is received for 15 seconds.

<Example3 />