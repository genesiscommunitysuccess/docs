---
id: add-state-machine
title: Workflow - add a state machine
sidebar_label: Workflow - add a state machine
sidebar_position: 6

---
Now we are going to configure state machine to control the workflow of trades.

At this stage, you have:

* a Reference Data application. This has tables, so you can import the schema to the Trading application
* a Trading application. This contains the schema for the TRADE table, plus event handlers, data servers and request servers

Also, you have enhanced the EVENT_TRADE_INSERT event handler so that it performs validation checks.

## The objective

We need a very simple state machine to add new trades. For this example, we shall have  a new TRADE_STATUS field with three possible states: ACTIVE, COMPLETED, CANCELLED.

* ACTIVE can go to COMPLETED or CANCELLED.
* COMPLETED and CANCELLED can’t go anywhere else.
* ACTIVE is the only state you can use to insert new records.

![](/img/diagram-of-states.png)

## Create the state machine

The automatically generated state machines

\**Description automatically generated

### Add the new field to the data model

Add TRADE_STATUS field to fields file and tables file. Run Generate Fields then run Generate Dao

### Create a new class for the state machine

Add main folder in event handler module and create state machine class.

Perform state machine definition in video.

Assign a field in onCommit block which will be demonstrated in a unit test

### Add the module as a pom dependency

Add eventhandler module as pom dependency to script-config module and refresh maven

Integrate state machine in EVENT_TRADE_INSERT

Create data classes that will be used in the cancel and completed event handlers. 2 will be required, one called TradeCancel and one called TradeCompleted which have a single field tradeId.

Create new event handler to handle cancellation: EVENT_TRADE_CANCELLED. Integrate state machine in it.

Create new event handler to handle completion: EVENT_TRADE_COMPLETED. Integrate state machine in it.

Modify the TRADE_MODIFY event handler to use state machine

Remove the TRADE_DELETE event handler

In order to manage the state of the trade, you need to remove the delete event handler. If a trade is incorrect and needs to be deleted, similar functionality can be achieved by cancelling the trade.

## Testing

### Create the unit tests

Add 6 new unit tests to prove state machine behaviour:

success cancelling trade,

failure cancelling trade (trade is already cancelled),

success completing trade.

failure complete trade (trade is already cancelled)

Test which executes onCommit logic (changing price when entered by TestUser)

Success transition from completed to cancelled

### Run the tests

Run all unit tests to confirm they pass