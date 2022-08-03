---
title: 'Basics'
sidebar_label: 'Basics'
id: basics
---


You define your state machine as a specific type of Event Handler. 

Within your application's **eventhandler.kts**, you must define the conditions for each possible change of state. Remember, if you don't the conditions for changing from state to another, then it will not be possible for the application to make that transition.

Here is an example of an event - in this case, a modification to a draft trade. The three key requirements for the event are:

- excludedFields, those that are not checked.
- onEvent, where system action is specified.
- onValidate, where you specify any validation requirements - in this case, checking for a valid price and quantity.

