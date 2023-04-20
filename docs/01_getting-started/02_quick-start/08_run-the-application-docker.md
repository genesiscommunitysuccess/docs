---
title: 'Quick start - run the application'
sidebar_label: 'Run the application'
id: run-the-application-docker
keywords: [getting started, quick start, run the app, docker]
tags:
    - getting started
    - quick start
    - run the app
    - docker
---

## Create a new Schema

Before you can run your application, you need to create a new schema to you database where all tables will be created. To do that, follow these two steps:

1. Run `genesis-install`.

![Genesis Install](/img/intellij-genesisInstall.png)

2. Run `remap`.

![Genesis Install](/img/intellij-remap.png)


## Send data to genesis
Now that you have your database up and running, you need to send the login information so you can access the application you have just created. To do this, go to **server/jvm/alpha-site-specific/src/main/resources/data/user.csv**

![](/img/import_csv_to_genesis.png)

You will be prompted the following message. Type **y** to proceed.

```powershell
WARNING: Are you sure you want to import all the tables from all the csv files to the database? (y/n)
```

After that, you have all the data to start the application.

<details>
  <summary>Want to check if your data has been sent?</summary>
  To check your database, genesis plugin has the following script 

  ![](/img/DbMon-script.png)

  type `table USER` and then `search 1` you will be displayed the following:

```kotlin
==================================
Genesis Database Monitor
Enter 'help' for a list of commands
==================================
DbMon>table USER
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type                
===========================================================================================
TIMESTAMP                                2023-04-20 18:59:04.080(n:0,s:1428)      NANO_TIMESTAMP      
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
</details>

## Connect front end to server
Since you created your project from a seed, you need to change the defaut API_HOST in the **package.json** in **client/web/** to the port we are using in the project. Change the highlighted line in your file.

```kotlin {7} title="client/web/package.json"
{
  "name": "@genesislcap/alpha-web-client",
  "description": "Developer Training Web Client",
  "version": "0.0.1",
  "private": true,
  "license": "Apache-2.0",
  "config": {
    "API_HOST": "ws://localhost:9064",
    "DEFAULT_USER": "JaneDee",
    "DEFAULT_PASSWORD": "beONneON*74",
    "PORT": 6060
  },
```

## Starting the server
:::note
Make sure you have started the [resource deamon](../../../server/tooling/intellij-plugin/#remap).
:::
Once your resource deamon has started, you can start all genesis processes; click on the **start** button.

![](/img/genesis_deamon.png)

Wait for all processes to be healthy (it may take a few minutes for the first run).

## Accessing the application

After all processes are up, the front end is accessible on: [http://localhost:6060](http://localhost:6060) and you will be able to log in.

## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there.
