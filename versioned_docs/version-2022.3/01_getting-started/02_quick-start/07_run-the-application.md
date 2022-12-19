---
title: 'Quick Start - Run the application (WSL/Linux)'
sidebar_label: 'Run the application (WSL/Linux)'
id: run-the-application
keywords: [getting started, quick start, run the app, wsl, linux]
tags:
    - getting started
    - quick start
    - run the app
    - wsl
    - linux
---

You have a choice of how you run the application. The instructions on this page are for using WSL/CentOS. If you prefer to use Docker as your environment, there are [separate instructions](../../../getting-started/quick-start/run-the-application-docker/).

Before you start this, make sure that:

- you have a user with the name of the application (alpha)
- foundationdb is running (if it is not, run `systemctl start foundationdb` from Centos07)

If that's OK, you can deploy the server.

## Deploying to the server

1. First, we need to configure our genesis home, distribution and user. Add the following fields to the **gradle.properties** under **alpha/server/jvm**:

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

2. Run `setupEnvironment`. This task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

By command:
```shell
./gradlew :jvm:alpha-deploy:setupEnvironment #On the IntelliJ terminal
```
From the dropdown menu:

![](/img/setup-environment.png)

After this command is completed, we will have a basic Genesis server running.

## Deploying the Auth module
You can either execute the deployment as a command or from the dropdown menu in Intellij.

By command:
```shell
./gradlew :jvm:alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

From the dropdown menu:

![](/img/install-auth.png)

## Deploying the alpha product (FDB)

Now we have to deploy the alpha product - either by command or from the dropdown menu.

By command:
```shell
./gradlew :jvm:alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

From the dropdown menu:

![](/img/deploy-alpha-product.png)

## Deploying the alpha product (H2)

1. First, we have to install the site-specific alpha product - either by command or from the dropdown menu.

By command:
```shell
./gradlew :jvm:alpha-deploy:install-alpha-site-specific-1.0.0-SNAPSHOT-bin.zip-distribution.zip #On the IntelliJ terminal
```

From the dropdown menu:

![](/img/install-alpha-site-specific.png)

2. Next, we need to run `genesis-install`.

By command:
```shell
./gradlew :jvm:alpha-deploy:genesis-install #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/alpha-genesis-install.png)

3. Finally, run `remap`.

By command:
```shell
./gradlew :jvm:alpha-deploy:remap #On the IntelliJ terminal
```

From the dropdown menu:

![](/img/remap.png)

## Adding a user to login

1. First, create a user.

:::tip
These are your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the USER.csv file.)
:::

2. Run the task `loadInitialData`. This adds the data in USER.csv to the USER table in your
database.

By command:
```shell
./gradlew :jvm:alpha-deploy:loadInitialData #On the IntelliJ terminal
```

From the dropdown menu:

![](/img/load-initial-data.png)

3. Run `DbMon` to check that the user has been created:

By command:
```shell
./gradlew :jvm:alpha-deploy:DbMon #On the IntelliJ terminal
```

From the dropdown menu:

![](/img/using-dbmon.png)

4. Once you are inside the console, type `table USER` and then `search 1`. If imported correctly, the details of the user JaneDee should be listed:

```
DbMon:USER>search 1
==================================
USER
==================================
Field Name                               Value                                    Type
===========================================================================================
TIMESTAMP                                2022-09-01 16:41:06.198(n:0,s:151)       NANO_TIMESTAMP
COMPANY_ID                                                                        STRING
COMPANY_NAME                             GENESIS                                  STRING
DOMAIN                                                                            STRING
EMAIL_ADDRESS                            jane.dee@genesis.global                  STRING
FIRST_NAME                               Jane                                     STRING
LAST_LOGIN                               2016-04-28                               DATE
LAST_NAME                                Dee                                      STRING
ONLINE                                   false                                    BOOLEAN
PASSWORD                                 ********************************         STRING
PASSWORD_EXPIRY_DATETIME                                                          DATETIME
REFRESH_TOKEN                            ********************************         STRING
STATUS                                   ENABLED                                  STRING
USER_NAME                                JaneDee                                  STRING
-------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------
```

4. Check the application's processes

By command:
```shell
./gradlew :jvm:alpha-deploy:mon #On the IntelliJ terminal
```
From the dropdown menu:

![](/img/using-mon.png)

You should see the processes listed:

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
664     ALPHA_DATASERVER              11000       RUNNING        58.10     1.50
703     ALPHA_EVENT_HANDLER           11001       RUNNING        71.30     2.20
```

## Connecting the back end and front end

In this step, we will configure an nginx server working as a reverse proxy. Make sure you have your artifactory credentials available.

In your CentOS terminal, enter the following commands:

1. Enter your artifactory credentials:
```shell
docker login genesisglobal-docker-internal.jfrog.io
```

2. Pull the latest version of the Genesis software:
```shell
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
```

3. Finally, run the following command:
```shell
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy
```


## Running the front end

Now you can run the application's front end. From there, you can view the table of data and add the details of a new trade.

To run the application, from **client/package.json**:

1. Run the**bootstrap** script.
2. Run the **dev** script.

Now you have a fully running application. If it is not opened automatically, navigate to http://localhost:6060/login, and you should see the following:

![](/img/login-screen-quickstart.png)

:::tip
If the blue button to login is not clickable, go through the previous section again, the problem will most probably be located there.
:::

### API Host

If you have followed the [genx quick start guide](../02_quick-start/02_create-a-new-project.md), then have set the `API_HOST` as the default `ws://localhost/gwf/`. This default will hit the nginx reverse proxy that you set in [the previous section](#connecting-the-back-end-and-front-end). 

If you have changed the `API_HOST` from the default `ws://localhost/gwf/`at any point to connect to a different host, then you need to change this back to the default configuration.

Additionally, the front end will cache the `API_HOST` and use that over the configured item; so if you have changed the host then you may need to clear this item from your cache. You can do this in your browser by opening the developer tools, going to the storage tab, going to the `Local Storage` section, and deleting the `hostUrl` key/value pair.

:::tip
If you change the host frequently, you might find it easier to configure the login screen not to auto connect to the host, which allows you to set the value in the GUI. Set this via `autoConnect: false` in the file `client/web/src/routes/config.ts`. There is more information on the configuration options in our [micro front-end documentation](../../04_web/05_micro-front-ends/07_foundation-login.md/#customising-login).
:::


## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there. We hope you have a good experience.

