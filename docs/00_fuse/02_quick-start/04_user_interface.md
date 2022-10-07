---
title: 'User interface'
id: user-interface
---

# User Interface

Now we have our server running, we can start working on the user interface so that it can display the data we're fetching.

### Expected result

By the end of this section we should have a local view of our application's user interface. We will have:

- our user interface available in a web browser
- the ability to make changes to the user interface and reflect those changes in the web browser
- a working connection between the server and user interface

## User interface set-up

### Making the UI available in our web browser

Let's install the front-end dependencies:

```sh
./gradlew :npmBootstrap
```

Next, let's start the code-generation service. It will run in the background while we are building our application.

```sh
./gradlew :generateIR -t
```

In another terminal window, let's start a local web server:

```sh
./gradlew :npmStart
```

Once we see a message similar to `INFO: Accepting connections at http://localhost:3000`, open the displayed URL; you should see the following:

![](/img/login-enabled.PNG)

### Test simple UI changes

The application title is auto-generated based on what we named the project initially. 
To change that, open **src/main/kotlin/global/genesis/alpha/Application.kt** and customise the title:

```kotlin
ui("Alpha Trading Dashboard") {
    service(Login)

    page("Home") {
        heading("Hello World")
    }
}
```
:::tip
It is useful to have the code-generation terminal visible, then you'll see when the changes have been processed:
:::

```shell
BUILD SUCCESSFUL in 754ms
6 actionable tasks: 6 up-to-date

Waiting for changes to input files of tasks... (ctrl-d to exit)
<=============> 100% EXECUTING [54m]
> IDLE

```

We should now see the updated `Alpha Trading Dashboard` page title as well as the `Hello World` heading text:

![](/img/gpl-seed-start-first-changes.png)

## Connecting the Server and UI

Finally, we want to connect everything together.  

With this next step, we will configure NGINX as a reverse proxy.

In the CentOS terminal, enter:

```shell
docker login genesisglobal-docker-internal.jfrog.io
...

Before proceeding with the next step, we need to enter our artifactory credentials.

...
docker pull genesisglobal-docker-internal.jfrog.io/genesis-console-proxy:latest
#...

We can run this command from within WSL or from the workstation. If running it from the CentOS shell, use the following command:
#...
docker run -it --rm -d -p 80:80 -p 443:443 --name genesis-console-proxy --add-host localnode:$(hostname -I) genesisglobal-docker-internal.jfrog.io/genesis-console-proxy

```

## Recap

Congratulations, you now have a local view of the application's user interface. We have:

- started a local Web Server
- made the user interface available in a web browser
- made changes to the user interface and reflected those changes in the web browser
- a working connection between the server and user interface
