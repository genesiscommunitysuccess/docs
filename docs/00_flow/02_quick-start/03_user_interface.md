---
title: 'User Interface'
id: user-interface
---

# User Interface

We have two key elements to our application, our user interface and our server. This section will focus on the former.

### Expected Result

By the end of this section we should have a local view of our application's user interface. We will have:

- our UI available in a web browser
- the ability to make changes to our UI and reflect those changes in our web browser

## User Interface Set up

### Making UI available in our web browser

Let's install front-end dependencies:

```sh
./gradlew :npmBootstrap
```

Next, let's start code generation service. It will run in the background while we are building our application.

```sh
./gradlew :generateIR -t
```

In another terminal window, let's start a local Web server:

```sh
./gradlew :npmStart
```

Once we see a message similar to `INFO: Accepting connections at http://localhost:3000`, open the displayed URL, and we should see the following:

![](/img/gpl-seed-start.png)

### Test simple UI changes

The application title is auto-generated based on what we named the project initially. 
To change that, open **src/main/kotlin/global/genesis/alpha/Application.kt** and customise the title:

```kotlin
ui("Alpha Trading Dashboard") {
    page("Home") {
        heading("Hello World")
    }
}
```
:::tip
It is useful to have the code generation terminal visible, then we'll see when the changes have been processed:
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

## Recap

Congratulations, we now have a local view of the application's user interface. We have:

- Started a local Web server
- Made the UI available in a web browser
- Made changes to the UI and reflected those changes in the web browser