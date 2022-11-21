---
title: 'Environment setup'
sidebar_label: 'Environment setup'
id: web-training-environment-setup
sidebar_position: 2
---


# Environment set-up

You must have completed the environment setup from the previous Developer Training. If that's not the case, please [do that](/getting-started/developer-training/environment-setup/) before continuing this guide.


## Start the project baseline

Clone the Web Training repo from [here](https://github.com/genesiscommunitysuccess/webtraining-seed).

Open the project using your favorite IDE such as IntelliJ or Visual Studio Code.

## Running the backend
You're not going to change any backend code, but we must have the server running to make our application work. To do that, we can simply build a docker image from the project you just cloned.

You must have Docker installed and running on your workstation.


### Building the docker images
From the root directory of the project, run:
```shell
./gradlew assemble
docker-compose up -d
```

Check on your Docker dashboard that you have the containers **gsf** and **nginx** running.

### Attaching a terminal to a docker container

Attaching a terminal to a docker container is as easy as running:

```shell
docker exec -it gsf bash
```

Now try logging as **alpha** and running `mon` to monitor the platform services.
```shell
su - alpha

mon
```

You must see all processes up and running or in standby mode.

<!-- Download this [WSL distro](https://genesisglobal.jfrog.io/artifactory/community-uploads/web-training-wsl.zip), unzip it and import it into WSL:
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

## Running the front end
Next, [run the web application locally](/getting-started/developer-training/training-content-day2/#running-the-application-locally).

If you don't get any errors, you're all set!

During the training, every time you add or change some code, make sure to reload your screen and test your changes from the browser. It's also useful to keep your browser's developer mode enabled and keep the browser console tab always open.
