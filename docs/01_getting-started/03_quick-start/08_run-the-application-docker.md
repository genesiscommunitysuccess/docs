---
title: 'Run the application (Docker)'
sidebar_label: 'Run the application (Docker)'
id: run-the-application-docker
---

You have a choice of how you run the application. The instructions on this page are for using Docker. If you prefer to use WSL/centOS as your environment, there are [separate instructions](/getting-started/quick-start/run-the-application/).

## Building and composing Docker images 

Usage:
```shell
docker-compose up -d #On the IntelliJ terminal
```

## Accessing the application

After everything has been built and deployed on Docker containers, the frontend is accessible on 

Usage:
```shell
http://localhost:6060
```

Once the server has successfully started all the components on the docker container, you may log in.

## Conclusion
That’s it. You have quickly built a very simple application using some fundamental Genesis components. You can see a grid of trades. Try adding a new one.

![](/img/quickstart-app-final.png)

There's obviously a lot more to building enterprise-ready applications. However, you now have enough knowledge and experience of the Genesis low-code platform to look at our reference documentation and learn more there. 

First, we strongly suggest that you check the following sections for some tips and tricks on local development.

## Attaching a terminal to a docker container

Attaching a terminal to a docker container is as easy as running:


```shell
docker exec -it gsf bash
```

You can try logging as "alpha" and running "mon" to monitor the platform services.
```shell
su - alpha

mon
```

## Editing files

The container running the Genesis low-code platform is able to detect changes happening on your local environment.

Try editing one of the previous .kts (i.e alpha-fields-dictionary.kts). Add one more field.

You may see the changes if you run the following command on a terminal attached to the Docker container (as explained just before).

```shell
cat /home/alpha/run/alpha/cfg/alpha-fields-dictionary.kts
```

### Integration with the Deployment Plugin

The Genesis low-code platform running on the container can be accessed via SSH on the port 1337, so the deployment plugin can be configured to operate with it.

Let's add the following in the **gradle.properties** in the jvm/server directory: 

```shell
genesis-home=/home/alpha/run
ssh-username=alpha
ssh-password=alpha
ssh-host=127.0.0.1
ssh-port=1337
```

On your IntelliJ terminal, try running the gradle task `killServer`.

```shell
./gradlew :genesisproduct-alpha:alpha-deploy:killServer #On the IntelliJ terminal
```

You can check how it is running:

```shell
./gradlew :genesisproduct-alpha:alpha-deploy:mon #On the IntelliJ terminal
```
Or you can run `mon` on your previously attached terminal, where you can see that all services are down.

The end
That's all we wanted you to try. We hope you have found this useful and that you enjoy exploring further.
