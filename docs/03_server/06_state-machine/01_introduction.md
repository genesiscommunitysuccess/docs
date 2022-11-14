---
title: 'State Machine - introduction'
sidebar_label: 'Introduction'
id: introduction
keywords: [server, state machine, introduction]
tags:
  - server
  - state machine
  - introduction
---



One of the key things you need to define in your data model is the various states that your financial entities (such as orders or trades) can go through - for example, new, amended, completed or cancelled.

Separately from this, you need to define State Machines that control how the entity transitions from one state to another. 
For example, you could define a transition from new to amended. This would specify the fields that need to have valid values to progress - such as a trade price of more than zero.

Effectively, you are defining how the system validates the transition from one state to another.

And if you don't specify a transition, it won't be possible. For example, you almost certainly will not want to define a transition from amended to new. You might, however, want to specify a transition from cancelled to amended with very specific validation.