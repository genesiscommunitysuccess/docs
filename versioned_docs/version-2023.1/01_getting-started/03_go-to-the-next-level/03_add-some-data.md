---
title: 'Go to the next level - add some data'
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

## Section objectives
The goal of this section is:
- Build and deploy the application
- Install genesis plugin
- Import data to genesis
- Create a query

## Database layer

You can specify which database to use in your application by editing **genesis-system-definition.kts**, which is located in **genesis-product\alpha-site-specific\src\main\resources\cfg\\**.

Further information can be found in the [**genesis-system-definitions.kts** file](../../../server/configuring-runtime/system-definitions/).

### Run with docker

Since we are using a docker container, add the highlighted items `DbLayer` and `DbHost` exactly as they are specified below to **genesis-system-definition.kts**:

```kotlin {4,10} title="genesis-system-definition.kts"
systemDefinition {
    global {
        ...
        item(name = "DbLayer", value = "SQL")
        item(name = "DictionarySource", value = "DB")
        item(name = "AliasSource", value = "DB")
        item(name = "MetricsEnabled", value = "false")
        item(name = "ZeroMQProxyInboundPort", value = "5001")
        item(name = "ZeroMQProxyOutboundPort", value = "5000")
        item(name = "DbHost", value = "jdbc:postgresql://localhost:5432/?user=postgres&password=postgres")
        item(name = "DbMode", value = "VANILLA")
        ...
    }
    
}

```

### Build and compose Docker images

Now, you need to start the database. Make sure your docker management software (in our case Rancher desktop) is up and running and do the following:

```powershell
docker pull postgres
docker run --name localPostgresDb -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres postgres -c 'max_connections=10000'
```

To confirm your docker has been created, please run:
```powershell
docker ps | findstr "localPostgresDb"
```

## The build and deploy process

Finally, you can build and deploy the server.

### Build

In the Gradle menu on the right of IntelliJ, select:

**genesisproduct-alpha**

![](/img/assemble-server.png)

```shell title='Running assemble from the command line'
./gradlew :genesisproduct-alpha:assemble
```

#### .genesis-home folder

After the Gradle task, when first using the plugin with a project, you must configure it to be able to access your DB. For this tutorial, we are going to use POSTGRESQL. Make sure you have configured it properly following the installation guide of the [genesis plugin](../../../server/tooling/intellij-plugin/). 

After that, you must create your genesis home folder; click on the **Install Genesis** button on the Tool window.

![Genesis Install](/img/intellij-install.png)

This generates a hidden folder called **.genesis-home** in your project root, ready to run your application's processes. On the first run, this could take up to 20 minutes, because it performs a full build of your application.

:::tip
If you want to keep your file search as clean as possible, it is possible to assign the **.genesis-home** folder as Excluded. To do that, follow the three steps below.

1. Right-click on the directory you want to exclude in the Project pane on the left side of IntelliJ.

2. Select **Mark Directory as** from the dropdown menu.

3. Choose **Excluded** from the sub-menu.

Further information can be found [here](https://www.jetbrains.com/help/idea/content-roots.html#configure-folders).
:::

### Remap

Now you need to run the remap, so we can actually create the schema `alpha` to your database and dd all the standard tables from genesis.

![Genesis Install](/img/intellij-remap.png)

### Deploy

As soon as the Build is done, you can apply the changes and run the Genesis processes again using the Genesis IntelliJ Plugin.

According to the [instructions](../../../server/tooling/intellij-plugin/#making-a-change), you must follow these four steps:

1. Click on the **Deploy Genesis** button on the toolbar.

![Deploy](/img/intellij-deploy1.png)

2. Rebuilding the application requires the Genesis processes to be stopped. When you are prompted for this, click **ok** to continue. 

![Deploy Prompt](/img/intellij-deploy2.png)

This starts the build processes and the logs will be shown below.

![Deploy logs](/img/intellij-deploy3.png)

### User name and password
By default the following will be your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the user.csv file.)

However, after the first Build and Deploy, you got to add the default login data into the application. You can load data into the application using the Genesis IntelliJ Plugin as [explained](../../../server/tooling/intellij-plugin/#loading-data-into-the-application).

To do that, find the **USER.csv** file (it is inside the *server/jvm/alpha-site-specific/src/main/resources/data* folder), right-click **USER.csv**, and then click on **Import CSV(s) to Genesis** as shown below.

![Genesis Install](/img/intellij-sendIt-USERcsv.png)

Behind the scenes, the plugin option `Import CSV(s) to Genesis` uses the [SendIt script](../../../operations/commands/server-commands/#sendit-script) to load data into application.


## Run the server commands

Now, let's run the resource deamon to see all the processes available:

![Genesis Install](/img/intellij-daemon.png)

After clicking on it, run all the proceses available by clicking on start, then wait untill all processes are up.

## Add some example data
Let's load some very simple example data into the tables that we created previously. 

Copy the following into four separate csv files and save them along with the USER.csv in the **alpha\server\jvm\alpha-site-specific\src\main\resources\data** folder. 

Ensure that the csv file has the same name as the table.

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

Select all files in **alpha\server\jvm\alpha-site-specific\src\main\resources\data** and click on `import CSV(s) to genesis`.

![](/img/go-to-next-level-import-data.png)

## Run some queries

Now we are going to use Genesis `DbMon` to run some queries on the database.
:::info DBMON
`DbMon` is the Genesis database client. It provides a unified interface to the underlying database and hides the details about the database vendor.
:::

To check that the user has been created, go to the genesis plugin `Tasks`, under **Scripts** search DbMon and double click on it to run.

![](/img/go-to-next-level-DbMon.png)

Once you are inside the console, type `table USER` and then `search 1`. If imported correctly, the user JaneDee should be listed:

```shell
DbMon>table USER
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type                
===========================================================================================
TIMESTAMP                                2023-04-19 19:25:29.157(n:0,s:1)         NANO_TIMESTAMP      
COMPANY_ID                                                                        STRING              
COMPANY_NAME                             GENESIS                                  STRING              
DOMAIN                                                                            STRING              
EMAIL_ADDRESS                            jane.dee@genesis.global                  STRING              
FIRST_NAME                               Jane                                     STRING              
LAST_LOGIN                               2016-04-28                               DATE                
LAST_NAME                                Dee                                      STRING              
ONLINE                                   false                                    BOOLEAN             
PASSWORD                                 1cf46a0c2148f6399159ff576768d715b5207... STRING              
PASSWORD_EXPIRY_DATETIME                                                          DATETIME            
REFRESH_TOKEN                            dPbpA8ej38DzoEG44t0lyLrjeL80TMqR         STRING              
STATUS                                   ENABLED                                  STRING              
USER_NAME                                JaneDee                                  STRING              
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
Total Results:  1
DbMon:USER>
```

## Conclusion
We now have added some viewable data to our database. As a next step, we shall add business logic to show the data and create entries.
