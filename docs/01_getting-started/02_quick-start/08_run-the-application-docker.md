---
title: 'Quick start - run the application (Docker)'
sidebar_label: 'Run the application (Docker)'
id: run-the-application-docker
keywords: [getting started, quick start, run the app, docker]
tags:
    - getting started
    - quick start
    - run the app
    - docker
---

To be able to follow the instructions on this page, please make sure you have sucessfuly installed [genesis plugin](../../server/tooling/intellij-plugin/)

## Building and composing Docker images

First we need to start the database (in this tutorial we are using a POSTGRES db in a docker container). Please open Rancher and do the following:

```powershell
docker pull postgres
docker run --name localPostgresDb -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -d postgres postgres -c 'max_connections=10000'
```

To confirm your docker is up and running, please run:
```powershell
docker ps | findstr "localPostgresDb"
```

## Send data to Genesis

In case you have not run the [remap command](../../server/tooling/intellij-plugin/#remap), do it now, so that our database is updated.

Now that we have our database up, running and updated, we need to send the login information so we can access the application we have just created. To do this, go to **server/jvm/alpha-site-specific/src/main/resources/data/user.csv**

![](/img/import_csv_to_genesis.png)

You will be prompted the following message. Type `y` to proceed.

```powershell
WARNING: Are you sure you want to import all the tables from all the csv files to the database? (y/n)
```

After that, you have all the data to start the application.

## Connect front end to server
Since we created out project from a seed, we need to change the defaut API_HOST in the **package.json** in **client/web/** to the port we are using in the project. Change the highlighted line o your file.

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

Make sure you have started the [resource deamon](../../server/tooling/intellij-plugin/#remap).

Once your resource deamon is started, you can start all genesis processes, clicking on the **start** button.

![](/img/genesis_deamon.png)

Wait all processes to be healthy (it may take a few minutes for the first run).

## Accessing the application

After all processes are up, the front end is accessible on: `http://localhost:6060` and you will be able to log in.

## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there.
