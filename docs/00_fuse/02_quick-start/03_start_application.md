---
title: 'Start application'
id: start-application
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Start application

By the end of this section we should have all parts of our application running. We shall:

- have our API, Web and database servers running
- load user interface in the browser
- confirm that everything is connected as expected by logging in

## Server set-up

<Tabs>
  <TabItem value="docker" label="Docker" default>

We can now start the servers:

```shell
genx app run
```

:::info
You can ocassionally run into intermittent network issues such as `npm ERR! Invalid response body` or database connectivity issues such as `Failure initialising SQL client... Database is unavailable`. If you are experiencing any of the above, simply re-run `genx app run`.

If they persist, you can run `genx app restart`. This will rebuild Docker images.

Finally, if none of the above steps have helped, you can run `genx app run clear-docker-cache` to clear your cache and try running `genx app run` again.
:::

It will take a few minutes to get everything ready. Eventually, you should see the following message:

```shell
Waiting for changes to input files of tasks... (ctrl-d to exit)
```

You can confirm that Docker containers have been started:

![](/img/gpl-docker.png)

:::danger
Application data used during local development is **not persisted** - if you restart your application, it will be lost. You can use [`DumpIt`](https://docs.genesis.global/secure/operations/commands/server-commands/#dumpit-script) command to back up your database if needed.

You can stop your application by running:
```shell
genx app stop
```
:::

  </TabItem>
  <TabItem value="wsl" label="WSL">

Before starting with the server set-up, make sure that:

- We have set up a user with name of the application (`alpha` in our case)
- FoundationDB is running (if it is not, run `systemctl start foundationdb` from WSL terminal)

If unsure about the above, refer to [WSL installation instructions](/getting-started/prerequisites/installing-wsl/).

### Preparing the server

```shell
genx app setup
```

This will:

* generate all the server and UI configuration
* extract and configure the Genesis distribution specified as a dependency
* import user login credentials

### Validating user import

We want to validate that user was set up successfully. We can do that using the `DbMon` console. Once inside the console, type `table USER` and then `search 1`. If imported correctly, the user should be listed.

```shell
genx app dbmon
```

### Build and deploy

Next, let's build and deploy our application:

```shell
genx app deploy
```

After this command is completed, we will have a basic Genesis server running.


### Making the UI available in our web browser

Next, let's start automatic UI configuration regeneration:

```shell
genx app watch
```

Finally, in another terminal window let's start a local Web server:

```shell
genx app web
```

Once `INFO: Accepting connections` message is shown, we are ready to load our UI in the browser.

  </TabItem>
</Tabs>

### Accessing user interface

We can now open <a href="http://localhost:5000/" target="_blank">http://localhost:5000/</a>.

![](/img/gpl-seed-login.png)

Our server is running, however the individual services it provides are still starting up. The login button will stay disabled until they are fully up and running, which can take a few minutes. To check progress, you can open another terminal window and run:

```shell
genx app status
```

Your output should be similar. PID, CPU and memory values may differ - we are interested in the status column:

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

### Testing end-to-end connectivity

Once all the services are running, we can login with credentials configured in the previous step (defaults are `JaneDee`/`beONneON*74`). You should see the following after a succesful login:

![](/img/gpl-seed-start.png)

At the moment our home page is virtually empty - we will fix that in the next step.

## Recap

Congratulations, you now have:

- API, Web and database servers running
- auth component loaded and configured
- user interface available in the browser
- a working connection between the server and user interface
