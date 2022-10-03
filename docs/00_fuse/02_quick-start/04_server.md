---
title: 'Server'
id: server
---

# Server

Now we have our basic user interface running, we need to start our server so that it can serve data for our user interface to use.

### Expected result

By the end of this section we should have all parts of the server application running. We shall:

- generate our server configuration 
- have our server running
- have our local FoundationDB running
- populated our DB with some basic user credentials, which will be utilised later.

## Server set-up

Before starting with the server set-up, make sure that:

- we have a user with name of the application (alpha)
- FoundationDB is running (if it is not, run `systemctl start foundationdb` from CentOS7)
- have our Genesis home, distribution and user configured as below:

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

If unsure about the above, refer to our [Pre-requisites](/fuse/introduction/prerequisites/), particularly "WSL".


### Preparing the server

Our main aim is to write less and do more. 

To enable this, we need to have a common task that will take what we've done and generate all the server and UI configuration. 

> This is an important command and one that will be used regularly for all Fuse development.

To get started with an initial server configuration, run this task:

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Deploying to the server

We shall run `setupEnvironment`:

> this task executes `install-genesis-distribution` which copies and unzips the Genesis distribution specified as a dependency and then configures the installed distribution.

```shell
./gradlew :alpha-deploy:setupEnvironment #On the IntelliJ terminal
```

After this command is completed, we will have a basic Genesis server running.

### Auth component

As part of our Quick Start application, we want to use Authentication. This is provided via our Genesis Auth component which you need install.

To install Auth, run the following command:

```shell
./gradlew :alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

### Build and deploy

Now we have our server and auth configured, let's build the alpha application:

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

Once built, we need to deploy it:

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

### Adding a user to login

We shall run the task loadInitialData. This adds the data in USER.csv to the USER table in your database. To do that we will call

```shell
./gradlew :jvm:alpha-deploy:loadInitialData #On the IntelliJ terminal
```

We want to validate that the above was successful; the following commands will help with that.

Run `DbMon` to check that the user has been created:

```shell
./gradlew :alpha-deploy:DbMon #On the IntelliJ terminal
```

This opens a DbMon consolde. Once inside the console, type 'table USER' and then 'search 1'. If imported correctly, the user JaneDee should be listed.

### Review 

We've run a lot of commands. Therefore, it's a good time to validate that everything is running as expected.

To do this, we'll use our Genesis monitor. Let's run it with: 

```shell
./gradlew :alpha-deploy:mon #On the IntelliJ terminal
```

If successful, we will see something like this:

> The PID, CPU and Memory values may differ, we're mainly looking for the process names and statuses. 

```shell
PID     Process Name                  Port        Status         CPU       Memory    Message
===============================================================================================
426     GENESIS_AUTH_CONSOLIDATOR     8005        STANDBY        26.30     1.30
350     GENESIS_AUTH_DATASERVER       8002        RUNNING        46.70     1.70
334     GENESIS_AUTH_MANAGER          8001        RUNNING        51.50     1.70
368     GENESIS_AUTH_PERMS            8003        RUNNING        55.70     1.90
403     GENESIS_AUTH_REQUEST_SERVER   8004        RUNNING        46.80     1.60
490     GENESIS_CLUSTER               9000        RUNNING        54.30     2.50
570     GENESIS_ROUTER                9017        RUNNING        44.70     2.00
534     GENESIS_WEBMON                9011        RUNNING        41.30     2.50
===============================================================================================
664     ALPHA_DATASERVER              11000       RUNNING        58.10     1.50
703     ALPHA_EVENT_HANDLER           11001       RUNNING        71.30     2.20
```

## Connecting the UI and server

Finally, we want to connect everything together.  

With this next step, we will configure an Nginx working as a reverse proxy.

In the CentOS terminal, enter:

```shell
docker login genesisglobal-docker-internal.jfrog.io
...

We need to enter artifactory credentials at this point. Enter:

...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

We can run this command from within WSL or from the workstation. If running it from the CentOS shell, use the following command:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```

## Recap

Congratulations, you now have:

- a server running
- the Auth component configured
- a working connection between the server and UI 
