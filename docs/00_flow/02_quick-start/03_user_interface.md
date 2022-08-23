---
title: 'User Interface'
id: the-user-interface
---

# User Interface

We have two key elements to our application, our user interface and our server. This section will focus on the former.

### Expected Result

By the end of this section we should have a local view of our application's user interface. We will

- Have our UI available in a web browser
- Have the ability to make changes to our UI and reflect those changes in our web browser

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

Once you see a message similar to `INFO: Accepting connections at http://localhost:3000` open the displayed URL and you should see the following:

![](/img/gpl-seed-start.png)

### Test simple UI changes

The application title is auto-generated based on what you named the project initially. If you would like to change that, open **src/main/kotlin/global/genesis/alpha/Application.kt** and customise the auto-generated application title:

```kotlin
ui("Alpha Trading Dashboard") {
    page("Home") {
        heading("Hello World")
    }
}
```
:::tip
It is useful to have the code generation terminal visible - you will see when your changes have been processed:
:::

```shell
BUILD SUCCESSFUL in 754ms
6 actionable tasks: 6 up-to-date

Waiting for changes to input files of tasks... (ctrl-d to exit)
<=============> 100% EXECUTING [54m]
> IDLE

```

You should now see the updated application title:

![](/img/gpl-seed-title.png)

## Recap

Congratulations, you now have a local view of the application's user interface. 
You have:

- made the UI available in a web browser
- made changes to the UI and reflected those changes in the web browser