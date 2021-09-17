---
title: Overview
sidebar_label: Overview
sidebar_position: 1
id: overview
---
#Gui Logic

#Event Handlers

- The Genesis Platform has a real-time event-driven architecture.
- Applications built on the system must respond immediately to different types of input:-  inputs from users, messages from other systems, market-data updates and internally calculated analytic signals.  These inputs are events.
- All the business logic for applications built on the platform is structured around these events. When an event occurs, the business logic immediately fires into action.

#Dynamic Rules

Genesis supports the ability to attach Event Handlers to changes in the database.

To enable this function you need to have the GENESIS_EVALUATOR process running

Instructions on how to (switch on) an GENESIS_EVALUATOR

To create a rule that will monitor for changes in database you need to setup a  "dynamic_rule". This is simply setup by inserting a row into the genesis DYNAMIC_RULE table

| FIELD NAME | Use |
| --- | --- |
| NAME | Name of the Rule |
| DESCRIPTION | Simple Description |
| USER_NAME | The User Name that will be used to perform the operation / null implies system |
| RULE_TABLE | The Table to listen to for changes |
| RULE_STATUS | This is either "ENABLED" or "DISABLED" and respeitvely enables or disables the rule  |
| RULE_EXPRESSION | This is a groovy expression which is evaluated when their is a table change on RULE_TABLE, if this evaluates to true, then the RESULT_EXPRESSION logic is activated |
| PROCESS_NAME | Process Name to send the Event  eg TRADING_APP_EVENT_HANDLER |
| MESSAGE_TYPE | The Message Type that will be defined |
| RESULT_EXPRESSION | this is a groovy expression which should set on the MESSAGE Object |
| TABLE_OPERATION | renders |







#Scheduling



