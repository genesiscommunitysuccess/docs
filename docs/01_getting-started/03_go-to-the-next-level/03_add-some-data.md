---
title: 'Go to the next level - Add some data'
sidebar_label: 'Add some data'
id: add-some-data
keywords: [getting started, quick start, next level, data, add data]
tags:
    - getting started
    - quick start
    - next level
    - data
    - add data
---

## Add a user and some example data
Let's load some very simple example data into the tables that we created previously. 

Copy the following into four separate csv files and save them along with the USER.csv in the **positions-app-tutorial\server\jvm\positions-app-tutorial-site-specific\src\main\resources\data** folder. 

Ensure that the csv file has the same name as the table; the `loadInitialData` script is case-sensitive.

```text title="TRADE.csv"
"TRADE_ID","INSTRUMENT_ID","COUNTERPARTY_ID","QUANTITY","SIDE","PRICE","TRADE_DATETIME","ENTERED_BY","TRADE_STATUS"
"000000000000001TRLO1","00000000002INSP0","000000000000001CLSP1","11129","BUY","643.927","2022-09-16 10:40:47.161 +0000","TestUser1","NEW"
"000000000000002TRLO1","00000000003INSP0","000000000000001CLSP1","4142","SELL","577.515","2022-09-17 10:40:47.161 +0000","TestUser1","NEW"
"000000000000003TRLO1","00000000003INSP0","000000000000002CLSP1","412","BUY","577.515","2022-09-10 10:40:47.161 +0000","TestUser1","ALLOCATED"
"000000000000004TRLO1","00000000003INSP0","000000000000003CLSP1","42","SELL","577.515","2022-09-12 10:40:47.161 +0000","TestUser2","CANCELLED"
"000000000000005TRLO1","00000000003INSP0","000000000000001CLSP1","414","BUY","577.515","2022-09-14 10:40:47.161 +0000","TestUser1","NEW"
"000000000000006TRLO1","00000000003INSP0","000000000000002CLSP1","142","SELL","577.515","2022-09-15 10:40:47.161 +0000","TestUser1","ALLOCATED"
```

```text title="POSITION.csv"
"INSTRUMENT_ID","POSITION_ID","QUANTITY","NOTIONAL","PNL","VALUE"
"00000000005INSP0","000000000001802PSLO1","113100","467668019","-4858393092","7324500"
"00000000002INSP0","000000000002002PSLO1","10299","72808786","3394758","7512307"
"00000000004INSP0","000000000001902PSLO1","71974","2878437","-412450","24224859"
"00000000003INSP0","000000000002102PSLO1","13010","243786450","-13184224","112133190"
"00000000001INSP0","000000000001803PSLO1","70720","3949150","-3808573","353600"
```
```text title="INSTRUMENT.csv"
"INSTRUMENT_ID","INSTRUMENT_SYMBOL","CURRENCY_ID"
"00000000001INSP0","TEST_SYMBOL_1","BRL"
"00000000002INSP0","TEST_SYMBOL_2","BRL"
"00000000003INSP0","TEST_SYMBOL_3","USD"
"00000000004INSP0","TEST_SYMBOL_4","USD"
"00000000005INSP0","TEST_SYMBOL_5","BRL"
```
```text title="COUNTERPARTY.csv"
"COUNTERPARTY_ID","COUNTERPARTY_NAME"
"000000000000001CLSP1","HSBC"
"000000000000002CLSP1","BOSCO"
"000000000000003CLSP1","MERRILL"
"000000000000004CLSP1","GENESIS"
```
Next, let's load this data along with a user from the USER.csv file (which was provided by the seed application when you ran `genx`).

:::note NOTE
The following details will be your login details:
-	Username: JaneDee
-	Password: beONneON*74 (This is encrypted in the USER.csv file.)
:::

Run the task `loadInitialData`. This imports the data from these csv files into the database. For example, the file called USER.csv will be imported into the USER table in your database. The USER table, among the other users and permissioning tables, is defined by the Genesis Auth module that we installed previously.

To run the task, call:
```shell
./gradlew :genesisproduct-positions-app-tutorial:positions-app-tutorial-deploy:loadInitialData #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/load-initial-data-positions.png)


## Run some queries

Now we are going to use Genesis `DbMon` to run some queries on the database.
:::info DBMON
`DbMon` is the Genesis database client. It provides a unified interface to the underlying database and hides the details about the database vendor.
:::

Run `DbMon` to check that the user has been created:

```
./gradlew :genesisproduct-position-app-tutorial:positions-app-tutorial-deploy:DbMon #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/using-dbmon-positions.png)

Once you are inside the console, type table `USER` and then `search 1`. If imported correctly, the user JaneDee should be listed:

```shell
DbMon>table USER
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type                
===========================================================================================
...
USER_NAME                                JaneDee                                  STRING              
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
DbMon:USER>
```



## Deploying the application

Now we have to deploy our application, the positions-app-tutorial product. From Gradle, run the following commands in order:

1. **/genesisproduct-positions-app-tutorial/Tasks/build/assemble**

    ![](/img/deploy-assemble-positions.png)

2. **/genesisproduct-positions-app-tutorial/positions-app-config/Tasks/build/assemble**

    ![](/img/deploy-config-assemble-positions.png)

3.  **/genesisproduct-positions-app-tutorial/positions-app-tutorial-deploy/Tasks/genesis-setup/install-positions-app-tutorial-site-specific**

    ![](/img/deploy-install-site-specific-positions.png)

4. **/genesisproduct-positions-app-tutorial/positions-app-tutorial-deploy/Tasks/genesisdeploy/deploy-genesisproduct-positions-app-tutorial.zip**

    ![](/img/deploy-positions.png)



This sequence builds, configures and deploys the application.


## Run the server commands
:::info Can I run server commands from the command line rather than Gradle tasks?
Yes. Here, we've been running server commands through the gradle tasks. But alternatively, you can run server commands directly from a command line. 

Assuming you are using the provided 'TrainingCentOS' WSL distribution, open PowerShell (or Windows Command Prompt). Access your WSL instance 'TrainingCentOS' and switch to user 'genesis' to have access to the Genesis commands:

```shell
wsl -d TrainingCentOS
su genesis
DbMon
```

Try it now!

:::

Now, let's run the Genesis command `mon` to see if all processes are up and running on the server:

```shell
./gradlew :genesisproduct-positions-app-tutorial:positions-app-tutorial-deploy:mon #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/using-mon-positions.png)

We should see something like this:

```shell
PID     Process Name                  Port        Status         CPU       Memory    Message
===============================================================================================
426     GENESIS_AUTH_CONSOLIDATOR     8005        STANDBY        36.30     1.30
350     GENESIS_AUTH_DATASERVER       8002        RUNNING        56.70     1.70
334     GENESIS_AUTH_MANAGER          8001        RUNNING        61.50     1.70
368     GENESIS_AUTH_PERMS            8003        RUNNING        65.70     1.90
403     GENESIS_AUTH_REQUEST_SERVER   8004        RUNNING        56.80     1.60
490     GENESIS_CLUSTER               9000        RUNNING        84.30     2.50
570     GENESIS_ROUTER                9017        RUNNING        54.70     2.00
534     GENESIS_WEBMON                9011        RUNNING        51.30     2.50
===============================================================================================
664     POSITIONS_APP_TUTORIAL_DATASERVER              11000       RUNNING        58.10     1.50
703     POSITIONS_APP_TUTORIAL_EVENT_HANDLER           11001       RUNNING        71.30     2.20
```

## Conclusion
We now have added some viewable data to our database. As a next step, we shall add business logic to show the data and create entries.
