---
id: microservices
sidebar_label: 'Microservices'
sidebar_position: 20
title: 'Microservices'
---

This screen enables you to view all the processes (microservices) that are running. These are organised into packages. The services are listed on the left, and you can select a package from the top of the list to see only the processes in that package.
For example, here we have selected the processes for the FIX package:

Note that you have useful information above the main part of the display:
CPU usage
Memory usage
Start time
Uptime
To the right of this, you can do two things:
View a system log. This displays the log in the lower right of the screen. You can search through the log, clear it (remove all log entries) or stop logging. The button on the right enables you to download the current log contents.
View the system definition. This is displayed in the lower right of the screen. It includes information such as the database technology (FDB, Aerospike or Postgres).

## Viewing a log
You can click on a process in the list to see more details of it in the main panel.
The main panel usually has tabs. Here, for example, we have selected GCOM as the Package, and we have clicked on the GCOM EVENT_HANDLER. We are currently looking at the **LOGS**.
The process you have selected is clearly named at the top of the main panel. To the right of this are some control buttons that affect this process only:
Verbose enables you to choose between detailed and summary logging messages
Log level enables you to view or change the logging level 
Restart enables you to stop and restart the process. Use this with care.
Stop process enables you to stop the process. Again, you need to use this with care.
There is another set of buttons immediately beneath these controls, where you can:
Select ((*)) error (click to switch this off or on)
Download the current log file
Clear the current log file (all log messages are removed)
Switch logging off or on
Filtering logs ((What is this? There is a search box.))
### Viewing code
The other tab in the main panel is **Script**.
You can click on this tab to view code for this process.



## Data
This lists all the tables in your data model.
You can control the list of tables on the left in three ways:
Suppress empty tables removes tables with no data (typically, this would be audit tables)
Resource available (what’s this?)
Search enables you to view only tables that match a keyword that you supply, for example, BID
For the tables listed:
the **Count** column shows the number of records currently in the table
The Resource column indicates whether this table is a resource (tick) or not (cross). Not all tables are resources (which publish data to the web UI).
You can select a table in the list to view its details in the main panel. There are tabs in this view, enabling you to choose to view either **Fields & keys** or **Data**.
If you select **Fields and keys**, these are displayed separately in the main panel.  So, you can see what type each field is and what the primary key for the table is.
If you select **Data**, you can see the rows of data that are currently in the table. At the top, you can limit the display to show:
A limited number of rows (**Max Rows**)
A limited number of *&something else*& (**Max Views**)
Clicking on the **Columns** link in the far-right margin enables you to select a column to filter on.
 
