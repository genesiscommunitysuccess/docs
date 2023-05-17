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

## Create a new schema

Before you can run your application, you need to create a new schema for the database; this is where all tables will be created. To do that, follow these two steps:

1. Run `genesis-install`.

![Genesis Install](/img/intellij-genesisInstall.png)

2. Run `remap`.

![Genesis Install](/img/intellij-remap.png)


## Send data to Genesis
Now that you have your database up and running, you need to send the login information so you can access the application you have just created. To do this, go to **server/jvm/alpha-site-specific/src/main/resources/data/user.csv**

![](/img/import_csv_to_genesis.png)

You will be prompted the following message. Type **y** to proceed.

```powershell
WARNING: Are you sure you want to import all the tables from all the csv files to the database? (y/n)
```

After that, you have all the data to start the application.

<details>
  <summary>Want to check if your data has been sent?</summary>
  To check your database, Genesis Intellij plugin has the following script 

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

## Starting the server

1. Start the [resource deamon](../../../server/tooling/intellij-plugin/#remap).

2. Once your resource deamon has started, you can see your Genesis processes listed. Click on the **start** button for each process to start it.

![](/img/genesis_deamon.png)

Wait for all the processes to be healthy (it may take a few minutes for the first run).

## Accessing the application

Now you are ready to run the application you have created for the front end.

Using the Genesis IntelliJ plugin click the [Start UI button](../../../server/tooling/intellij-plugin/#starting-the-ui) (this is the small globe) on the toolbar as shown below. This builds your front-end codebase and starts the webpack webserver in development mode.

![Debug Window](/img/intellij-ui.png)

The application will open at `http://localhost:6060/login`.
![](/img/btfe--positions-example--login.png)

The login details are: 

- login name: JaneDee
- password: beONneON*74

When you have logged in, the screen is empty, but note the **ADD** button at the top right. You can click on this to add some dummy trade details.

Below, we have added two trades. We have sold MMM at 404 and bought back at 401.5.

![](/img/final-result.png)


## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components.


There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there.
