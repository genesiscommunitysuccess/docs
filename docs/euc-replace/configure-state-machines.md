---
id: j-config-state
title: Configure state machines
sidebar_label: Configure state machines

---
At this stage:

Ref_data_app exists (with all its tables) and the schema can be imported into trading_app. Trading_app exists and it contains the schema for TRADE table + event handlers, dataservers and req-reps.

The EVENT_TRADE_INSERT has been enhanced with validation checks as per event handler script.

## The objective

We need a very simple state machine to add new trades. For this we could have a new TRADE_STATUS with three possible states: ACTIVE, COMPLETED, CANCELLED. ACTIVE can go to COMPLETED or CANCELLED. COMPLETED and CANCELLED can’t go anywhere else. ACTIVE is the only state you can use to insert new records..

\** Diagram

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