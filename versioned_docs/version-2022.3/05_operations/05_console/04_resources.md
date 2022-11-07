---
title: 'Genesis Console - Resources'
sidebar_label: 'Resources'
id: resources
keywords: [operations, console, resources]
tags:
    - operations
    - console
    - resources
---



This page shows all the available resources that publish data to the web UI. 

![](/img/con-resources1.png)

At the top of the list, there are three ways to control what you see in the list:

* **Search** enables you to find resources that include a keyword that you supply
* **Resource type** enables you to list only one type of resource: Data server, Request server (req rep) or Event handler. By default, you see all three types.
* **Microservice** enables you to list only the resources for a selected process (microservice).


Each resource in the list has a right arrow to the right. Click on the arrow for a resource to view its details in the main panel.

Here we have searched for TRADE, which gives us fifteen resources. We have selected to view ALL_TRADES.

![](/img/con-resources2.png)

Note the **View Fields** button at the top right. You can click on this to display the fields for the table, along with their field types.

### Inserting, amending or deleting a record
You can go to a resource and amend, delete or insert a record. You might need to do this to solve a known data problem, or you can use it simply to test the resource and its data.

For example, here we want to insert a new record to test the EVENT_BROKER_INSERT resource.

1. Search for the relevant table and click on the right arrow to view it.

2. Fill in the fields with the relevant information. Note that mandatory and optional fields are listed separately. In this case, we have left the optional BROKER_ID field empty, which will result in an automatically-generated ID being allocated.

![](/img/con-new-broker.png)

3. Click on the **Validate** box to check whether your data is acceptable. Then click on **Commit**. If the data is correct, you will see **ACK** returned as the event result at the bottom of the panel.

4. Click to remove the check in the **Validate** box. Click on **Commit** to insert the record. Again, you will see an **ACK** returned at the bottom of the panel.

Now you can check that the data has been inserted correctly.
Go to the Data page and search for the ALL_BROKERS table.

Click on the table in the list to view its contents in the main panel. Here you can see that the new broker's information has been inserted successfully.

![](/img/con-broker-added.png)
