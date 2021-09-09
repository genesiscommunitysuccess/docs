---
id: j-config-ehandle
title: Configure the event handlers
sidebar_label: Configure the event handlers

---
Configuring event handlers

At this stage, you now have: 

* a Reference Data application. This has tables, so you can import the schema to the Trading application
* a Trading application. This contains the schema for the TRADE table, event handlers, data servers and request servers

Now we are going to change the code in the event handler so that it checks that:

* the counterparty exists in the database (by checking COUNTERPARTY_ID field) 
* the instrument exists in the database (by checking INSTRUMENT_ID field) 

In your IDE, go to the TRADE table. Mark the INSTRUMENT_ID and COUNTERPARTY_ID as mandatory.