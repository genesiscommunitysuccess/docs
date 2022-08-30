---
title: 'Tips and tricks'
sidebar_label: 'Tips and tricks'
id: tips-and-tricks
---

### Attaching a terminal to a docker container

Attaching a terminal to a docker container is as easy as running:


```shell
docker exec -it gsf bash
```

You can try logging as "alpha" and running "mon" to monitor the platform services.
```shell
su - alpha

mon
```

### Editing files

The container running the Genesis Platform is able to detect changes happening on your local environment.

Try editing one of the previous .kts (i.e alpha-fields-dictionary.kts). Add one more field.

You may see the changes if you run the following command on a terminal attached to the Docker container (as explained just before).

```shell
cat /home/alpha/run/alpha/cfg/alpha-fields-dictionary.kts
```

### Integration with the Deployment Plugin

The Genesis platform running on the container can be accessed via SSH on the port 1337, so the deployment plugin can be configured to operate with it.

Let's add the following in the gradle.properties in the jvm/server directory. 

```shell
genesis-home=/home/alpha/run
ssh-username=alpha
ssh-password=alpha
ssh-host=127.0.0.1
ssh-port=1337
```

Try running the gradle task "killServer".

```shell
./gradlew :genesisproduct-alpha:alpha-deploy:killServer #On the IntelliJ terminal
```

You can check running:

```shell
./gradlew :genesisproduct-alpha:alpha-deploy:mon #On the IntelliJ terminal
```
or running mon on your previously attached terminal that all services are down.
