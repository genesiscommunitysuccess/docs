---
title: 'Server'
id: server
---

# Server

Now we have our basic user interface running, we need to start our server to be able to serve data for our user interface to use.

### Expected Result

By the end of this section we should have our all of our server application running. We will

- Generate our server configuration 
- Have our server running
- Have our local FoundationDB running
- Populated our DB with some basic user credentials which will be utilised later.

## Server Set Up

Before starting with the server set up, make sure that:

- We have a user with name of the application (alpha)
- FoundationDB is running (if it is not, run `systemctl start foundationdb` from CentOS7
- Have our Genesis home, distribution and user configured like below:

```shell
genesis-home=/home/alpha/run
wsl-distro=CentOS7
wsl-user=alpha
```

If unsure about the above, please refer to our [Prerequisites](/flow/introduction/prerequisites/), particularly "Do you need WSL?".


### Preparing the server

Our main aim is to write less and do more. 

To enable this, we need to have a common task that will take what we've done and generate all the server and UI configuration. 

> This is an important command and one that will be used regularly for all Flow development.

To get started with an initial server configuration, we need to run this task:

```shell
./gradlew :generateAll #On the IntelliJ terminal
```

### Deploying to the server

We will run `setupEnvironment`:

> this task executes `install-genesis-distribution` which copies and unzips the Genesis distribution specified as a dependency and then configures the installed distribution.

```shell
./gradlew :alpha-deploy:setupEnvironment #On the IntelliJ terminal
```

After this command is completed we will have a basic Genesis server running.

### Auth Component

As part of our Quick Start application, we want to use Authentication. This is provided via our Genesis Auth component which needs installing.

To install Auth, we shall run the following command:

```shell
./gradlew :alpha-deploy:install-auth-distribution.zip #On the IntelliJ terminal
```

### Build and Deploy

Now we have our server and auth configured, let's build the alpha application:

```shell
./gradlew :distribution:distZip #On the IntelliJ terminal
```

Once built, we need to deploy it:

```shell
./gradlew :alpha-deploy:deploy-genesisproduct-alpha.zip #On the IntelliJ terminal
```

### Adding a user to login

Although we have installed, built and deployed our Auth component as part of the above server configuration. We need to add a user that we'll use to log into our new application.

:::tip
The following will be the application login details:

- Username: JaneDee
- Password: beONneON\*74 (This is encrypted in the USER.csv file.)
:::

We shall run the task `loadInitialData`. This adds the user data into the database. 

To do that we will run:

```shell
./gradlew :alpha-deploy:loadInitialData #On the IntelliJ terminal
```

We want to validate that the above was successful, the following commands will help with that.

Running `DbMon` will check that the user has been created:

```shell
./gradlew :alpha-deploy:DbMon #On the IntelliJ terminal
```

Once inside the console, type 'table USER' and then 'search 1'. If imported correctly, the user JaneDee should be listed.

### Review 

We've run a lot of commands. Therefore, it's a good time to validate everything is running as expected.

To do this, we'll use our Genesis monitor. Let's run it with: 

```shell
./gradlew :alpha-deploy:mon #On the IntelliJ terminal
```

If successful, we will see something like this:

> The PID, CPU and Memory values may differ, we're mainly looking for the process names and statuses. 

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

## Connecting the UI and Server

Finally, we want to connect everything together.  

With this next step, we will configure a Nginx working as a reverse proxy.

In the CentOS terminal, enter:

```shell
docker login genesisglobal-docker-internal.jfrog.io
...

We need to enter artifactory credentials at this point

Then enter
...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

We can run this command from within WSL or from the workstation. If running it from the CentOS shell, use the following command:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```

## Recap

Congratulations, we now have:

- Our Server running
- Our Auth component configured
- We've connected our Server and UI together