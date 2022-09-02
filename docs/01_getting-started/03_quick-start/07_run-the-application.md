---
title: 'Run the application'
sidebar_label: 'Run the application'
id: run-the-application
---

Before you start this, make sure that:

- you have a user with the name of the application (alpha)
- foundationdb is running (if it is not, run `systemctl start foundationdb` from Centos07)

If that's OK, you can deploy the server.

### Deploying to the server

First, we need to configure our genesis home, distribution and user. We will do that by adding the following fields to the **gradle.properties** under **alpha/server/jvm**

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

We will run `setupEnvironment` - this task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

Usage :
```shell
./gradlew :jvm:alpha-deploy:setupEnvironment #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/setup-environment.png)

After this command is completed we will have a basic genesis server running

### Deploying the auth module

Usage:
```shell
./gradlew :jvm:alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/install-auth.png)

### Deploying the alpha product

Now we have to deploy the alpha product

Usage:
```shell
./gradlew :jvm:alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/deploy-alpha-product.png)


### Adding a user to login

Next let's create a user.

:::tip
The following details will be your login details:

- Username: JaneDee
- Password: beONneON*74 (This is encrypted in the USER.csv file.)
:::

We shall run the task `loadInitialData`. This adds the data in USER.csv to the USER table in your
database. To do that we will call

```shell
./gradlew :jvm:alpha-deploy:loadInitialData #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/load-initial-data.png)

Now  run `DbMon` to check that the user has been created:

```shell
./gradlew :jvm:alpha-deploy:DbMon #On the IntelliJ terminal
```

or from the dropdown menu:

![](/img/using-DbMon.png)

Once you are inside the console, type 'table USER' and then 'search 1'. If imported correctly, the user JaneDee should be listed like this:

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

After running

```shell
./gradlew :jvm:alpha-deploy:mon #On the IntelliJ terminal
```
or from the dropdown menu:

![](/img/using-mon.png)

we should see something like this

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

### Connecting the back end and front end

With this next step, we will configure an nginx server working as a reverse proxy.

In your CentOS terminal, enter:
```shell
docker login genesisglobal-docker-internal.jfrog.io
...

You need to enter your artifactory credentials at this point

Then enter:
...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

You can run this command from within WSL or from your workstation. If you run it from the CentOS shell, you can use the following command:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```

### Running the front end


Now you can run the application's front end. From there, you can view the table of data and add the details of a new trade.

To run the application:

From **client/package.json**:
- Run **bootstrap** script

After that:
- Run **dev** script

Now you have a fully running application. If not opened automatically, you can navigate to http://localhost:6060/login, and you should see the following:

![](/img/login-screen-quickstart.png)

:::tip
If the blue button to login is not clickable, go through the previous section again, the problem will most likely be located there.

::::

## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there. We hope you have a good experience.

