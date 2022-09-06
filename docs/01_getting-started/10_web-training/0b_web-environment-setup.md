---
title: 'Environment setup'
sidebar_label: 'Environment setup'
id: web-training-environment-setup
sidebar_position: 2
---


# Environment set-up

You must have completed the environment setup from the previous Developer Training. If that's not the case, please [do that](/getting-started/developer-training/environment-setup/) before continuing this guide.


## Start the project baseline

Clone the Web Training repo from [here](https://github.com/genesiscommunitysuccess/web-training). Alternatively, you can download a zip file with the project from [here](https://genesisglobal.jfrog.io/artifactory/community-uploads/web-training.zip).

Open the project using your favorite IDE such as IntelliJ or Visual Studio Code.

## Running the backend
You're not going to change any backend code, but we must have the server running to make our application work. To do that, we're simply going to run a different WSL distro from the Developer Training.

Download this [WSL distro](https://genesisglobal.jfrog.io/artifactory/community-uploads/web-training-wsl.zip), unzip it and import it into WSL:
- As a reminder, create a local folder where you want to run the distro, e.g., "C:\wsl\distros\web-training-distro\". Unzip the package downloaded there and, from a command line, cd into that folder then run:

    ```shell
    wsl --import web-training . web-training-wsl.backup
    ```

Next, to start the server processes, run:
```shell
wsl -d web-training
su genesis
startServer
mon
```

You should see all processes up and running. Remember to start the server processes every time you re-start your machine.

### Running the frontend
Next, [run the application locally](/getting-started/developer-training/training-content-day2/#running-the-application-locally).

If you don't get any errors, you're all set!

During the training, every time you add or change some code, make sure to reload your screen and test your changes from the browser. It's also useful to keep your browser's developer mode enabled and keep the browser console tab always open.
