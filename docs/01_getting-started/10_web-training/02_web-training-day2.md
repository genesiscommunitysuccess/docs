---
id: web-training-day2
title: Day 2
sidebar_label: Day 2
sidebar_position: 4

---
# Day 2 agenda
Complex forms, data entry components, introduction to Genesis Comms lib.

## Order entry screen
Let's continue the development of our web app creating an order entry screen. We're going to work on these files:
-	***order-entry.template.ts***
-	***order-entry.ts***
-	***order-entry.styles.ts***

You should have created these files in the last exercise of the previous day of the training with the navigation bar pointing to them as well.

Now, let's replace the dummy content of these files with the actual implementation we want. This is how this screen will look like:

**INSERT SCREENSHOT HERE WHEN DONE**

### Requirements

A page listing all the orders with a filter by Type and actions to insert a new order, edit an existing order and cancel an order.

#### Fields
| Field          | Type             | Editable | Notes
|---------------|------------------------------|------------------------------|------------------------------|
| Symbol          | Select or Search (autocomplete field) | Yes | Load data from ALL_INTRUMENTS Data Server
| Market data          | Display price of the selected symbol | No | Load data from GET_PRICE_PER_INSTRUMENT ReqRep
| Quantity          | Integer      | Yes | Must be positive
| Price          | Double      | Yes | Must be positive
| Total          | Double      | No | Display Quantity * Price
| Type          | Dropdown      | Yes | Display types from ENUM ORDER_TYPES
| Notes          | String      | Yes | Free text up to 50 chars

#### Actions
Insert, edit and cancel.

### Adding the Orders data grid

### Adding the new Order modal

### Adding the edit and cancel Order action

### Exercises
- Add a new action 'delete order'
- Display more data on 'Market data' and 'Symbol'
- Add a new field dropdown 'Order on behalf' listing all USERs, must select one or none

