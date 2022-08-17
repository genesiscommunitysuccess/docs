---
title: 'The Server'
id: the-server
---
# The Server

## Preparing the server

Now we will generate the server configuration by running the below task:

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

This task generates both the server and UI configuration. We will use it again later when we create our application.


## Starting the server

Before you start this, make sure that:

- you have a user with name of the application (alpha)
- Foundation DB is running (if it is not, run `systemctl start foundationdb` from Centos07

If that's OK, you can deploy the server.

### Deploying to the server

First, we need to configure our genesis home, distribution and user. We will do that by adding the following fields to the **gradle.properties** file.

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

We will run `setupEnvironment` - this task executes `install-genesis-distribution` (copies and unzips the Genesis distribution specified as a dependency) and then configures the installed distribution.

Usage :

```shell
./gradlew :alpha-deploy:setupEnvironment #On the IntelliJ terminal
```

After this command is completed we will have a basic genesis server running

### Deploying the auth module

Usage:

```shell
./gradlew :alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

### Building the alpha product

Build the alpha product

Usage:

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

### Deploying the alpha product

Now we have to deploy the alpha product

Usage:

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

### Adding a user to login

Next let´s create a user.

:::tip
The following details will be your login details:

- Username: JaneDee
- Password: beONneON\*74 (This is encrypted in the USER.csv file.)
  :::

We shall run the task `loadInitialData`. This adds the data in USER.csv to the USER table in your
database. To do that we will call

```shell
./gradlew :alpha-deploy:loadInitialData #On the IntelliJ terminal
```

Now run `DbMon` to check that the user has been created:

```shell
./gradlew :alpha-deploy:DbMon #On the IntelliJ terminal
```

Once you are inside the console, type 'table USER' and then 'search 1'. If imported correctly, the user JaneDee should be listed.

After running

```shell
./gradlew :alpha-deploy:mon #On the IntelliJ terminal
```

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

See [here](https://docs.genesis.global/secure/creating-applications/creating-a-new-project/recommended-full-stack-project-setup/configure-deployment-plugin/) for extra details on how to configure the Genesis deploy plugin.

### Connecting the back end and front end

With this next step, we will configure an nginx working as a reverse proxy.

In your CentOS terminal, enter:

```shell
docker login genesisglobal-docker-internal.jfrog.io
...

You need to enter your artifactory credentials at this point

The enter
...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

You can run this command from within WSL or from your workstation. If you run it from the CentOS shell, you can use the following command:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```
